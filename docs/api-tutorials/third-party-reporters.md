Mocha 1.3.0 allows you to define custom third-party reporters within your own test suite, or by using npm modules. For example if "lcov-reporter" was published to npm, you would simply add it to your package.json in `devDependencies` and use `--reporter lcov-reporter`.

Here is a minimalistic sample reporter, which you can use by executing: `mocha --reporter my-reporter.js`

```js
// my-reporter.js
var mocha = require("mocha");
module.exports = MyReporter;

function MyReporter(runner) {
  mocha.reporters.Base.call(this, runner);
  var passes = 0;
  var failures = 0;

  runner.on("pass", function (test) {
    passes++;
    console.log("pass: %s", test.fullTitle());
  });

  runner.on("fail", function (test, err) {
    failures++;
    console.log("fail: %s -- error: %s", test.fullTitle(), err.message);
  });

  runner.on("end", function () {
    console.log("end: %d/%d", passes, passes + failures);
  });
}

// To have this reporter "extend" a built-in reporter uncomment the following line:
// mocha.utils.inherits(MyReporter, mocha.reporters.Spec);
```

For details look at the implementations in [lib/reporters/\*](https://github.com/mochajs/mocha/tree/main/lib/reporters).

Another sample implementation can be found at [mocha-examples: third-party-reporter (GitHub)](https://github.com/mochajs/mocha-examples/tree/main/packages/third-party-reporter).

Mocha provides the following events:

- **start**: Execution started
- **waiting**: Execution of root `Suite` delayed
- **ready**: Execution of root `Suite` started
- **end**: Execution complete
- **suite**: Test suite execution started
- **suite end**: All tests (and sub-suites) have finished
- **test**: Test execution started
- **test end**: Test completed
- **hook**: Hook execution started
- **hook end**: Hook complete
- **pass**: Test passed
- **fail**: Test failed
- **pending**: Test pending
- **retry**: Test failed and retries
