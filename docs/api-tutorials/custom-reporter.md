Mocha allows you to define and use custom reporters install via `npm`.

For example, if `mocha-foo-reporter` was published to the npm registry, you could install it via `npm install mocha-foo-reporter --save-dev`, then use it via `mocha --reporter mocha-foo-reporter`.

## Example Custom Reporter

If you're looking to get started quickly, here's an example of a custom reporter:

<!-- AUTO-GENERATED-CONTENT:START (file:src=../../test/integration/fixtures/simple-reporter.js&header=// my-reporter.js)' -->

```js
// my-reporter.js
'use strict';

const Mocha = require('mocha');
const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_SUITE_BEGIN,
  EVENT_SUITE_END
} = Mocha.Runner.constants;

// this reporter outputs test results, indenting two spaces per suite
class MyReporter {
  constructor(runner) {
    this._indents = 0;
    const stats = runner.stats;

    runner
      .once(EVENT_RUN_BEGIN, () => {
        console.log('start');
      })
      .on(EVENT_SUITE_BEGIN, () => {
        this.increaseIndent();
      })
      .on(EVENT_SUITE_END, () => {
        this.decreaseIndent();
      })
      .on(EVENT_TEST_PASS, test => {
        // Test#fullTitle() returns the suite name(s)
        // prepended to the test title
        console.log(`${this.indent()}pass: ${test.fullTitle()}`);
      })
      .on(EVENT_TEST_FAIL, (test, err) => {
        console.log(
          `${this.indent()}fail: ${test.fullTitle()} - error: ${err.message}`
        );
      })
      .once(EVENT_RUN_END, () => {
        console.log(`end: ${stats.passes}/${stats.passes + stats.failures} ok`);
      });
  }

  indent() {
    return Array(this._indents).join('  ');
  }

  increaseIndent() {
    this._indents++;
  }

  decreaseIndent() {
    this._indents--;
  }
}

module.exports = MyReporter;
```

<!-- AUTO-GENERATED-CONTENT:END -->

To use this reporter, execute `mocha --reporter /path/to/my-reporter.js`.

For further examples, the built-in reporter implementations are the [best place to look](https://github.com/mochajs/mocha/tree/master/lib/reporters). The [integration tests](https://github.com/mochajs/mocha/tree/master/test/reporters) may also be helpful.

## The `Base` Reporter Class

[Base] is an "abstract" class. It contains console-specific settings and utilities, commonly used by built-in reporters. Browsing the built-in reporter implementations, you may often see static properties of [Base] referenced.

It's often useful--but not necessary--for a custom reporter to extend [Base].

## Statistics

Mocha adds a `stats` property of type [StatsCollector](/api/module-lib_stats-collector.html) to the reporter's `Runner` instance (passed as first argument to constructor).

## Events

A reporter should listen for events emitted from the `runner` (a singleton instance of [Runner]).

The event names are exported from the `constants` property of `Mocha.Runner`:

| Constant             | Event Name  | Event Arguments | Description                                                                                 |
| -------------------- | ----------- | --------------- | ------------------------------------------------------------------------------------------- |
| `EVENT_RUN_BEGIN`    | `start`     | _(n/a)_         | Execution will begin.                                                                       |
| `EVENT_RUN_END`      | `end`       | _(n/a)_         | All [Suite]s, [Test]s and [Hook]s have completed execution.                                 |
| `EVENT_DELAY_BEGIN`  | `waiting`   | _(n/a)_         | Waiting for `global.run()` to be called; only emitted when [delay] option is `true`.        |
| `EVENT_DELAY_END`    | `ready`     | _(n/a)_         | User called `global.run()` and the root suite is ready to execute.                          |
| `EVENT_SUITE_BEGIN`  | `suite`     | `Suite`         | The [Hook]s and [Test]s within a [Suite] will be executed, including any nested [Suite]s.   |
| `EVENT_SUITE_END`    | `suite end` | `Suite`         | The [Hook]s, [Test]s, and nested [Suite]s within a [Suite] have completed execution.        |
| `EVENT_HOOK_BEGIN`   | `hook`      | `Hook`          | A [Hook] will be executed.                                                                  |
| `EVENT_HOOK_END`     | `hook end`  | `Hook`          | A [Hook] has completed execution.                                                           |
| `EVENT_TEST_BEGIN`   | `test`      | `Test`          | A [Test] will be executed.                                                                  |
| `EVENT_TEST_END`     | `test end`  | `Test`          | A [Test] has completed execution.                                                           |
| `EVENT_TEST_FAIL`    | `fail`      | `Test`, `Error` | A [Test] has failed or thrown an exception.                                                 |
| `EVENT_TEST_PASS`    | `pass`      | `Test`          | A [Test] has passed.                                                                        |
| `EVENT_TEST_PENDING` | `pending`   | `Test`          | A [Test] was skipped.                                                                       |
| `EVENT_TEST_RETRY`   | `retry`     | `Test`, `Error` | A [Test] failed, but is about to be retried; only emitted if the `retry` option is nonzero. |

**Please use these constants** instead of the event names in your own reporter! This will ensure compatibility with future versions of Mocha.

> It's important to understand that all `Suite` callbacks will be run _before_ the [Runner] emits `EVENT_RUN_BEGIN`. Hooks and tests, however, won't run until _after_ the [Runner] emits `EVENT_RUN_BEGIN`.

[runner]: /api/mocha.runner
[test]: /api/mocha.test
[hook]: /api/mocha.hook
[suite]: /api/mocha.suite
[base]: /api/mocha.reporters.base
[delay]: /#delayed-root-suite
