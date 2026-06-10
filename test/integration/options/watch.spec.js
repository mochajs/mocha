"use strict";

const fs = require("node:fs");
const path = require("node:path");
const {
  copyFixture,
  runMochaWatchJSONAsync,
  sleep,
  runMochaWatchAsync,
  touchFile,
  replaceFileContents,
  createTempDir,
  DEFAULT_FIXTURE,
} = require("../helpers");

describe("--watch", function () {
  describe("when enabled", function () {
    /**
     * @type {string}
     */
    let tempDir;
    /**
     * @type {import('../helpers').RemoveTempDirCallback}
     */
    let cleanup;

    this.slow(5000);
    // tests wait on observed runs, bounded by the helpers' shared 50s budget
    // with diagnostic output; keep mocha's own timeout above that budget
    this.timeout(60000);

    beforeEach(async function () {
      const { dirpath, removeTempDir } = await createTempDir();
      tempDir = dirpath;
      cleanup = removeTempDir;
    });

    afterEach(function () {
      cleanup();
    });

    it("reruns test when watched test file is touched", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      return runMochaWatchJSONAsync([testFile], tempDir, () => {
        touchFile(testFile);
      }).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when watched test file crashes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      replaceFileContents(testFile, "done();", "done((;");

      return runMochaWatchJSONAsync(
        [testFile],
        { cwd: tempDir, firstRunCrashes: true, expectedRuns: 1 },
        () => {
          replaceFileContents(testFile, "done((;", "done();");
        },
      ).then((results) => {
        expect(results, "to have length", 1);
      });
    });

    describe("when in parallel mode", function () {
      it("reruns test when watched test file is touched", function () {
        const testFile = path.join(tempDir, "test.js");
        copyFixture(DEFAULT_FIXTURE, testFile);

        return runMochaWatchJSONAsync(["--parallel", testFile], tempDir, () => {
          touchFile(testFile);
        }).then((results) => {
          expect(results, "to have length", 2);
        });
      });

      // TODO: this test never passes `--parallel`, so it duplicates the
      // non-parallel crash test above; kept as-is in this stabilization change
      it("reruns test when watched test file is crashed", function () {
        const testFile = path.join(tempDir, "test.js");
        copyFixture(DEFAULT_FIXTURE, testFile);

        replaceFileContents(testFile, "done();", "done((;");

        return runMochaWatchJSONAsync(
          [testFile],
          { cwd: tempDir, firstRunCrashes: true, expectedRuns: 1 },
          () => {
            replaceFileContents(testFile, "done((;", "done();");
          },
        ).then((results) => {
          expect(results, "to have length", 1);
        });
      });
    });

    it("reruns test when file matching --watch-files changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "dir/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "dir/*.xyz"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results.length, "to equal", 2);
      });
    });

    it("reruns test when file matching --watch-files is added", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/file.xyz");
      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "**/*.xyz"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file and directory paths under --watch-files are added", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      // only create 'lib', 'dir', and 'file.xyz' when watching
      const libPath = path.join(tempDir, "lib");
      const dirPath = path.join(libPath, "dir");
      const watchedFile = path.join(dirPath, "file.xyz");

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib"],
        { cwd: tempDir, expectedRuns: 4 },
        async (mochaProcess, { waitForRuns }) => {
          fs.mkdirSync(libPath);
          await waitForRuns(2);
          // the watcher installs its watch on a newly created directory
          // asynchronously; an event inside it before that is lost entirely
          // (chokidar#1112), so give the installation a moment
          await sleep(1000);

          fs.mkdirSync(dirPath);
          await waitForRuns(3);
          await sleep(1000);

          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 4);
      });
    });

    it("reruns test when file matching --watch-files is removed", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib/**/*.xyz"],
        tempDir,
        () => {
          fs.rmSync(watchedFile, { recursive: true, force: true });
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file matching exact --watch-files changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib/file.xyz"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file under --watch-files changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/dir/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file matching --watch-files starting with a glob pattern changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/dir/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "**/lib"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file matching --watch-files ending with a glob pattern changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/dir/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib/**/*"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file matching --watch-files with glob pattern in between changes", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/dir/file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib/**/dir"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file matching --watch-files outside the current working directory changes", function () {
      // create a subdirectory to watch as the current working directory
      const tempCwd = path.join(tempDir, "dir");
      const testFile = path.join(tempCwd, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "lib/file.xyz");
      touchFile(watchedFile);

      // use an absolute path for the watch file pattern,
      // otherwise it would be read relative to the current working directory
      const watchFilePattern = path.join(tempDir, "lib/**/*.xyz");

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", watchFilePattern],
        tempCwd,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("does not rerun test when file not matching --watch-files is changed", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "dir/file.js");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "dir/*.xyz"],
        { cwd: tempDir, noRerun: true },
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results.length, "to equal", 1);
      });
    });

    it("picks up new test files when they are added", function () {
      const testFile = path.join(tempDir, "test/a.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      return runMochaWatchJSONAsync(
        ["test/**/*.js", "--watch-files", "test/**/*.js"],
        tempDir,
        () => {
          const addedTestFile = path.join(tempDir, "test/b.js");
          copyFixture("passing", addedTestFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
        expect(results[0].passes, "to have length", 1);
        expect(results[1].passes, "to have length", 3);
      });
    });

    it("reruns test when file matching --extension is changed", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--extension", "xyz,js"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it('reruns when "rs\\n" typed', function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      return runMochaWatchJSONAsync([testFile], tempDir, (mochaProcess) => {
        mochaProcess.stdin.write("rs\n");
      }).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it("reruns test when file starting with . and matching --extension is changed", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, ".file.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--extension", "xyz,js"],
        tempDir,
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results, "to have length", 2);
      });
    });

    it('ignores files in "node_modules" and ".git" by default', function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const nodeModulesFile = path.join(tempDir, "node_modules", "file.xyz");
      const gitFile = path.join(tempDir, ".git", "file.xyz");

      touchFile(gitFile);
      touchFile(nodeModulesFile);

      return runMochaWatchJSONAsync(
        [testFile, "--extension", "xyz,js"],
        { cwd: tempDir, noRerun: true },
        () => {
          touchFile(gitFile);
          touchFile(nodeModulesFile);
        },
      ).then((results) => {
        expect(results, "to have length", 1);
      });
    });

    it("ignores files matching --watch-ignore", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "dir/file-to-ignore.xyz");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [
          testFile,
          "--watch-files",
          "dir/*.xyz",
          "--watch-ignore",
          "dir/*ignore*",
        ],
        { cwd: tempDir, noRerun: true },
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results.length, "to equal", 1);
      });
    });

    // Workaround: escape via e.g. `dir/[[]ab[]].js`
    it("ignores files whose name is the watch glob", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      const watchedFile = path.join(tempDir, "dir/[ab].js");
      touchFile(watchedFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "dir/[ab].js"],
        { cwd: tempDir, noRerun: true },
        () => {
          touchFile(watchedFile);
        },
      ).then((results) => {
        expect(results.length, "to equal", 1);
      });
    });

    it("reloads test files when they change", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture("options/watch/test-file-change", testFile);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "**/*.js"],
        tempDir,
        () => {
          replaceFileContents(
            testFile,
            "testShouldFail = true",
            "testShouldFail = false",
          );
        },
      ).then((results) => {
        expect(results, "to have length", 2);
        expect(results[0].passes, "to have length", 0);
        expect(results[0].failures, "to have length", 1);
        expect(results[1].passes, "to have length", 1);
        expect(results[1].failures, "to have length", 0);
      });
    });

    it("reloads test dependencies when they change", function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture("options/watch/test-with-dependency", testFile);

      const dependency = path.join(tempDir, "lib", "dependency.js");
      copyFixture("options/watch/dependency", dependency);

      return runMochaWatchJSONAsync(
        [testFile, "--watch-files", "lib/**/*.js"],
        tempDir,
        () => {
          replaceFileContents(
            dependency,
            "module.exports.testShouldFail = false",
            "module.exports.testShouldFail = true",
          );
        },
      ).then((results) => {
        expect(results, "to have length", 2);
        expect(results[0].passes, "to have length", 1);
        expect(results[0].failures, "to have length", 0);
        expect(results[1].passes, "to have length", 0);
        expect(results[1].failures, "to have length", 1);
      });
    });

    // Regression test for https://github.com/mochajs/mocha/issues/2027
    it("respects --fgrep on re-runs", async function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture("options/grep", testFile);

      return expect(
        runMochaWatchJSONAsync([testFile, "--fgrep", "match"], tempDir, () => {
          touchFile(testFile);
        }),
        "when fulfilled",
        "to satisfy",
        {
          length: 2,
          0: { tests: expect.it("to have length", 2) },
          1: { tests: expect.it("to have length", 2) },
        },
      );
    });

    describe("with required hooks", function () {
      /**
       * Helper for setting up hook tests
       *
       * @param {string} hookName name of hook to test
       * @return {function}
       */
      function setupHookTest(hookName) {
        return function () {
          const testFile = path.join(tempDir, "test.js");
          const hookFile = path.join(tempDir, "hook.js");

          copyFixture("__default__", testFile);
          copyFixture("options/watch/hook", hookFile);

          replaceFileContents(hookFile, "<hook>", hookName);

          return runMochaWatchJSONAsync(
            [testFile, "--require", hookFile],
            tempDir,
            () => {
              touchFile(testFile);
            },
          ).then((results) => {
            expect(results.length, "to equal", 2);
            expect(results[0].failures, "to have length", 1);
            expect(results[1].failures, "to have length", 1);
          });
        };
      }

      it("mochaHooks.beforeAll runs as expected", setupHookTest("beforeAll"));
      it("mochaHooks.beforeEach runs as expected", setupHookTest("beforeEach"));
      it("mochaHooks.afterAll runs as expected", setupHookTest("afterAll"));
      it("mochaHooks.afterEach runs as expected", setupHookTest("afterEach"));
    });

    it("should not leak event listeners", function () {
      this.timeout(20000);
      const testFile = path.join(tempDir, "test.js");
      copyFixture(DEFAULT_FIXTURE, testFile);

      // we want to cause _n + 1_ reruns, which should cause the warning
      // to occur if the listeners aren't properly destroyed
      const totalRuns = process.getMaxListeners() + 2;

      return expect(
        runMochaWatchAsync(
          [testFile],
          { cwd: tempDir, expectedRuns: totalRuns },
          async (mochaProcess, { waitForRuns }) => {
            for (let run = 2; run <= totalRuns; run++) {
              touchFile(testFile);
              await waitForRuns(run);
              // watchers coalesce same-file touches made in very quick
              // succession; space them out so every touch causes a rerun
              await sleep(250);
            }
          },
        ),
        "when fulfilled",
        "to satisfy",
        {
          stderr: expect.it("not to match", /MaxListenersExceededWarning/),
        },
      );
    });
  });
});
