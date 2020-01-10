'use strict';

const assert = require('assert');
const mocha = require("../../../../lib/mocha");

for (let i = 0; i < 15; i++) {
  const r = new mocha.Runner(new mocha.Suite("" + i, undefined));
  r.run();
}

assert.equal(process.listenerCount('uncaughtException'), 1);
assert.equal(process.listeners('uncaughtException')[0].name, 'uncaughtEnd');
