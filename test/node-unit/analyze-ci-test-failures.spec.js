import {
  formatIssueBody,
  formatSummary,
  issueMatchesFailure,
  summarizeFailures,
} from "../../scripts/analyze-ci-test-failures.js";

describe("analyze-ci-test-failures", function () {
  describe("summarizeFailures()", function () {
    it("counts a failure once when it appears in multiple configurations", function () {
      const summary = summarizeFailures(
        [
          {
            artifactName: "test-results-test-node-unit-ubuntu-latest-node-22",
            report: {
              failures: [
                {
                  title: "should work",
                  fullTitle: "suite should work",
                  err: { message: "expected true to be false" },
                },
              ],
            },
          },
          {
            artifactName: "test-results-test-node-unit-windows-latest-node-22",
            report: {
              failures: [
                {
                  title: "should work",
                  fullTitle: "suite should work",
                  err: { message: "expected true to be false" },
                },
              ],
            },
          },
        ],
        [
          {
            name: "test-node:unit on ubuntu-latest with node.js 22",
            conclusion: "failure",
          },
          {
            name: "test-node:unit on windows-latest with node.js 22",
            conclusion: "failure",
          },
        ],
      );

      expect(summary, "to satisfy", [
        {
          failureCount: 2,
          fullTitle: "suite should work",
          part: "unit",
          title: "should work",
          totalConfigurations: 2,
          errorMessages: ["expected true to be false"],
        },
      ]);
    });

    it("reports failures from a single configuration against the full matrix", function () {
      const summary = summarizeFailures(
        [
          {
            artifactName:
              "test-results-test-node-integration-ubuntu-latest-node-22",
            report: {
              failures: [
                { title: "should watch", fullTitle: "watch should watch" },
              ],
            },
          },
        ],
        [
          {
            name: "test-node:integration on ubuntu-latest with node.js 22",
            conclusion: "failure",
          },
          {
            name: "test-node:integration on windows-latest with node.js 22",
            conclusion: "success",
          },
          {
            name: "test-node:integration on ubuntu-latest with node.js 24",
            conclusion: "success",
          },
        ],
      );

      expect(summary[0], "to satisfy", {
        failureCount: 1,
        totalConfigurations: 3,
      });
    });
  });

  it("includes related issue links in the summary", function () {
    const summary = formatSummary(
      [
        {
          failureCount: 1,
          fullTitle: "watch should watch",
          part: "integration",
          totalConfigurations: 8,
        },
      ],
      new Map([
        [
          "watch should watch",
          [
            {
              number: 123,
              html_url: "https://github.com/mochajs/mocha/issues/123",
            },
          ],
        ],
      ]),
    );

    expect(
      summary,
      "to contain",
      "[#123](https://github.com/mochajs/mocha/issues/123)",
    );
    expect(summary, "to contain", "1 of 8 configurations");
  });

  it("matches existing flaky-test issues and marks issue reports for stable updates", function () {
    const failure = {
      configurations: new Set(["ubuntu-latest-node-22"]),
      failureCount: 1,
      fullTitle: "watch should rerun tests",
      part: "integration",
      title: "should rerun tests",
      totalConfigurations: 8,
      errorMessages: ["expected 1 to equal 2"],
    };
    const issue = {
      title: 'Flaky test: "watch should rerun tests"',
      body: "",
    };

    expect(issueMatchesFailure(issue, failure), "to be true");
    expect(
      issueMatchesFailure({ title: "Flaky test: another test" }, failure),
      "to be false",
    );
    expect(
      issueMatchesFailure(
        {
          title: 'Flaky test: "another suite should rerun tests"',
          body: "<!-- mocha-ci-failure:different-test -->",
        },
        failure,
      ),
      "to be false",
    );

    const body = formatIssueBody(
      failure,
      "https://github.com/mochajs/mocha/actions/runs/123",
      "Maintainer notes about this flaky test.",
    );
    const updatedBody = formatIssueBody(
      failure,
      "https://github.com/mochajs/mocha/actions/runs/123",
      body,
    );
    expect(body, "to start with", "Maintainer notes about this flaky test.");
    expect(updatedBody, "to equal", body);
    expect(body, "to contain", "1 of 8 configurations");
    expect(body, "to contain", "expected 1 to equal 2");
    expect(body, "to contain", "actions/runs/123");
    expect(body, "to contain", "<!-- mocha-ci-failure:");
  });
});
