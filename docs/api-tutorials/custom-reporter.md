Mocha allows you to define and use custom reporters install via `npm`.

For example, if `mocha-foo-reporter` was published to the npm registry, you could install it via `npm install mocha-foo-reporter --save-dev`, then use it via `mocha --reporter mocha-foo-reporter`.

## Example Custom Reporter

If you're looking to get started quickly, here's an example of a custom reporter:

<!-- prettier-ignore -->
```js
{{ files.simplereporter }}
```

To use this reporter, execute `mocha --reporter /path/to/my-reporter.js`.

For further examples, the built-in reporter implementations are the [best place to look](https://github.com/mochajs/mocha/tree/master/lib/reporters). The [integration tests](https://github.com/mochajs/mocha/tree/master/test/reporters) may also be helpful.

## The `Base` Reporter Class

[Base]{@link Mocha.reporters.Base} is an "abstract" class. It contains console-specific settings and utilities, commonly used by built-in reporters. Browsing the built-in reporter implementations, you may often see static properties of [Base]{@link Mocha.reporters.Base} referenced.

It's often useful--but not necessary--for a custom reporter to extend [Base]{@link Mocha.reporters.Base}.

## Statistics

Mocha adds a `stats` property of type {@link StatsCollector} to the reporter's `Runner` instance (passed as first argument to constructor).

## Events

A reporter should listen for events emitted from the `runner` (a singleton instance of {@link Runner}).

The event names are exported from the `constants` property of `Mocha.Runner`:

| Constant             | Event Name  | Event Arguments | Description                                                                                                                          |
| -------------------- | ----------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `EVENT_RUN_BEGIN`    | `start`     | _(n/a)_         | Execution will begin.                                                                                                                |
| `EVENT_RUN_END`      | `end`       | _(n/a)_         | All [Suites]{@link Suite}, [Tests]{@link Test} and [Hooks]{@link Hook} have completed execution.                                     |
| `EVENT_DELAY_BEGIN`  | `waiting`   | _(n/a)_         | Waiting for `global.run()` to be called; only emitted when [delay](/#delayed-root-suite) option is `true`.                           |
| `EVENT_DELAY_END`    | `ready`     | _(n/a)_         | User called `global.run()` and the root suite is ready to execute.                                                                   |
| `EVENT_SUITE_BEGIN`  | `suite`     | `Suite`         | The [Hooks]{@link Hook} and [Tests]{@link Test} within a {@link Suite} will be executed, including any nested [Suites]{@link Suite}. |
| `EVENT_SUITE_END`    | `suite end` | `Suite`         | The [Hooks]{@link Hook}, [Tests]{@link Test}, and nested [Suites]{@link Suite} within a {@link Suite} have completed execution.      |
| `EVENT_HOOK_BEGIN`   | `hook`      | `Hook`          | A {@link Hook} will be executed.                                                                                                     |
| `EVENT_HOOK_END`     | `hook end`  | `Hook`          | A {@link Hook} has completed execution.                                                                                              |
| `EVENT_TEST_BEGIN`   | `test`      | `Test`          | A {@link Test} will be executed.                                                                                                     |
| `EVENT_TEST_END`     | `test end`  | `Test`          | A {@link Test} has completed execution.                                                                                              |
| `EVENT_TEST_FAIL`    | `fail`      | `Test`, `Error` | A {@link Test} has failed or thrown an exception.                                                                                    |
| `EVENT_TEST_PASS`    | `pass`      | `Test`          | A {@link Test} has passed.                                                                                                           |
| `EVENT_TEST_PENDING` | `pending`   | `Test`          | A {@link Test} was skipped.                                                                                                          |
| `EVENT_TEST_RETRY`   | `retry`     | `Test`, `Error` | A {@link Test} failed, but is about to be retried; only emitted if the `retry` option is nonzero.                                    |

**Please use these constants** instead of the event names in your own reporter! This will ensure compatibility with future versions of Mocha.

> It's important to understand that all `Suite` callbacks will be run _before_ the {@link Runner} emits `EVENT_RUN_BEGIN`. Hooks and tests won't run until _after_ the {@link Runner} emits `EVENT_RUN_BEGIN`.
