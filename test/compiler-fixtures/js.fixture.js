"use strict";

const fs = require("fs");

const original = require.extensions[".js"];
require.extensions[".js"] = function (module, filename) {
  if (!filename.includes("compiler-cjs")) {
    return original(module, filename);
  }
  const content = fs.readFileSync(filename + ".compiled", "utf8");
  return module._compile(content, filename);
};
