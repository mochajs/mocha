// Append a "Thank you" section crediting contributors to a Github release.
// For now release please does writes the curated sectioned release notes but does not credit the one who authored the merged pull requests.
// This runs after Release please publishes a release, make Github compute the contributor list for the release and patches the existing release body to add an @-mention shout out without disturbing the curated sections.
// re-running it on a release that already has the section is a no op, meaning a re-triggered workflow will not duplicate the credits.

import { pathToFileURL } from "node:url";

const heading = "### ❤️ Thank you";
const botLogins = new Set([
  "allcontributors",
  "codecov",
  "dependabot",
  "github-actions",
  "mochajs-bot",
  "renovate",
  "claude",
  "codex",
]);

const isBot = (login) =>
  /\[bot\]$/i.test(login) || botLogins.has(login.toLowerCase());

/**
 * @param {string} notes Body returned by the `generate-notes` endpoint.
 * @returns {string[]} Sorted, de-duplicated human contributor logins.
 */
// Extract the unique human contributor logins from a Github generated release notes body. Github renders each merged PR as "… by @login in <url>", so we collect every such mention, drop bots, and sort case insensitively.
export const extractContributors = (notes) => {
  const logins = new Set();
  for (const [, login] of notes.matchAll(/\bby @([a-z\d-]+(?:\[bot\])?)/gi)) {
    if (!isBot(login)) {
      logins.add(login);
    }
  }
  return [...logins].sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase()),
  );
};

/**
 * @param {string[]} logins
 * @returns {string}
 */
// Turn ["a", "b", "c"] into @a, @b, and @c
const formatMentions = (logins) => {
  const mentions = logins.map((login) => `@${login}`);
  if (mentions.length === 1) {
    return mentions[0];
  }
  if (mentions.length === 2) {
    return mentions.join(" and ");
  }
  return `${mentions.slice(0, -1).join(", ")}, and ${mentions.at(-1)}`;
};

const githubApi = async (path, options = {}) => {
  const baseUrl = process.env.GITHUB_API_URL || "https://api.github.com";
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "x-github-api-version": "2022-11-28",
      ...options.headers,
    },
  });
  if (!response.ok) {
    throw new Error(
      `Github API ${options.method || "GET"} ${path} failed: ${
        response.status
      } ${await response.text()}`,
    );
  }
  return response.json();
};

const main = async () => {
  const repository = process.env.GITHUB_REPOSITORY;
  const tag = process.env.RELEASE_TAG;
  if (!repository || !tag) {
    throw new Error("GITHUB_REPOSITORY and RELEASE_TAG must be set.");
  }

  // compute the contributor list for this release. We reuses github's own previous-tag detection so the range always matches the release.
  const notes = await githubApi(
    `/repos/${repository}/releases/generate-notes`,
    {
      method: "POST",
      body: JSON.stringify({ tag_name: tag }),
    },
  );
  const contributors = extractContributors(notes.body);
  if (contributors.length === 0) {
    console.log("No human contributors detected = nothing/no one to credit.");
    return;
  }

  const release = await githubApi(
    `/repos/${repository}/releases/tags/${encodeURIComponent(tag)}`,
  );
  if (release.body?.includes(heading)) {
    console.log("Release already credits contributors = nothing to do.");
    return;
  }

  const section = `${heading}\n\nThank you to ${formatMentions(
    contributors,
  )} for contributing to this release! 🤎`; // The choice of brown heart follows the color of the project logo
  const body = `${(release.body ?? "").trimEnd()}\n\n${section}\n`;

  await githubApi(`/repos/${repository}/releases/${release.id}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
  console.log(
    `Credited ${contributors.length} contributor(s) on ${tag}: ${contributors.join(", ")}`,
  );
};

// Only run when executed directly so the helpers above stay unit testable.
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
