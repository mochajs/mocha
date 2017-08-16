'use strict';

var getOptions = require('../../bin/options');
var getOptionsPath = require('../../bin/optionsPath');
var sinon = require('sinon');

describe('mocha.opts', function () {
  var argV;
  beforeEach(function () {
    argV = process.argv;
    process.argv = [];
    process.argv[0] = 'mocha';
    process.argv[1] = 'testing';
  });

  afterEach(function () {
    process.argv = argV;
  });

  describe('getOptions()', function () {
    it('should get options from mocha.opts', function () {
      getOptions();
      var args = process.argv;
      assert.deepEqual(args, ['mocha', 'testing', '--require', 'should', '--require', './test/setup', '--ui', 'bdd', '--globals', 'okGlobalA,okGlobalB', '--globals', 'okGlobalC', '--globals', 'callback*', '--timeout', '200']);
    });

    it('should get options from mocha.opts and ignore comments; lines starting with //', function () {
      sinon.stub(getOptionsPath, 'getPath').returns('test/integration/mocha.opts.comments');
      getOptions();
      var args = process.argv;
      assert.deepEqual(args, ['mocha', 'testing', '--ui', 'bdd', '--globals', 'okGlobalC', '--globals', 'callback*', '--timeout', '200']);
    });
  });
});
