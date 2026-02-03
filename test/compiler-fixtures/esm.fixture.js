const Module = require("node:module");
const { pathToFileURL } = require("node:url");
const path = require("node:path");

Module.register(
  pathToFileURL(path.resolve(__dirname, "esm-loader.fixture.mjs")),
);
