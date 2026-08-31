"use strict";

// Alias exports to a their normalized format Mocha#reporter to prevent a need
// for dynamic (try/catch) requires, which Browserify doesn't handle.
const { Base } = require("./base.js");
exports.Base = exports.base = Base;
const { Dot } = require("./dot.js");
exports.Dot = exports.dot = Dot;
const { Doc } = require("./doc.js");
exports.Doc = exports.doc = Doc;
const { TAP } = require("./tap.js");
exports.TAP = exports.tap = TAP;
const { JSONReporter } = require("./json.js");
exports.JSON = exports.json = JSONReporter;
const { HTML } = require("./html.js");
exports.HTML = exports.html = HTML;
const { List } = require("./list.js");
exports.List = exports.list = List;
const { Min } = require("./min.js");
exports.Min = exports.min = Min;
const { Spec } = require("./spec.js");
exports.Spec = exports.spec = Spec;
const { NyanCat } = require("./nyan.js");
exports.Nyan = exports.nyan = NyanCat;
const { XUnit } = require("./xunit.js");
exports.XUnit = exports.xunit = XUnit;
const { Markdown } = require("./markdown.js");
exports.Markdown = exports.markdown = Markdown;
const { Progress } = require("./progress.js");
exports.Progress = exports.progress = Progress;
const { Landing } = require("./landing.js");
exports.Landing = exports.landing = Landing;
const { JSONStream } = require("./json-stream.js");
exports.JSONStream = exports["json-stream"] = JSONStream;
const { GithubActions } = require("./github-actions.js");
exports.GithubActions = exports["github-actions"] = GithubActions;
