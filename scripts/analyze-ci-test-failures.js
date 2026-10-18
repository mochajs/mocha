import { appendFileSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

function listFiles(directory) {
  let entries;
  try {
    entries = readdirSync(directory, { recursive: true, withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => join(entry.parentPath, entry.name));
}

function testPartFromName(name) {
  return /^test-results-test-node-([^-]+)-/.exec(name)?.[1];
}

function parseTestJob(name) {
  return /test-node:([^\s/]+) on .+ with node\.js /.exec(name)?.[1];
}

export function summarizeFailures(reports, jobs) {
  const configurationsByPart = new Map();
  for (const job of jobs) {
    const part = parseTestJob(job.name);
    if (part && job.conclusion !== "skipped") {
      configurationsByPart.set(part, (configurationsByPart.get(part) ?? 0) + 1);
    }
  }

  const failuresByTest = new Map();
  for (const { artifactName, report } of reports) {
    const part = testPartFromName(artifactName);
    if (!part) continue;
    for (const failure of report.failures ?? []) {
      const key = `${part}\0${failure.fullTitle}`;
      const existing = failuresByTest.get(key);
      if (existing) {
        existing.configurations.add(artifactName);
      } else {
        failuresByTest.set(key, {
          configurations: new Set([artifactName]),
          fullTitle: failure.fullTitle,
          part,
          title: failure.title,
        });
      }
    }
  }

  return [...failuresByTest.values()]
    .map((failure) => ({
      ...failure,
      failureCount: failure.configurations.size,
      totalConfigurations: configurationsByPart.get(failure.part) ?? 0,
    }))
    .sort((a, b) => a.fullTitle.localeCompare(b.fullTitle));
}

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

async function requestGitHub(path) {
  const response = await fetch(`${process.env.GITHUB_API_URL}${path}`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: "Bearer " + process.env.GITHUB_TOKEN,
      "x-github-api-version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status} ${path}`);
  }
  return response.json();
}

async function getJobs() {
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const { jobs } = await requestGitHub(
    `/repos/${owner}/${repo}/actions/runs/${process.env.GITHUB_RUN_ID}/jobs?per_page=100`,
  );
  return jobs;
}

async function findIssues(testTitle) {
  if (!testTitle || normalize(testTitle).length < 15) return [];
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const query = new URLSearchParams({
    q: `repo:${owner}/${repo} is:issue "${testTitle.replaceAll('"', '\\"')}"`,
    per_page: "100",
  });
  const { items } = await requestGitHub(`/search/issues?${query}`);
  const normalizedTitle = normalize(testTitle);
  return items.filter((issue) =>
    normalize(`${issue.title} ${issue.body ?? ""}`).includes(normalizedTitle),
  );
}

function escapeMarkdown(text) {
  return text.replace(/([\\`*_{}[\]()#+.!|>])/g, "\\$1");
}

export function formatSummary(failures, issueMatches) {
  const lines = ["### Test failures across configurations", ""];
  for (const failure of failures) {
    const { failureCount, fullTitle, part, totalConfigurations } = failure;
    const location =
      totalConfigurations > 0
        ? `${failureCount} of ${totalConfigurations} configurations`
        : `${failureCount} configuration${failureCount === 1 ? "" : "s"}`;
    lines.push(
      `- **${escapeMarkdown(fullTitle)}** (${part}): failed in ${location}.`,
    );
    for (const issue of issueMatches.get(fullTitle) ?? []) {
      lines.push(`  - Related issue: [#${issue.number}](${issue.html_url})`);
    }
  }
  return lines.join("\n") + "\n";
}

async function main() {
  const resultsDirectory = process.argv[2];
  const reports = listFiles(resultsDirectory).map((file) => ({
    artifactName: relative(resultsDirectory, dirname(file)).split(sep)[0],
    report: JSON.parse(readFileSync(file, "utf8")),
  }));
  if (reports.length === 0) {
    console.log("No structured Mocha test results were uploaded.");
    return;
  }

  const failures = summarizeFailures(reports, await getJobs());
  const issueMatches = new Map();
  for (const failure of failures) {
    if (failure.failureCount === 1 && failure.totalConfigurations > 1) {
      try {
        issueMatches.set(failure.fullTitle, await findIssues(failure.title));
      } catch (error) {
        console.warn(
          `Could not search issues for "${failure.fullTitle}": ${error.message}`,
        );
      }
    }
  }
  const summary = formatSummary(failures, issueMatches);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
  } else {
    console.log(summary);
  }
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main().catch((error) => {
    console.error(error);
    if (process.env.GITHUB_STEP_SUMMARY) {
      appendFileSync(
        process.env.GITHUB_STEP_SUMMARY,
        `Test failure analysis could not complete: ${error.message}\n`,
      );
    }
  });
}
