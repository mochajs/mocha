"use strict";

// Alias exports to a their normalized format Mocha#reporter to prevent a need
// for dynamic (try/catch) requires, which Browserify doesn't handle.
exports.Base = exports.base = require("./base");
const { Dot } = require("./dot.mjs");
exports.Dot = exports.dot = Dot;
exports.Doc = exports.doc = require("./doc");
exports.TAP = exports.tap = require("./tap");
exports.JSON = exports.json = require("./json");
exports.HTML = exports.html = require("./html");
const { List } = require("./list.mjs");
exports.List = exports.list = List;
const { Min } = require("./min.mjs");
exports.Min = exports.min = Min;
exports.Spec = exports.spec = require("./spec");
exports.Nyan = exports.nyan = require("./nyan");
exports.XUnit = exports.xunit = require("./xunit");
exports.Markdown = exports.markdown = require("./markdown");
exports.Progress = exports.progress = require("./progress");
exports.Landing = exports.landing = require("./landing");
exports.JSONStream = exports["json-stream"] = require("./json-stream");
exports.GithubActions = exports["github-actions"] = require("./github-actions");
