"use strict";

const path = require("node:path");
const Mocha = require("../../../../../lib/mocha");

const mocha = new Mocha({
    require: [path.join(__dirname, "root-hook-defs-a.fixture.js")],
});

mocha.addFile(path.join(__dirname, "root-hook-test.fixture.js"));

mocha.run(function (failures) {
    process.exitCode = failures ? 1 : 0;
});