import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  integrations: [
    starlight({
      components: {
        Footer: "./src/components/Footer.astro",
        Head: "./src/components/Head.astro",
        PageTitle: "./src/components/PageTitle.astro",
      },
      customCss: ["./src/style/custom.css"],
      logo: {
        dark: "./src/components/icon-dark.svg",
        light: "./src/components/icon-light.svg",
      },
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
        {
          items: [
            { label: "Browsers", slug: "running/browsers" },
            { label: "CLI", slug: "running/cli" },
            { label: "Configuring", slug: "running/configuring" },
            { label: "Editor plugins", slug: "running/editor-plugins" },
            { label: "Test globs", slug: "running/test-globs" },
          ],
          label: "Running Mocha",
        },
        {
          items: [
            { label: "Dynamic tests", slug: "declaring/dynamic-tests" },
            { label: "Exclusive tests", slug: "declaring/exclusive-tests" },
            { label: "Inclusive tests", slug: "declaring/inclusive-tests" },
            { label: "Pending tests", slug: "declaring/pending-tests" },
            { label: "Retrying tests", slug: "declaring/retrying-tests" },
          ],
          label: "Declaring Tests",
        },
        {
          items: [
            { label: "Arrow functions", slug: "features/arrow-functions" },
            { label: "Assertions", slug: "features/assertions" },
            { label: "Asynchronous code", slug: "features/asynchronous-code" },
            { label: "Diffs", slug: "features/diffs" },
            { label: "Error codes", slug: "features/error-codes" },
            { label: "Global fixtures", slug: "features/global-fixtures" },
            { label: "Hooks", slug: "features/hooks" },
            { label: "Parallel mode", slug: "features/parallel-mode" },
            { label: "Root hook plugins", slug: "features/root-hook-plugins" },
            { label: "Timeouts", slug: "features/timeouts" },
          ],
          label: "Features",
        },
        {
          collapsed: true,
          items: [
            { label: "About", slug: "interfaces/about" },
            { label: "BDD (default)", slug: "interfaces/bdd" },
            { label: "Exports", slug: "interfaces/exports" },
            { label: "QUnit", slug: "interfaces/qunit" },
            { label: "Require", slug: "interfaces/require" },
            { label: "TDD", slug: "interfaces/tdd" },
            { label: "Third-Party", slug: "interfaces/third-party" },
          ],
          label: "Interfaces",
        },
        {
          collapsed: true,
          items: [
            { label: "About", slug: "reporters/about" },
            { label: "Doc", slug: "reporters/doc" },
            { label: "Dot", slug: "reporters/dot" },
            { label: "HTML", slug: "reporters/html" },
            { label: "JSON Stream", slug: "reporters/json-stream" },
            { label: "JSON", slug: "reporters/json" },
            { label: "Landing", slug: "reporters/landing" },
            { label: "List", slug: "reporters/list" },
            { label: "Markdown", slug: "reporters/markdown" },
            { label: "Min", slug: "reporters/min" },
            { label: "Nyan", slug: "reporters/nyan" },
            { label: "Progress", slug: "reporters/progress" },
            { label: "Spec (default)", slug: "reporters/spec" },
            { label: "Tap", slug: "reporters/tap" },
            { label: "Third-Party", slug: "reporters/third-party" },
            { label: "XUnit", slug: "reporters/xunit" },
          ],
          label: "Reporters",
        },
        {
          collapsed: true,
          items: [
            {
              label: "Compilers deprecation",
              slug: "explainers/compilers-deprecation",
            },
            {
              label: "Counting assertions",
              slug: "explainers/count-assertions",
            },
            {
              label: "Detecting multiple calls to done()",
              slug: "explainers/detecting-multiple-calls-to-done",
            },
            {
              label: "Environment variables",
              slug: "explainers/environment-variables",
            },
            {
              label: "Find global leaks",
              slug: "explainers/find-global-leaks",
            },
            {
              label: "Global variables",
              slug: "explainers/global-variables",
            },
            {
              label: "Node.js native ESM support",
              slug: "explainers/nodejs-native-esm-support",
            },
            {
              label: "Programmatic usage",
              slug: "explainers/programmatic-usage",
            },
            {
              label: "Related tools",
              slug: "explainers/related-tools",
            },
            {
              label: "Run cycle overview",
              slug: "explainers/run-cycle-overview",
            },
            {
              label: "Security vulnerability reports",
              slug: "explainers/security-vulnerability-reports",
            },
            {
              label: "Shared behaviours",
              slug: "explainers/shared-behaviours",
            },
            {
              label: "Spies",
              slug: "explainers/spies",
            },
            {
              label: "Stub stdout",
              slug: "explainers/stub-stdout",
            },
            {
              label: "Tagging with --grep",
              slug: "explainers/tagging",
            },
            { label: "Test duration", slug: "explainers/test-duration" },
            {
              label: "Test fixture decision tree",
              slug: "explainers/test-fixture-decision-tree",
            },
            {
              label: "Third party reporters",
              slug: "explainers/third-party-reporters",
            },
            {
              label: "Third party UIs",
              slug: "explainers/third-party-uis",
            },
          ],
          label: "Explainers",
        },
        {
          label: "API",
          link: "https://mochajs.org/api",
        },
      ],
      social: [
        {
          icon: "discord",
          label: "Discord",
          href: "https://discord.gg/KeDn2uXhER",
        },
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/mochajs/mocha",
        },
      ],
      title: "Mocha",
    }),
  ],
});
