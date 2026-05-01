"use strict";

// Alias exports to a their normalized format Mocha#reporter to prevent a need
// for dynamic (try/catch) requires, which Browserify doesn't handle.
exports.Base = exports.base = require("./base");
const { Dot } = require("./dot.mjs");
exports.Dot = exports.dot = Dot;
const { Doc } = require("./doc.mjs");
exports.Doc = exports.doc = Doc;
const { TAP } = require("./tap.mjs");
exports.TAP = exports.tap = TAP;
const { JSONReporter } = require("./json.mjs");
exports.JSON = exports.json = JSONReporter;
const { HTML } = require("./html.mjs");
exports.HTML = exports.html = HTML;
const { List } = require("./list.mjs");
exports.List = exports.list = List;
const { Min } = require("./min.mjs");
exports.Min = exports.min = Min;
const { Spec } = require("./spec.mjs");
exports.Spec = exports.spec = Spec;
const { NyanCat } = require("./nyan.mjs");
exports.Nyan = exports.nyan = NyanCat;
const { XUnit } = require("./xunit.mjs");
exports.XUnit = exports.xunit = XUnit;
const { Markdown } = require("./markdown.mjs");
exports.Markdown = exports.markdown = Markdown;
const { Progress } = require("./progress.mjs");
exports.Progress = exports.progress = Progress;
const { Landing } = require("./landing.mjs");
exports.Landing = exports.landing = Landing;
const { JSONStream } = require("./json-stream.mjs");
exports.JSONStream = exports["json-stream"] = JSONStream;
