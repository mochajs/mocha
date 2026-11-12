"use strict";

const { invokeNode } = require("./helpers.cjs");

function runInNode(fn, ...args) {
  const source = `(${fn.toString()})(require(${JSON.stringify(require.resolve("../../lib/mocha.cjs"))}), ...${JSON.stringify(args)});`;
  return new Promise((resolve, reject) => {
    invokeNode(
      ["-e", source],
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
      { stdio: "pipe", separateStderr: true, timeout: 10000 },
    );
  });
}

describe("exceptions from runner event listeners", function () {
  for (const [event, mode] of [
    ["start", "sync"],
    ["pass", "sync"],
    ["end", "sync"],
    ["fail", "sync"],
    ["fail", "promise"],
    ["fail", "callback"],
  ]) {
    it(`surfaces a ${event} listener exception with a ${mode} test`, async function () {
      const result = await runInNode(
        (Mocha, event, mode) => {
          const mocha = new Mocha({
            reporter: function (runner) {
              runner.on(event, () => {
                throw new Error("reporter failure");
              });
            },
          });
          const failure = new Error("test failure");
          const test =
            event !== "fail"
              ? function () {}
              : mode === "promise"
                ? async function () {
                    throw failure;
                  }
                : mode === "callback"
                  ? function (done) {
                      setImmediate(() => done(failure));
                    }
                  : function () {
                      throw failure;
                    };
          mocha.suite.addTest(new Mocha.Test("test", test));
          mocha.run(() => console.log("unexpected completion"));
        },
        event,
        mode,
      );
      expect(result.code, "to be", 1);
      expect(result.stderr, "to contain", "Error: reporter failure");
      expect(result.output, "not to contain", "unexpected completion");
    });
  }

  for (const api of ["mocha", "runner", "promise"]) {
    it(`does not complete ${api} before a late end listener throws`, async function () {
      const result = await runInNode((Mocha, api) => {
        const mocha = new Mocha({ reporter: function () {} });
        mocha.suite.addTest(new Mocha.Test("pass", function () {}));
        mocha.globalTeardown(() => console.log("unexpected teardown"));
        const complete = (failures) => {
          console.log("unexpected completion");
          process.exit(failures);
        };
        let runner;
        if (api === "mocha") runner = mocha.run(complete);
        else {
          runner = new Mocha.Runner(mocha.suite);
          if (api === "runner") runner.run(complete);
          else runner.runAsync().then(complete);
        }
        runner.on("end", () => {
          throw new Error("late reporter failure");
        });
      }, api);
      expect(result.code, "to be", 1);
      expect(result.stderr, "to contain", "Error: late reporter failure");
      expect(result.output, "to be", "");
    });
  }

  it("completes with a failure count after successful late end listeners", async function () {
    const result = await runInNode((Mocha) => {
      const suite = new Mocha.Suite("");
      suite.addTest(
        new Mocha.Test("fails", () => {
          throw new Error("test failure");
        }),
      );
      const runner = new Mocha.Runner(suite);
      runner.on("end", () => console.log(`early:${runner.state}`));
      runner.run((failures) =>
        console.log(`complete:${failures}:${runner.state}`),
      );
      runner.on("end", () => console.log(`late:${runner.state}`));
    });
    expect(result.code, "to be", 0);
    expect(
      result.output,
      "to be",
      "early:running\nlate:stopped\ncomplete:1:stopped\n",
    );
  });

  for (const allowUncaught of [false, true]) {
    for (const secondary of ["exception", "rejection"]) {
      it(`preserves a late reporter error before a secondary ${secondary} (allowUncaught=${allowUncaught})`, async function () {
        const result = await runInNode(
          (Mocha, allowUncaught, secondary) => {
            const mocha = new Mocha({
              reporter: function () {},
              allowUncaught,
            });
            mocha.suite.addTest(new Mocha.Test("pass", function () {}));
            const runner = mocha.run(() =>
              console.log("unexpected completion"),
            );
            runner.on("end", () => {
              process.nextTick(() => {
                const error = new Error("secondary failure");
                if (secondary === "exception") throw error;
                error.code = "ERR_MOCHA_FATAL";
                Promise.reject(error);
              });
              throw new Error("original reporter failure");
            });
          },
          allowUncaught,
          secondary,
        );
        expect(result.code, "to be", 1);
        expect(result.stderr, "to contain", "Error: original reporter failure");
        expect(result.stderr, "not to contain", "Error: secondary failure");
        expect(result.output, "to be", "");
      });
    }
  }

  it("does not start a queued test after a reporter fails", async function () {
    const result = await runInNode((Mocha) => {
      const assert = require("node:assert/strict");
      const queue = [];
      Mocha.Runner.immediately = (fn) => queue.push(fn);
      const suite = new Mocha.Suite("");
      let bodyRan = false;
      let completed = false;
      suite.addTest(
        new Mocha.Test("test", () => {
          bodyRan = true;
        }),
      );
      const runner = new Mocha.Runner(suite);
      const error = new Error("reporter failure");
      runner.on("fail", () => {
        throw error;
      });
      process.once("uncaughtException", (actual) => {
        assert.strictEqual(actual, error);
        assert.strictEqual(bodyRan, false);
        assert.strictEqual(completed, false);
        console.log("verified");
      });
      runner.run(() => {
        completed = true;
      });
      let steps = 0;
      while (!runner.test && queue.length && steps++ < 20) queue.shift()();
      assert.strictEqual(runner.test, suite.tests[0]);
      assert.ok(queue.length > 0);
      runner.uncaught(new Error("outside test"));
      while (queue.length) queue.shift()();
    });
    expect(result.code, "to be", 0);
    expect(result.output, "to be", "verified\n");
  });

  for (const value of ["error", "null", "undefined"]) {
    it(`preserves a thrown ${value} and other host handlers`, async function () {
      const result = await runInNode((Mocha, value) => {
        const assert = require("node:assert/strict");
        const error =
          value === "error"
            ? Object.freeze(new Error("reporter failure"))
            : value === "null"
              ? null
              : undefined;
        const suite = new Mocha.Suite("");
        suite.addTest(new Mocha.Test("test", function () {}));
        const runner = new Mocha.Runner(suite);
        let calls = 0;
        function host(actual) {
          assert.strictEqual(actual, error);
          assert.strictEqual(++calls, 1);
          assert.ok(
            !process.listeners("uncaughtException").includes(runner.uncaught),
          );
          assert.ok(
            !process.listeners("unhandledRejection").includes(runner.unhandled),
          );
          assert.ok(process.listeners("uncaughtException").includes(host));
          console.log("verified");
        }
        process.on("uncaughtException", host);
        runner.on("pass", () => {
          throw error;
        });
        runner.run(() => console.log("unexpected completion"));
      }, value);
      expect(result.code, "to be", 0);
      expect(result.output, "to be", "verified\n");
    });
  }
});

describe("nested runner event dispatch", function () {
  it("does not continue test-end listeners after a leak reporter throws", async function () {
    const result = await runInNode((Mocha) => {
      const mocha = new Mocha({
        checkLeaks: true,
        reporter: function (runner) {
          runner.on("fail", () => {
            throw new Error("nested reporter failure");
          });
          runner.on("test end", () => console.log("unexpected test end"));
        },
      });
      mocha.suite.addTest(
        new Mocha.Test("leaks", () => {
          global.reporterTestLeak = true;
        }),
      );
      mocha.run(() => console.log("unexpected completion"));
    });
    expect(result.code, "to be", 1);
    expect(result.stderr, "to contain", "Error: nested reporter failure");
    expect(result.output, "to be", "");
  });
});
