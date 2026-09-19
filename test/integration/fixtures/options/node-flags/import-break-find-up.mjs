import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Module = require("node:module");
const originalResolveFilename = Module._resolveFilename;

Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "find-up" || request.startsWith("find-up/")) {
    const err = new Error(
      'No "exports" main defined in node_modules/unicorn-magic/package.json',
    );
    err.code = "ERR_PACKAGE_PATH_NOT_EXPORTED";
    throw err;
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};
