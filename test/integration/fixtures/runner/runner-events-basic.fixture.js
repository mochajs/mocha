'use strict';
var Runner = require('../../../../lib/runner.js');
var assert = require('assert');

// var emitOrder = ['start', 'suite', 'suite', 'hook', 'hook end',  ];
var realEmit = Runner.prototype.emit;
Runner.prototype.emit = function(event, ...args) {
  console.log(`emit: ${event}`);
  // assert.equal(emitOrder.shift(), event);
  return realEmit.call(this, event, ...args);
};

describe('suite', function() {
  before('before', function() {});
  beforeEach('beforeEach', function() {});
  it('test', function() {});
  after('after', function() {});
  afterEach('afterEach', function() {});
});
