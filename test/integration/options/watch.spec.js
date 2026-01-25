"use strict";

const fs = require("node:fs");
const fsPromises = require("node:fs/promises");
const path = require("node:path");
const { once } = require("node:events");
const { isDeepStrictEqual } = require("node:util");
const {
  copyFixture,
  runMochaWatchJSONAsync,
  sleep,
  runMochaWatchAsync,
  touchFile,
  replaceFileContents,
  createTempDir,
  resolveFixturePath,
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

      return runMochaWatchJSONAsync([testFile], tempDir, () => {
        replaceFileContents(testFile, "done((;", "done();");
      }).then((results) => {
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

      it("reruns test when watched test file is crashed", function () {
        const testFile = path.join(tempDir, "test.js");
        copyFixture(DEFAULT_FIXTURE, testFile);

        replaceFileContents(testFile, "done();", "done((;");

        return runMochaWatchJSONAsync([testFile], tempDir, () => {
          replaceFileContents(testFile, "done((;", "done();");
        }).then((results) => {
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
        tempDir,
        async () => {
          fs.mkdirSync(libPath);
          await sleep(1000);

          fs.mkdirSync(dirPath);
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
        tempDir,
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
        tempDir,
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
        tempDir,
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
        tempDir,
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

    const fakeWatchStat = (time) => ({
      mtime: time,
      ctime: time,
      birthtime: time,
    });

    /**
     * @callback ChokidarMockChangeCallback
     * @param {ChildProcess} mocha - the `mocha` CLI child process
     * @param {Object} api - test api for interacting with the `mocha` prcoess
     * @param {Function} api.gotMessage - function that accepts a message predicate and returns a Promise that resolves with the first
     * message received from the `mocha` process matching the predicate
     * @param {SendWatcherEvent} api.sendWatcherEvent - function for sending a mock chokidar event to the `mocha` process
     * @param {SendFileEvent} api.sendWatcherEvent.add - function for sending a mock chokidar file add event to the `mocha` process
     * @param {SendFileEvent} api.sendWatcherEvent.change - function for sending a mock chokidar file change event to the `mocha` process
     * @param {SendFileEvent} api.sendWatcherEvent.unlink - function for sending a mock chokidar file unlink event to the `mocha` process
     */

    /**
     * Helper for running watch tests with mock chokidar events to precisely
     * test behavior in different concurrent timing scenarios.
     *
     * @param {string[]} args - the `mocha` CLI arguments
     * @param {Object} opts - additional `spawn` options for the `mocha` child process
     * @param {ChokidarMockChangeCallback} change - function to perform test-specific actions
     * once the `mocha` process has started.
     */
    async function runMochaWatchWithChokidarMock(args, opts, change) {
      let runScheduled = false;
      let running = false;
      const result = await runMochaWatchJSONAsync(
        args,
        {
          stdio: ["pipe", "pipe", "inherit", "ipc"],
          env: {
            ...process.env,
            __MOCHA_WATCH_MOCK_CHOKIDAR: "1",
            DEBUG: "mocha:cli:watch",
          },
          sleepMs: 0,
          ...opts,
        },
        async (mochaProcess) => {
          mochaProcess.on("message", (msg) => {
            if (!msg) return;
            if (msg.run) {
              running = true;
              runScheduled = false;
            }
            if (msg.runFinished) running = false;
            if (msg.scheduleRun) runScheduled = true;
          });
          const gotMessage = (filter) =>
            new Promise((resolve, reject) => {
              function onMessage(message) {
                if (filter(message)) {
                  cleanup();
                  resolve(message);
                }
              }
              function onError(error) {
                cleanup();
                reject(error);
              }
              function cleanup() {
                mochaProcess.removeListener("message", onMessage);
                mochaProcess.removeListener("error", onError);
              }
              mochaProcess.on("message", onMessage);
              mochaProcess.on("error", onError);
            });
          const sendWatcherEvent = (...args) =>
            Promise.all([
              gotMessage(
                (msg) =>
                  Array.isArray(msg.received) &&
                  msg.received.every((value, i) =>
                    isDeepStrictEqual(value, args[i]),
                  ),
              ),
              mochaProcess.send({ watcher: args }),
            ]);

          const { startTime } = await gotMessage((msg) => msg.listening);

          sendWatcherEvent.add = (file, delta) =>
            sendWatcherEvent(
              "all",
              "add",
              file,
              fakeWatchStat(startTime + delta),
            );
          sendWatcherEvent.change = (file, delta) =>
            sendWatcherEvent(
              "all",
              "change",
              file,
              fakeWatchStat(startTime + delta),
            );
          sendWatcherEvent.unlink = (file) =>
            sendWatcherEvent("all", "unlink", file);

          await change(mochaProcess, {
            gotMessage,
            sendWatcherEvent,
            startTime,
          });
        },
      );
      result.runPending = runScheduled || running;
      return result;
    }
    it("doesn't rerun when file events occur before tests (even if events are received late)", async function () {
      const testFile = path.join(tempDir, "test.js");
      copyFixture("options/watch/test-with-dependency-and-barrier", testFile);

      const dependency = path.join(tempDir, "lib", "dependency.js");
      copyFixture("options/watch/dependency", dependency);

      const dependency2 = path.join(tempDir, "lib", "dependency2.js");
      const dependency3 = path.join(tempDir, "lib", "dependency3.js");

      const results = await runMochaWatchWithChokidarMock(
        [
          testFile,
          "--watch-files",
          "lib/**/*.js",
          "--require",
          resolveFixturePath("options/watch/mock-global-setup"),
        ],
        { cwd: tempDir },
        async (mochaProcess, { gotMessage, sendWatcherEvent }) => {
          await sendWatcherEvent.add(testFile, -1000);
          await sendWatcherEvent.add(dependency, -1000);
          await sendWatcherEvent.change(dependency, -1000);

          mochaProcess.send({ resolveGlobalSetup: true });
          await gotMessage((msg) => msg.testStarted);

          copyFixture("options/watch/dependency", dependency2);
          await sendWatcherEvent.change(dependency, -800);
          await sendWatcherEvent.add(dependency2, -800);

          mochaProcess.send({ resolveTest: true });
          await gotMessage((msg) => msg.runFinished);

          copyFixture("options/watch/dependency", dependency3);
          await sendWatcherEvent.change(dependency, -600);
          await sendWatcherEvent.add(dependency3, -600);
        },
      );
      expect(results, "to have length", 1);
      expect(results[0].passes, "to have length", 1);
      expect(results[0].failures, "to have length", 0);
      expect(results.runPending, "to be", false);
    });

    it("doesn't blast cache before run if file events occur before global setup", async function () {
      const globalSetupFile = path.join(tempDir, "globalSetup.js");
      copyFixture(
        "options/watch/mock-global-setup-with-dependency",
        globalSetupFile,
      );

      const testFile = path.join(tempDir, "test.js");
      copyFixture("options/watch/test-with-dependency", testFile);

      const dependency = path.join(tempDir, "lib", "dependency.js");
      copyFixture("options/watch/dependency", dependency);

      const results = await runMochaWatchWithChokidarMock(
        [
          testFile,
          "--watch-files",
          "lib/**/*.js",
          "--require",
          globalSetupFile,
        ],
        { cwd: tempDir },
        async (mochaProcess, { gotMessage, sendWatcherEvent }) => {
          await sendWatcherEvent.add(testFile, -1000);
          await sendWatcherEvent.add(dependency, -1000);
          await sendWatcherEvent.change(dependency, -500);
          // this should not get picked up by the test file
          // it should already have the old version in memory
          replaceFileContents(
            dependency,
            "module.exports.testShouldFail = false",
            "module.exports.testShouldFail = true",
          );
          mochaProcess.send({ resolveGlobalSetup: true });
          await gotMessage((msg) => msg.runFinished);
        },
      );
      expect(results, "to have length", 1);
      expect(results[0].passes, "to have length", 1);
      expect(results[0].failures, "to have length", 0);
      expect(results.runPending, "to be", false);
    });

    describe("blasts cache before run if file events occur during global setup", function () {
      for (const event of ["add", "change", "unlink"]) {
        it(`${event} events`, async function () {
          const globalSetupFile = path.join(tempDir, "globalSetup.js");
          copyFixture(
            "options/watch/mock-global-setup-with-dependency",
            globalSetupFile,
          );

          const testFile = path.join(tempDir, "test.js");
          copyFixture(
            "options/watch/test-with-dependency-and-barrier",
            testFile,
          );

          const dependency = path.join(tempDir, "lib", "dependency.js");
          copyFixture("options/watch/dependency", dependency);
          // this version of the module gets loaded by global setup,
          // but it should get replaced before the test is run
          replaceFileContents(
            dependency,
            "module.exports.testShouldFail = false",
            "module.exports.testShouldFail = true",
          );

          const dependency2 = path.join(tempDir, "lib", "dependency2.js");
          if (event !== "add")
            copyFixture("options/watch/dependency", dependency2);

          const results = await runMochaWatchWithChokidarMock(
            [
              testFile,
              "--watch-files",
              "lib/**/*.js",
              "--require",
              globalSetupFile,
            ],
            { cwd: tempDir },
            async (mochaProcess, { gotMessage, sendWatcherEvent }) => {
              await sendWatcherEvent.add(testFile, -1000);
              await sendWatcherEvent.add(dependency, -1000);
              if (event !== "add")
                await sendWatcherEvent.add(dependency2, -1000);

              replaceFileContents(
                dependency,
                "module.exports.testShouldFail = true",
                "module.exports.testShouldFail = false",
              );
              if (event === "unlink") await fsPromises.unlink(dependency2);
              await sendWatcherEvent[event](dependency2, 1000);

              mochaProcess.send({ resolveGlobalSetup: true });
              await gotMessage((msg) => msg.testStarted);

              mochaProcess.send({ resolveTest: true });
              await gotMessage((msg) => msg.runFinished);
            },
          );
          expect(results, "to have length", 1);
          expect(results[0].passes, "to have length", 1);
          expect(results[0].failures, "to have length", 0);
          expect(results.runPending, "to be", false);
        });
      }
    });

    describe("reruns once if file events occur during test run", function () {
      for (const event of ["add", "change", "unlink"]) {
        it(`${event} events`, async function () {
          const testFile = path.join(tempDir, "test.js");
          copyFixture(
            "options/watch/test-with-dependency-and-barrier",
            testFile,
          );

          const dependency = path.join(tempDir, "lib", "dependency.js");
          copyFixture("options/watch/dependency", dependency);
          const dependency2 = path.join(tempDir, "lib", "dependency2.js");
          const dependency3 = path.join(tempDir, "lib", "dependency3.js");
          if (event !== "add") {
            copyFixture("options/watch/dependency", dependency2);
            copyFixture("options/watch/dependency", dependency3);
          }

          const results = await runMochaWatchWithChokidarMock(
            [
              testFile,
              "--watch-files",
              "lib/**/*.js",
              "--require",
              resolveFixturePath("options/watch/mock-global-setup"),
            ],
            { cwd: tempDir },
            async (mochaProcess, { gotMessage, sendWatcherEvent }) => {
              await sendWatcherEvent.add(testFile, -3000);
              await sendWatcherEvent.add(dependency, -3000);
              if (event !== "add") {
                await sendWatcherEvent.add(dependency2, -3000);
                await sendWatcherEvent.add(dependency3, -3000);
              }

              mochaProcess.send({ resolveGlobalSetup: true });
              await gotMessage((msg) => msg.testStarted);

              if (event === "add") {
                copyFixture("options/watch/dependency", dependency2);
                copyFixture("options/watch/dependency", dependency3);
              } else if (event === "unlink") {
                await Promise.all([
                  fsPromises.unlink(dependency2),
                  fsPromises.unlink(dependency3),
                ]);
              }
              await Promise.all([
                sendWatcherEvent[event](dependency2, 1000),
                sendWatcherEvent[event](dependency3, 2000),
              ]);

              await Promise.all([
                mochaProcess.send({ resolveTest: true }),
                gotMessage((msg) => msg.runFinished),
                // also wait for rerun to start
                gotMessage((msg) => msg.testStarted),
              ]);
              await Promise.all([
                mochaProcess.send({ resolveTest: true }),
                gotMessage((msg) => msg.runFinished),
              ]);
            },
          );
          expect(results, "to have length", 2);
          expect(results[0].passes, "to have length", 1);
          expect(results[0].failures, "to have length", 0);
          expect(results[1].passes, "to have length", 1);
          expect(results[1].failures, "to have length", 0);
          expect(results.runPending, "to be", false);
        });
      }
    });

    describe("reruns once if file events occur after test run", function () {
      for (const event of ["add", "change", "unlink"]) {
        it(`${event} events`, async function () {
          const testFile = path.join(tempDir, "test.js");
          copyFixture("options/watch/test-with-dependency", testFile);

          const dependency = path.join(tempDir, "lib", "dependency.js");
          copyFixture("options/watch/dependency", dependency);

          const dependency2 = path.join(tempDir, "lib", "dependency2.js");
          const dependency3 = path.join(tempDir, "lib", "dependency3.js");
          if (event !== "add") {
            copyFixture("options/watch/dependency", dependency2);
            copyFixture("options/watch/dependency", dependency3);
          }

          const results = await runMochaWatchWithChokidarMock(
            [
              testFile,
              "--watch-files",
              "lib/**/*.js",
              "--require",
              resolveFixturePath("options/watch/mock-global-setup"),
            ],
            { cwd: tempDir },
            async (mochaProcess, { gotMessage, sendWatcherEvent }) => {
              await sendWatcherEvent.add(testFile, 0);
              await sendWatcherEvent.add(dependency, 0);
              if (event !== "add") {
                await sendWatcherEvent.add(dependency2, 0);
                await sendWatcherEvent.add(dependency3, 0);
              }

              mochaProcess.send({ resolveGlobalSetup: true });
              await gotMessage((msg) => msg.runFinished);

              if (event === "add") {
                copyFixture("options/watch/dependency", dependency2);
                copyFixture("options/watch/dependency", dependency3);
              } else if (event === "unlink") {
                await Promise.all([
                  fsPromises.unlink(dependency2),
                  fsPromises.unlink(dependency3),
                ]);
              }
              await Promise.all([
                sendWatcherEvent[event](dependency2, 1000),
                sendWatcherEvent[event](dependency3, 1000),
                gotMessage((msg) => msg.runFinished),
              ]);
            },
          );

          const filtered = results.filter((r) => r.tests.length > 0);

          expect(filtered, "to have length", 2);
          expect(filtered[0].passes, "to have length", 1);
          expect(filtered[0].failures, "to have length", 0);
          expect(filtered[1].passes, "to have length", 1);
          expect(filtered[1].failures, "to have length", 0);
          expect(results.runPending, "to be", false);
        });
      }
    });

    describe("reloads root hooks", function () {
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
              replaceFileContents(hookFile, /throw new Error\([^)]+\)/gm, "");
            },
          ).then((results) => {
            expect(results.length, "to equal", 2);
            expect(results[0].failures, "to have length", 1);
            expect(results[1].failures, "to have length", 0);
          });
        };
      }

      it("mochaHooks.beforeAll runs as expected", setupHookTest("beforeAll"));
      it("mochaHooks.beforeEach runs as expected", setupHookTest("beforeEach"));
      it("mochaHooks.afterAll runs as expected", setupHookTest("afterAll"));
      it("mochaHooks.afterEach runs as expected", setupHookTest("afterEach"));
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

      return expect(
        runMochaWatchAsync(
          [testFile],
          { cwd: tempDir, stdio: "pipe" },
          async () => {
            // we want to cause _n + 1_ reruns, which should cause the warning
            // to occur if the listeners aren't properly destroyed
            const iterations = new Array(process.getMaxListeners() + 1);
            // eslint-disable-next-line no-unused-vars
            for await (const _ of iterations) {
              touchFile(testFile);
              await sleep(1000);
            }
          },
        ),
        "when fulfilled",
        "to satisfy",
        {
          output: expect.it("not to match", /MaxListenersExceededWarning/),
        },
      );
    });
  });
});
