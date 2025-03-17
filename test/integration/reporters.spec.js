'use strict';

const os = require('node:os');
const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const run = require('./helpers').runMocha;

describe('reporters', function () {
  describe('markdown', function () {
    let res;

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
      const src = ['```js', 'assert(true);', '```'].join('\n');

      expect(res.output, 'to contain', src);
    });
  });

  describe('xunit', function () {
    it('prints test cases with --reporter-options output (issue: 1864)', function (done) {
      const randomStr = crypto.randomBytes(8).toString('hex');
      const tmpDir = os.tmpdir().replace(new RegExp(path.sep + '$'), '');
      const tmpFile = tmpDir + path.sep + 'test-issue-1864-' + randomStr + '.xml';

      const args = [
        '--reporter=xunit',
        '--reporter-options',
        'output=' + tmpFile
      ];
      const expectedOutput = [
        '<testcase classname="suite" name="test1" file="',
        '<testcase classname="suite" name="test2" file="',
        '</testsuite>'
      ];

      run('passing.fixture.js', args, function (err, result) {
        if (err) return done(err);

        const xml = fs.readFileSync(tmpFile, 'utf8');
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
      const reporterAtARelativePath =
        'test/integration/fixtures/simple-reporter.js';

      const args = ['--reporter=' + reporterAtARelativePath];

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
      const reporterAtAnAbsolutePath = path.join(
        process.cwd(),
        'test/integration/fixtures/simple-reporter.js'
      );

      const args = ['--reporter=' + reporterAtAnAbsolutePath];

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
    const not = function (predicate) {
      return function () {
        return !predicate.apply(this, arguments);
      };
    };
    const versionPredicate = function (line) {
      return line.match(/^TAP version \d+$/) != null;
    };
    const planPredicate = function (line) {
      return line.match(/^1\.\.\d+$/) != null;
    };
    const testLinePredicate = function (line) {
      return line.match(/^not ok/) != null || line.match(/^ok/) != null;
    };
    const diagnosticPredicate = function (line) {
      return line.match(/^#/) != null;
    };
    const bailOutPredicate = function (line) {
      return line.match(/^Bail out!/) != null;
    };
    const anythingElsePredicate = function (line) {
      return (
        versionPredicate(line) === false &&
        planPredicate(line) === false &&
        testLinePredicate(line) === false &&
        diagnosticPredicate(line) === false &&
        bailOutPredicate(line) === false
      );
    };

    describe('produces valid TAP v13 output', function () {
      const runFixtureAndValidateOutput = function (fixture, expected) {
        it('for ' + fixture, function (done) {
          const args = ['--reporter=tap', '--reporter-option', 'tapVersion=13'];

          run(fixture, args, function (err, res) {
            if (err) {
              done(err);
              return;
            }

            const expectedVersion = 13;
            const expectedPlan = '1..' + expected.numTests;

            const outputLines = res.output.split('\n');

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
            const firstTestLine = outputLines.findIndex(testLinePredicate);
            // there must be at least one test line
            expect(firstTestLine, 'to be greater than', -1);
            const lastTestLine =
              outputLines.length -
              1 -
              outputLines.slice().reverse().findIndex(testLinePredicate);
            const planLine = outputLines.findIndex(function (line) {
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
      const invalidTapVersion = 'nosuch';
      const args = [
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

          const pattern = `Error: invalid or unsupported TAP version: "${invalidTapVersion}"`;
          expect(res, 'to satisfy', {
            code: 1,
            output: new RegExp(pattern, 'm')
          });
          done();
        },
        { stdio: 'pipe' }
      );
    });

    it('places exceptions correctly in YAML blocks', function (done) {
      const args = ['--reporter=tap', '--reporter-option', 'tapVersion=13'];

      run('reporters.fixture.js', args, function (err, res) {
        if (err) {
          done(err);
          return;
        }

        const outputLines = res.output.split('\n');

        for (let i = 0; i + 1 < outputLines.length; i++) {
          if (
            testLinePredicate(outputLines[i]) &&
            testLinePredicate(outputLines[i + 1]) === false
          ) {
            const blockLinesStart = i + 1;
            const blockLinesEnd =
              i +
              1 +
              outputLines.slice(i + 1).findIndex(not(anythingElsePredicate));
            const blockLines =
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
