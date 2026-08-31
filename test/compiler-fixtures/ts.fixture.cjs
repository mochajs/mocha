"use strict";

const fs = require("fs");

require.extensions[".ts"] = function (module, filename) {
  const content = fs.readFileSync(filename + ".compiled", "utf8");
  return module._compile(content, filename);
};
