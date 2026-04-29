"use strict";

exports.bdd = require("./bdd");
exports.tdd = require("./tdd");
exports.qunit = require("./qunit");
const { exportsInterface } = require("./exports.mjs");
exports.exports = exportsInterface;
