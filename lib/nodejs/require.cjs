"use strict";

const path = require("node:path");

const requireFromCwd = (request) =>
  require(require.resolve(request, { paths: [process.cwd()] }));

requireFromCwd.resolve = (request) =>
  require.resolve(request, { paths: [process.cwd()] });

exports.requireFromCwd = requireFromCwd;
exports.requireFromMocha = (request) =>
  require(path.resolve(__dirname, "..", request));
