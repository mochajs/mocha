import {
  formatSummary,
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
                { title: "should work", fullTitle: "suite should work" },
              ],
            },
          },
          {
            artifactName: "test-results-test-node-unit-windows-latest-node-22",
            report: {
              failures: [
                { title: "should work", fullTitle: "suite should work" },
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
});
