'use strict';

var exec = require('child_process').exec;
var path = require('path');

var node = '"' + process.execPath + '"';

describe('globbing', function () {
  describe('by the shell', function () {
    it('should find the first level test', function (done) {
      testGlob.shouldSucceed(
        './*.js',
        function (results) {
          expect(
            results.stdout,
            'to contain',
            '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,'
          );
        },
        done
      );
    });

    it('should not find a non-matching pattern', function (done) {
      testGlob.shouldFail(
        './*-none.js',
        function (results) {
          expect(
            results.stderr,
            'to contain',
            'Error: No test files found: "./*-none.js"'
          );
        },
        done
      );
    });

    it('should handle multiple non-matching patterns', function (done) {
      testGlob.shouldFail(
        './*-none.js ./*-none-twice.js',
        function (results) {
          expect(results.stderr, 'to contain', 'Error: No test files found');
          expect(results.stderr, 'not to contain', '*-none');
        },
        done
      );
    });

    it('should handle both matching and non-matching patterns in the same command', function (done) {
      testGlob.shouldSucceed(
        './*.js ./*-none.js',
        function (results) {
          expect(
            results.stdout,
            'to contain',
            '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,'
          );
          expect(
            results.stderr,
            'to contain',
            'Warning: Cannot find any files matching pattern'
          );
        },
        done
      );
    });
  });

  describe('by Mocha', function () {
    it('should find the first level test', function (done) {
      testGlob.shouldSucceed(
        '"./*.js"',
        function (results) {
          expect(
            results.stdout,
            'to contain',
            '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,'
          );
        },
        done
      );
    });

    it('should not find a non-matching pattern', function (done) {
      testGlob.shouldFail(
        '"./*-none.js"',
        function (results) {
          expect(
            results.stderr,
            'to contain',
            'Error: No test files found: "./*-none.js"'
          );
        },
        done
      );
    });

    it('should handle multiple non-matching patterns', function (done) {
      testGlob.shouldFail(
        '"./*-none.js" "./*-none-twice.js"',
        function (results) {
          expect(results.stderr, 'to contain', 'Error: No test files found');
        },
        done
      );
    });

    it('should handle both matching and non-matching patterns in the same command', function (done) {
      testGlob.shouldSucceed(
        '"./*.js" "./*-none.js"',
        function (results) {
          expect(
            results.stdout,
            'to contain',
            '["end",{"suites":1,"tests":1,"passes":1,"pending":0,"failures":0,'
          );
          expect(
            results.stderr,
            'to contain',
            'Warning: Cannot find any files matching pattern'
          );
        },
        done
      );
    });

    describe('double-starred', function () {
      it('should find the tests on multiple levels', function (done) {
        testGlob.shouldSucceed(
          '"./**/*.js"',
          function (results) {
            expect(
              results.stdout,
              'to contain',
              '["end",{"suites":2,"tests":2,"passes":2,"pending":0,"failures":0,'
            );
          },
          done
        );
      });

      it('should not find a non-matching pattern', function (done) {
        testGlob.shouldFail(
          '"./**/*-none.js"',
          function (results) {
            expect(
              results.stderr,
              'to contain',
              'Error: No test files found: "./**/*-none.js"'
            );
          },
          done
        );
      });

      it('should handle both matching and non-matching patterns in the same command', function (done) {
        testGlob.shouldSucceed(
          '"./**/*.js" "./**/*-none.js"',
          function (results) {
            expect(
              results.stdout,
              'to contain',
              '["end",{"suites":2,"tests":2,"passes":2,"pending":0,"failures":0,'
            );
            expect(
              results.stderr,
              'to contain',
              'Warning: Cannot find any files matching pattern'
            );
          },
          done
        );
      });
    });
  });
});

var testGlob = {
  shouldSucceed: execMochaWith(function shouldNotError(error) {
    if (error) {
      throw error;
    }
  }),

  shouldFail: execMochaWith(function shouldFailWithStderr(error, stderr) {
    expect(error && error.message, 'to contain', stderr);
  })
};

function execMochaWith(validate) {
  return function execMocha(glob, assertOn, done) {
    exec(
      node +
        ' "' +
        path.join('..', '..', '..', '..', 'bin', 'mocha') +
        '" -R json-stream --no-config ' +
        glob,
      {cwd: path.join(__dirname, 'fixtures', 'glob')},
      function (error, stdout, stderr) {
        try {
          validate(error, stderr);
          assertOn({stdout, stderr});
          done();
        } catch (assertion) {
          done(assertion);
        }
      }
    );
  };
}
