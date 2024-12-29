import { Octokit } from "octokit";
import fs from "node:fs";
import { console } from "node:inspector";

const token = process.env.GITHUB_TOKEN || "";
const owner = "mochajs";
const repo = "mocha";

const octokit = new Octokit({ auth: token});

async function getLastReleaseDate() {
    try {
        const { data: releases } = await octokit.request('GET /repos/{owner}/{repo}/releases', {
            owner,
            repo,
            per_page: 2
        });

        if (releases.length > 1) {
            return  new Date(releases[1].published_at);
        }

        return new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    } catch (error) {
        console.error("Error fetching releases:", error);
        return new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
    }
}

async function getContributorFullName(username) {
    try {
        const { data } = await octokit.request('GET /users/{username}', {
            username: username
        });
        return data.name || username;
    } catch (error) {
        console.error(`Error fetching user info for ${username}:`, error);
        return username;
    }
}

async function getContributors() {
    try {
        const lastReleaseDate = await getLastReleaseDate();
        const contributors = new Map();
        let page = 1;
        const per_page = 100;

        while (true) {
            const { data } = await octokit.request('GET /repos/{owner}/{repo}/pulls', {
                owner,
                repo,
                state: "closed",
                sort: "updated",
                direction: "desc",
                per_page,
                page
            });

            if (data.length === 0) break;

            for (const pr of data) {
                if (new Date(pr.merged_at) <= lastReleaseDate) {
                    break;
                }

                if (pr.merged_at && !pr.user.login.includes('[bot]')) {
                    if (!contributors.has(pr.user.login)) {
                        const fullName = await getContributorFullName(pr.user.login);
                        contributors.set(pr.user.login, fullName);
                    }
                }
            }

            if (data[data.length - 1].merged_at && new Date(data[data.length - 1].merged_at) <= lastReleaseDate){
                break;
            }
            page++;
        }
    return contributors;
    } catch (error) {
        console.error("Error fetching contributors:", error);
        return new Map();
    }
}

async function appendThankYouSection() {
    try {
        const changelogPath = "CHANGELOG.md";
        const contributors = await getContributors();

        if (contributors.size === 0) {
            return;
        }
        let thankYouSection = "\n## ❤️ Thank You\n\n";
        for (const [username, fullName] of contributors) {
            thankYouSection += `* ${fullName} @${username}\n`;
        }
        thankYouSection += "\n";

        const existingContent = fs.readFileSync(changelogPath, "utf-8");

        const lines = existingContent.split("\n");

        const firstVersionIndex = lines.findIndex(line => line.startsWith("#"));
        if (firstVersionIndex === -1){
            return;
        }

        const nextVersionIndex = lines.slice(firstVersionIndex + 1)
            .findIndex(line => line.startsWith("#"));

        const insertPosition = nextVersionIndex !== -1
        ? firstVersionIndex + nextVersionIndex + 1: lines.length;

        lines.splice(insertPosition, 0, thankYouSection);

        fs.writeFileSync(changelogPath, lines.join("\n"), "utf-8");
        console.log("Thank you section added to  changelog!")

    } catch (error) {
        console.error("Error updating CHANGELOG.md:", error);
    }
}
appendThankYouSection();