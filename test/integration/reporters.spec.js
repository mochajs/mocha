'use strict';

var assert = require('assert');
var os = require('os');
var fs = require('fs');
var crypto = require('crypto');
var path = require('path');
var run = require('./helpers').runMocha;

describe('reporters', function () {
  describe('markdown', function () {
    var res;

    before(function (done) {
      run('passing.fixture.js', ['--reporter', 'markdown'], function (err, result) {
        res = result;
        done(err);
      });
    });

    it('does not exceed maximum callstack (issue: 1875)', function () {
      assert(res.output.indexOf('RangeError') === -1, 'Threw RangeError');
    });

    it('contains spec src', function () {
      var src = [
        '```js',
        'assert(true);',
        '```'
      ].join('\n');

      assert(res.output.indexOf(src) !== -1, 'No assert found');
    });
  });

  describe('xunit', function () {
    it('prints test cases with --reporter-options output (issue: 1864)', function (done) {
      var randomStr = crypto.randomBytes(8).toString('hex');
      var tmpDir = os.tmpDir().replace(new RegExp(path.sep + '$'), '');
      var tmpFile = tmpDir + path.sep + 'test-issue-1864-' + randomStr + '.xml';

      var args = ['--reporter=xunit', '--reporter-options', 'output=' + tmpFile];
      var expectedOutput = [
        '<testcase classname="suite" name="test1" time="',
        '<testcase classname="suite" name="test2" time="',
        '</testsuite>'
      ];

      run('passing.fixture.js', args, function (err, result) {
        if (err) return done(err);

        var xml = fs.readFileSync(tmpFile, 'utf8');
        fs.unlinkSync(tmpFile);

        expectedOutput.forEach(function (line) {
          assert(xml.indexOf(line) !== -1, 'XML did not contain ' + line);
        });

        done(err);
      });
    });
  });

  describe('json', function () {
    it('prints test cases with --reporter-options output', function (done) {
      var randomStr = crypto.randomBytes(8).toString('hex');
      var tmpDir = os.tmpDir().replace(new RegExp(path.sep + '$'), '');
      var tmpFile = tmpDir + path.sep + 'test-json-reporter-options-' + randomStr + '.json';

      var args = ['--reporter=json', '--reporter-options', 'output=' + tmpFile];
      run('passing.fixture.js', args, function (err, result) {
        if (err) return done(err);

        var json = fs.readFileSync(tmpFile, 'utf8');
        fs.unlinkSync(tmpFile);
        var results = JSON.parse(json);
        assert(results.passes, 'JSON did not contain the expected passes array.');
        assert(results.passes.length === 2, 'JSON did not contain the expected number of results.');
        done(err);
      });
    });
  });

  describe('multiple', function () {
    it('supports multiple reporters and reporter options', function (done) {
      var randomStr = crypto.randomBytes(8).toString('hex');
      var tmpDir = os.tmpDir().replace(new RegExp(path.sep + '$'), '');
      var tmpJsonFile = tmpDir + path.sep + 'test-multiple-reporters-' + randomStr + '.json';
      var tmpXmlFile = tmpDir + path.sep + 'test-multiple-reporters-' + randomStr + '.xml';

      var args = ['--reporter=json,xunit', '--reporter-options', 'xunit:{output=' + tmpXmlFile + '},json:{output=' + tmpJsonFile + '}'];
      run('passing.fixture.js', args, function (err, result) {
        if (err) return done(err);

        var json = fs.readFileSync(tmpJsonFile, 'utf8');
        fs.unlinkSync(tmpJsonFile);
        var xml = fs.readFileSync(tmpXmlFile, 'utf8');
        fs.unlinkSync(tmpXmlFile);
        assert(json.length > 0, 'JSON file is empty.');
        assert(xml.length > 0, 'XML file is empty');
        done(err);
      });
    });
  });
});
