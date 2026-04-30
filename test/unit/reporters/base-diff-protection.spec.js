'use strict';

var sinon = require('sinon');
var reporters = require('../../../').reporters;
var Base = reporters.Base;
var chaiExpect = require('chai').expect;

describe('Base reporter diff hang protection', function () {
  var stdout;

  var gather = function (chunk) {
    stdout.push(chunk);
  };

  beforeEach(function () {
    sinon.stub(Base, 'useColors').value(false);
    sinon.stub(process.stdout, 'write').callsFake(gather);
    stdout = [];
  });

  afterEach(function () {
    sinon.restore();
  });

  function list(tests) {
    try {
      Base.list(tests);
    } finally {
      sinon.restore();
    }
  }

  function makeFailedTest(title, actual, expected) {
    var err = new Error('values differ');
    err.actual = actual;
    err.expected = expected;
    err.showDiff = true;
    return {
      isPending: function () { return false; },
      titlePath: function () { return [title]; },
      err: err,
      fullTitle: function () { return title; },
    };
  }

  describe('large buffers', function () {
    it('should not hang when diffing large buffers', function () {
      this.timeout(2000);

      var buf1 = Buffer.alloc(50000, 'a');
      var buf2 = Buffer.alloc(50000, 'b');
      var test = makeFailedTest('large buffer test', buf1, buf2);

      var start = Date.now();
      list([test]);
      var elapsed = Date.now() - start;

      chaiExpect(elapsed).to.be.below(1000);
      // Verify the err was handled (either truncated or replaced with fallback)
      chaiExpect(test.err.actual).to.be.a('string');
    });
  });

  describe('deeply nested objects', function () {
    it('should not hang when diffing deeply nested objects', function () {
      this.timeout(2000);

      var obj1 = {value: 1};
      var obj2 = {value: 2};

      for (var i = 0; i < 50; i++) {
        obj1 = {nested: obj1, extra: obj1};
        obj2 = {nested: obj2, extra: obj2};
      }

      var test = makeFailedTest('nested object test', obj1, obj2);

      var start = Date.now();
      list([test]);
      var elapsed = Date.now() - start;

      chaiExpect(elapsed).to.be.below(1000);
      chaiExpect(test.err.actual).to.be.a('string');
    });
  });

  describe('objects with many keys', function () {
    it('should not hang when diffing objects with many keys', function () {
      this.timeout(2000);

      var obj1 = {};
      var obj2 = {};

      for (var i = 0; i < 2000; i++) {
        obj1['key' + i] = 'value' + i;
        obj2['key' + i] = 'different' + i;
      }

      var test = makeFailedTest('many keys test', obj1, obj2);

      var start = Date.now();
      list([test]);
      var elapsed = Date.now() - start;

      chaiExpect(elapsed).to.be.below(1000);
      chaiExpect(test.err.actual).to.be.a('string');
    });
  });

  describe('normal-sized objects', function () {
    it('should still produce a valid diff for small objects', function () {
      var test = makeFailedTest('small object test', {a: 1, b: 2}, {a: 1, b: 3});

      list([test]);

      var output = stdout.join('');
      // The diff should contain the actual values, not the fallback message
      chaiExpect(output).to.not.contain('too large to diff');
    });
  });
});
