'use strict';
var Runner = require('../../../../lib/runner.js');
var assert = require('assert');

var emitOrder = [
  'suite'/* incorrect order*/, 'start', 'suite',
  'hook', 'hook end', 'test', 'hook', 'hook end', 'pass', 'test end', 'hook', 'hook end',
  'suite', 'test', 'hook', 'hook end', 'pass', 'test end', 'hook', 'hook end',
  'suite end', 'hook', 'hook end', 'suite end', 'suite end', 'end'
];

var realEmit = Runner.prototype.emit;
Runner.prototype.emit = function(event, ...args) {
  // console.log(`emit: ${event}`);  
  assert.strictEqual(event, emitOrder.shift());
  return realEmit.call(this, event, ...args);
};

describe('suite A', function() {
  before('before', function() {});
  beforeEach('beforeEach', function() {});
  it('test A', function() {});
  describe('suite B', function() {
    it('test B', function() {});
  });
  afterEach('afterEach', function() {});
  after('after', function() {});
});
