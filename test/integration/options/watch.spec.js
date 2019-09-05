'use strict';

const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const helpers = require('../helpers');

describe('--watch', function() {
  describe('when enabled', function() {
    this.timeout(10 * 1000);
    this.slow(3000);

    beforeEach(function() {
      this.tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mocha-'));
    });

    afterEach(function() {
      if (this.tempDir) {
        return fs.remove(this.tempDir);
      }
    });

    it('reruns test when watched test file is touched', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      return runMochaWatch([testFile], this.tempDir, () => {
        touchFile(testFile);
      }).then(results => {
        expect(results, 'to have length', 2);
      });
    });

    it('reruns test when file matching --watch-files changes', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'dir/file.xyz');
      touchFile(watchedFile);

      return runMochaWatch(
        [testFile, '--watch-files', 'dir/*.xyz'],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results.length, 'to equal', 2);
      });
    });

    it('reruns test when file matching --watch-files is added', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'lib/file.xyz');
      return runMochaWatch(
        [testFile, '--watch-files', '**/*.xyz'],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results, 'to have length', 2);
      });
    });

    it('reruns test when file matching --watch-files is removed', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'lib/file.xyz');
      touchFile(watchedFile);

      return runMochaWatch(
        [testFile, '--watch-files', 'lib/**/*.xyz'],
        this.tempDir,
        () => {
          fs.removeSync(watchedFile);
        }
      ).then(results => {
        expect(results, 'to have length', 2);
      });
    });

    it('does not rerun test when file not matching --watch-files is changed', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'dir/file.js');
      touchFile(watchedFile);

      return runMochaWatch(
        [testFile, '--watch-files', 'dir/*.xyz'],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results.length, 'to equal', 1);
      });
    });

    it('picks up new test files when they are added', function() {
      const testFile = path.join(this.tempDir, 'test/a.js');
      copyFixture('__default__', testFile);

      return runMochaWatch(
        ['test/**/*.js', '--watch-files', 'test/**/*.js'],
        this.tempDir,
        () => {
          const addedTestFile = path.join(this.tempDir, 'test/b.js');
          copyFixture('passing', addedTestFile);
        }
      ).then(results => {
        expect(results, 'to have length', 2);
        expect(results[0].passes, 'to have length', 1);
        expect(results[1].passes, 'to have length', 3);
      });
    });

    it('reruns test when file matching --extension is changed', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'file.xyz');
      touchFile(watchedFile);

      return runMochaWatch(
        [testFile, '--extension', 'xyz,js'],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results, 'to have length', 2);
      });
    });

    it('reruns test when file starting with . and matching --extension is changed', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, '.file.xyz');
      touchFile(watchedFile);

      return runMochaWatch(
        [testFile, '--extension', 'xyz,js'],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results, 'to have length', 2);
      });
    });

    it('ignores files in "node_modules" and ".git" by default', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const nodeModulesFile = path.join(
        this.tempDir,
        'node_modules',
        'file.xyz'
      );
      const gitFile = path.join(this.tempDir, '.git', 'file.xyz');

      touchFile(gitFile);
      touchFile(nodeModulesFile);

      return runMochaWatch(
        [testFile, '--extension', 'xyz,js'],
        this.tempDir,
        () => {
          touchFile(gitFile);
          touchFile(nodeModulesFile);
        }
      ).then(results => {
        expect(results, 'to have length', 1);
      });
    });

    it('ignores files matching --watch-ignore', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('__default__', testFile);

      const watchedFile = path.join(this.tempDir, 'dir/file-to-ignore.xyz');
      touchFile(watchedFile);

      return runMochaWatch(
        [
          testFile,
          '--watch-files',
          'dir/*.xyz',
          '--watch-ignore',
          'dir/*ignore*'
        ],
        this.tempDir,
        () => {
          touchFile(watchedFile);
        }
      ).then(results => {
        expect(results.length, 'to equal', 1);
      });
    });

    it('reloads test files when they change', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('options/watch/test-file-change', testFile);

      return runMochaWatch(
        [testFile, '--watch-files', '**/*.js'],
        this.tempDir,
        () => {
          replaceFileContents(
            testFile,
            'testShouldFail = true',
            'testShouldFail = false'
          );
        }
      ).then(results => {
        expect(results, 'to have length', 2);
        expect(results[0].passes, 'to have length', 0);
        expect(results[0].failures, 'to have length', 1);
        expect(results[1].passes, 'to have length', 1);
        expect(results[1].failures, 'to have length', 0);
      });
    });

    it('reloads test dependencies when they change', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('options/watch/test-with-dependency', testFile);

      const dependency = path.join(this.tempDir, 'lib', 'dependency.js');
      copyFixture('options/watch/dependency', dependency);

      return runMochaWatch(
        [testFile, '--watch-files', 'lib/**/*.js'],
        this.tempDir,
        () => {
          replaceFileContents(
            dependency,
            'module.exports.testShouldFail = false',
            'module.exports.testShouldFail = true'
          );
        }
      ).then(results => {
        expect(results, 'to have length', 2);
        expect(results[0].passes, 'to have length', 1);
        expect(results[0].failures, 'to have length', 0);
        expect(results[1].passes, 'to have length', 0);
        expect(results[1].failures, 'to have length', 1);
      });
    });

    // Regression test for https://github.com/mochajs/mocha/issues/2027
    it('respects --fgrep on re-runs', function() {
      const testFile = path.join(this.tempDir, 'test.js');
      copyFixture('options/grep', testFile);

      return runMochaWatch([testFile, '--fgrep', 'match'], this.tempDir, () => {
        touchFile(testFile);
      }).then(results => {
        expect(results, 'to have length', 2);
        expect(results[0].tests, 'to have length', 2);
        expect(results[1].tests, 'to have length', 2);
      });
    });
  });
});

/**
 * Runs the mocha binary in watch mode calls `change` and returns the
 * JSON reporter output.
 *
 * The function starts mocha with the given arguments and `--watch` and
 * waits until the first test run has completed. Then it calls `change`
 * and waits until the second test run has been completed. Mocha is
 * killed and the list of JSON outputs is returned.
 */
function runMochaWatch(args, cwd, change) {
  const [mochaProcess, resultPromise] = helpers.invokeMochaAsync(
    [...args, '--watch', '--reporter', 'json'],
    {cwd}
  );

  return sleep(1000)
    .then(() => change())
    .then(() => sleep(1000))
    .then(() => {
      mochaProcess.kill('SIGINT');
      return resultPromise;
    })
    .then(data => {
      const testResults = data.output
        // eslint-disable-next-line no-control-regex
        .replace(/\u001b\[\?25./g, '')
        .split('\u001b[2K')
        .map(x => JSON.parse(x));
      return testResults;
    });
}

/**
 * Synchronously touch a file by appending a space to the end. Creates
 * the file and all its parent directories if necessary.
 */
function touchFile(file) {
  fs.ensureDirSync(path.dirname(file));
  fs.appendFileSync(file, ' ');
}

/**
 * Synchronously replace all substrings matched by `pattern` with
 * `replacement` in the file’s content.
 */
function replaceFileContents(file, pattern, replacement) {
  const contents = fs.readFileSync(file, 'utf-8');
  const newContents = contents.replace(pattern, replacement);
  fs.writeFileSync(file, newContents, 'utf-8');
}

/**
 * Synchronously copy a fixture to the given destination file path.
 * Creates parent directories of the destination path if necessary.
 */
function copyFixture(fixtureName, dest) {
  const fixtureSource = helpers.resolveFixturePath(fixtureName);
  fs.ensureDirSync(path.dirname(dest));
  fs.copySync(fixtureSource, dest);
}

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}
