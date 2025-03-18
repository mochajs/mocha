'use strict';

const mocha = require('../../lib/mocha');

const beforeEach = mocha.beforeEach;
const it = mocha.it;
const describe = mocha.describe;

describe('it.only via require("mocha")', function () {
  beforeEach(function () {
    this.didRunBeforeEach = true;
  });
  describe('nested within a describe/context', function () {
    it.only('should run all enclosing beforeEach hooks', function () {
      require('node:assert').strictEqual(this.didRunBeforeEach, true);
    });
  });
});
