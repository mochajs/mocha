"use strict";

process.stdout = require("browser-stdout")();

global.expect = require("unexpected")
  .clone()
  .use(require("unexpected-eventemitter"))
  .use(require("unexpected-sinon"));
