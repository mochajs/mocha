import Module from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

Module.register(
  pathToFileURL(path.resolve(__dirname, "esm-loader.fixture.mjs")),
);
