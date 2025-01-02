'use strict';

var os = require('node:os');
var fs = require('node:fs');
var crypto = require('node:crypto');
var path = require('node:path');
var run = require('./helpers').runMocha;

describe('reporters', function () {
  describe('markdown', function () {
    var res;

    before(function (done) {
      run(
        'passing.fixture.js',
        ['--reporter', 'markdown'],
        function (err, result) {
          res = result;
          done(err);
        }
      );
    });

    it('does not exceed maximum callstack (issue: 1875)', function () {
      expect(res.output, 'not to contain', 'RangeError');
    });

    it('contains spec src', function () {
      var src = ['```js', 'assert(true);', '```'].join('\n');

      expect(res.output, 'to contain', src);
    });
  });

  describe('xunit', function () {
    it('prints test cases with --reporter-options output (issue: 1864)', function (done) {
      var randomStr = crypto.randomBytes(8).toString('hex');
      var tmpDir = os.tmpdir().replace(new RegExp(path.sep + '$'), '');
      var tmpFile = tmpDir + path.sep + 'test-issue-1864-' + randomStr + '.xml';

      var args = [
        '--reporter=xunit',
        '--reporter-options',
        'output=' + tmpFile
      ];
      var expectedOutput = [
        '<testcase classname="suite" name="test1" file="',
        '<testcase classname="suite" name="test2" file="',
        '</testsuite>'
      ];

      run('passing.fixture.js', args, function (err, result) {
        if (err) return done(err);

        var xml = fs.readFileSync(tmpFile, 'utf8');
        fs.unlinkSync(tmpFile);

        expectedOutput.forEach(function (line) {
          expect(xml, 'to contain', line);
        });

        done(err);
      });
    });
  });

  describe('loader', function () {
    it('loads a reporter from a path relative to the current working directory', function (done) {
      var reporterAtARelativePath =
        'test/integration/fixtures/simple-reporter.js';

      var args = ['--reporter=' + reporterAtARelativePath];

      run('passing.fixture.js', args, function (err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(result, 'to have passed');
        done();
      });
    });

    it('loads a reporter from an absolute path', function (done) {
      // Generates an absolute path string
      var reporterAtAnAbsolutePath = path.join(
        process.cwd(),
        'test/integration/fixtures/simple-reporter.js'
      );

      var args = ['--reporter=' + reporterAtAnAbsolutePath];

      run('passing.fixture.js', args, function (err, result) {
        if (err) {
          done(err);
          return;
        }
        expect(result, 'to have passed');
        done();
      });
    });
  });

  describe('tap', function () {
    var not = function (predicate) {
      return function () {
        return !predicate.apply(this, arguments);
      };
    };
    var versionPredicate = function (line) {
      return line.match(/^TAP version \d+$/) != null;
    };
    var planPredicate = function (line) {
      return line.match(/^1\.\.\d+$/) != null;
    };
    var testLinePredicate = function (line) {
      return line.match(/^not ok/) != null || line.match(/^ok/) != null;
    };
    var diagnosticPredicate = function (line) {
      return line.match(/^#/) != null;
    };
    var bailOutPredicate = function (line) {
      return line.match(/^Bail out!/) != null;
    };
    var anythingElsePredicate = function (line) {
      return (
        versionPredicate(line) === false &&
        planPredicate(line) === false &&
        testLinePredicate(line) === false &&
        diagnosticPredicate(line) === false &&
        bailOutPredicate(line) === false
      );
    };

    describe('produces valid TAP v13 output', function () {
      var runFixtureAndValidateOutput = function (fixture, expected) {
        it('for ' + fixture, function (done) {
          var args = ['--reporter=tap', '--reporter-option', 'tapVersion=13'];

          run(fixture, args, function (err, res) {
            if (err) {
              done(err);
              return;
            }

            var expectedVersion = 13;
            var expectedPlan = '1..' + expected.numTests;

            var outputLines = res.output.split('\n');

            // first line must be version line
            expect(
              outputLines[0],
              'to equal',
              'TAP version ' + expectedVersion
            );

            // plan must appear once
            expect(outputLines, 'to contain', expectedPlan);
            expect(
              outputLines.filter(function (l) {
                return l === expectedPlan;
              }),
              'to have length',
              1
            );
            // plan cannot appear in middle of the output
            var firstTestLine = outputLines.findIndex(testLinePredicate);
            // there must be at least one test line
            expect(firstTestLine, 'to be greater than', -1);
            var lastTestLine =
              outputLines.length -
              1 -
              outputLines.slice().reverse().findIndex(testLinePredicate);
            var planLine = outputLines.findIndex(function (line) {
              return line === expectedPlan;
            });
            expect(
              planLine < firstTestLine || planLine > lastTestLine,
              'to equal',
              true
            );

            done();
          });
        });
      };

      runFixtureAndValidateOutput('passing.fixture.js', {
        numTests: 2
      });
      runFixtureAndValidateOutput('reporters.fixture.js', {
        numTests: 12
      });
    });

    it('should fail if given invalid `tapVersion`', function (done) {
      var invalidTapVersion = 'nosuch';
      var args = [
        '--reporter=tap',
        '--reporter-option',
        'tapVersion=' + invalidTapVersion
      ];

      run(
        'reporters.fixture.js',
        args,
        function (err, res) {
          if (err) {
            done(err);
            return;
          }

          var pattern = `Error: invalid or unsupported TAP version: "${invalidTapVersion}"`;
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(pattern, 'm')
          });
          done();
        },
        {stdio: 'pipe'}
      );
    });

    it('places exceptions correctly in YAML blocks', function (done) {
      var args = ['--reporter=tap', '--reporter-option', 'tapVersion=13'];

      run('reporters.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }

        var outputLines = res.output.split('\n');

        for (var i = 0; i + 1 < outputLines.length; i++) {
          if (
            testLinePredicate(outputLines[i]) &&
            testLinePredicate(outputLines[i + 1]) === false
          ) {
            var blockLinesStart = i + 1;
            var blockLinesEnd =
              i +
              1 +
              outputLines.slice(i + 1).findIndex(not(anythingElsePredicate));
            var blockLines =
              blockLinesEnd > blockLinesStart
                ? outputLines.slice(blockLinesStart, blockLinesEnd)
                : outputLines.slice(blockLinesStart);
            i += blockLines.length;

            expect(blockLines[0], 'to match', /^\s+---/);
            expect(blockLines[blockLines.length - 1], 'to match', /^\s+\.\.\./);
          }
        }

        done();
      });
    });
  });
});
