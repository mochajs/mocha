import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { baseURL, PORT, SETUP_BUNDLE_PATH, suites } from "./config.mjs";

const root = path.resolve(fileURLToPath(import.meta.url), "../../..");

const MIME_TYPES = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".map": "application/json",
  ".mjs": "text/javascript",
};

/**
 * Builds the HTML runner page for a single suite.
 *
 * @param {import("./config.mjs").BrowserSuite} suite
 * @returns {string}
 */
const renderRunner = (suite) => {
  const tags = [
    `<script src="/mocha.js"></script>`,
    `<script src="/${SETUP_BUNDLE_PATH}"></script>`,
    // Capture this instance: the ESM suite re-imports mocha.js which would otherwise overwrite window.mocha with a fresh, "test-less" (if it is a word) instance.
    `<script>mocha.setup({ ui: ${JSON.stringify(suite.ui)}, reporter: "html" }); window.__mocha = mocha;</script>`,
    ...(suite.specs ?? []).map((src) => `<script src="${src}"></script>`),
    ...(suite.modules ?? []).map(
      (src) => `<script type="module" src="${src}"></script>`,
    ),
    // Loaded as a module so it runs after any "type=module" specs above.
    `<script type="module">
      const failures = [];
      const runner = window.__mocha.run();
      runner.on("fail", (test, err) => {
        failures.push({
          title: test.fullTitle(),
          message: (err && (err.stack || err.message)) || String(err),
        });
      });
      runner.on("end", () => {
        window.__mochaResults = {
          failures,
          passes: runner.stats.passes,
          total: runner.stats.tests,
        };
      });
    </script>`,
  ];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>mocha: ${suite.name}</title></head><body><div id="mocha"></div>${tags.join("")}</body></html>`;
};

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, baseURL);

  if (pathname === "/") {
    res.writeHead(200, { "content-type": "text/plain" });
    res.end("ok");
    return;
  }

  const runMatch = pathname.match(/^\/run\/([\w-]+)$/);
  if (runMatch) {
    const suite = suites.find((candidate) => candidate.name === runMatch[1]);
    if (!suite) {
      res.writeHead(404);
      res.end(`unknown suite: ${runMatch[1]}`);
      return;
    }
    res.writeHead(200, { "content-type": "text/html" });
    res.end(renderRunner(suite));
    return;
  }

  const filePath = path.join(root, decodeURIComponent(pathname));
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    res.writeHead(403);
    res.end("forbidden");
    return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(`not found: ${pathname}`);
      return;
    }
    res.writeHead(200, {
      "content-type":
        MIME_TYPES[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Mocha browser test server listening on ${baseURL}`);
});
