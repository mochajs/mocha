import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
  // For now, this is only being deployed to mocha-docs-next.netlify.app.
  // Soon we'll move it onto mochajs.org/next.
  ...(!process.env.NETLIFY_BUILD_BASE && { base: "/next" }),
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
            { label: "CLI", slug: "running/cli" },
            { label: "Configuring", slug: "running/configuring" },
            { label: "Editor Plugins", slug: "running/editor-plugins" },
            { label: "Browsers", slug: "running/browsers" },
            { label: "Test Globs", slug: "running/test-globs" },
          ],
          label: "Running Mocha",
        },
        {
          items: [
            { label: "Dynamic Tests", slug: "declaring/dynamic-tests" },
            { label: "Exclusive Tests", slug: "declaring/exclusive-tests" },
            { label: "Inclusive Tests", slug: "declaring/inclusive-tests" },
            { label: "Pending Tests", slug: "declaring/pending-tests" },
            { label: "Retrying Tests", slug: "declaring/retrying-tests" },
          ],
          label: "Declaring Tests",
        },
        {
          items: [
            { label: "Arrow Functions", slug: "features/arrow-functions" },
            { label: "Assertions", slug: "features/assertions" },
            { label: "Asynchronous Code", slug: "features/asynchronous-code" },
            { label: "Error Codes", slug: "features/error-codes" },
            { label: "Global Fixtures", slug: "features/global-fixtures" },
            { label: "Hooks", slug: "features/hooks" },
            { label: "Parallel Mode", slug: "features/parallel-mode" },
            { label: "Root Hook Plugins", slug: "features/root-hook-plugins" },
            { label: "Timeouts", slug: "features/timeouts" },
          ],
          label: "Features",
        },
        {
          collapsed: true,
          items: [
            { label: "BDD (Default)", slug: "interfaces/bdd" },
            { label: "TDD", slug: "interfaces/tdd" },
            { label: "Exports", slug: "interfaces/exports" },
            { label: "QUnit", slug: "interfaces/qunit" },
            { label: "Require", slug: "interfaces/require" },
            { label: "Third-Party", slug: "interfaces/third-party" },
          ],
          label: "Interfaces",
        },
        {
          collapsed: true,
          items: [
            { label: "Spec (Default)", slug: "reporters/spec" },
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
            { label: "Tap", slug: "reporters/tap" },
            { label: "XUnit", slug: "reporters/xunit" },
            { label: "Third-Party", slug: "reporters/third-party" },
          ],
          label: "Reporters",
        },
        {
          collapsed: true,
          items: [
            {
              label: "Detecting Multiple Calls to done()",
              slug: "explainers/detecting-multiple-calls-to-done",
            },
            {
              label: "Node.js Native ESM Support",
              slug: "explainers/nodejs-native-esm-support",
            },
            {
              label: "Run Cycle Overview",
              slug: "explainers/run-cycle-overview",
            },
            { label: "Test Duration", slug: "explainers/test-duration" },
            {
              label: "Test Fixture Decision Tree",
              slug: "explainers/test-fixture-decision-tree",
            },
          ],
          label: "Explainers",
        },
        {
          label: "API",
          link: "https://mochajs.org/api",
        },
      ],
      social: {
        discord: "https://discord.gg/KeDn2uXhER",
        github: "https://github.com/mochajs/mocha",
      },
      title: "Mocha",
    }),
  ],
});
