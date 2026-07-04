"use strict";

const unexpected = require("unexpected");

global.expect = unexpected
  .clone()
  .use(require("unexpected-sinon"))
  .use(require("./assertions.cjs"));
