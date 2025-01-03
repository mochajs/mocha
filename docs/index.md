---
layout: default
title: 'Mocha - the fun, simple, flexible JavaScript test framework'
description: 'Mocha is a feature-rich JavaScript test framework running on Node.js and in the browser, making asynchronous testing simple and fun.'
---

Mocha is a feature-rich JavaScript test framework running on [Node.js][] and in the browser, making asynchronous testing _simple_ and _fun_. Mocha tests run serially, allowing for flexible and accurate reporting, while mapping uncaught exceptions to the correct test cases. Hosted on [GitHub][github-mocha].

<nav class="badges">
  <a href="https://discord.gg/KeDn2uXhER"><img alt="Chat - Discord" height="18" src="https://img.shields.io/badge/chat-Discord-5765F2.svg" /></a>
  <a href="#sponsors"><img src="https://opencollective.com/mochajs/tiers/sponsors/badge.svg" height="18" alt="OpenCollective sponsors"></a>
  <a href="#backers"><img src="https://opencollective.com/mochajs/tiers/backers/badge.svg" height="18" alt="OpenCollective backers"></a>
</nav>

{% include 'supporters.md' %}

## Features

- [browser support](#running-mocha-in-the-browser)
- [simple async support, including promises](#asynchronous-code)
- [run Node.js tests in parallel](#parallel-tests)
- [test coverage reporting](#wallabyjs)
- [string diff support](#diffs)
- [JavaScript API for running tests](#more-information)
- [auto-detects and disables coloring for non-TTYs](#reporters)
- [async test timeout support](#delayed-root-suite)
- [test retry support](#retry-tests)
- [test-specific timeouts](#test-level)
- [reports test durations](#test-duration)
- [highlights slow tests](#dot-matrix)
- [file watcher support](#min)
- [global variable leak detection](#-check-leaks)
- [optionally run tests that match a regexp](#-grep-regexp-g-regexp)
- [auto-exit to prevent "hanging" with an active loop](#-exit)
- [easily meta-generate suites](#markdown) & [test-cases](#list)
- [config file support](#-config-path)
- [node debugger support](#-inspect-inspect-brk-inspect)
- [node native ES modules support](#nodejs-native-esm-support)
- [source-map support](#-enable-source-maps)
- [detects multiple calls to `done()`](#detects-multiple-calls-to-done)
- [use any assertion library you want](#assertions)
- [extensible reporting, bundled with 9+ reporters](#reporters)
- [extensible test DSLs or "interfaces"](#interfaces)
- [before, after, before each, after each hooks](#hooks)
- [arbitrary transpiler support (coffee-script etc)](#-compilers)
- [TextMate bundle](#textmate)
  {:.two-column}

## Table of Contents

{{ toc }}
{:.two-column}

## Installation

Install with [npm][] globally:

```bash
$ npm install --global mocha
```

or as a development dependency for your project:

```bash
$ npm install --save-dev mocha
```

> As of v10.0.0, Mocha requires Node.js v14.0.0 or newer.

## Getting Started

```bash
$ npm install mocha
$ mkdir test
$ $EDITOR test/test.js # or open with your favorite editor
```

In your editor:

```js
var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

Back in the terminal:

```bash
$ ./node_modules/mocha/bin/mocha.js

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (9ms)
```

Set up a test script in package.json:

```json
"scripts": {
  "test": "mocha"
}
```

Then run tests with:

```bash
$ npm test
```

## Run Cycle Overview

> Updated for v8.0.0.

The following is a mid-level outline of Mocha's "flow of execution" when run in Node.js; the "less important" details have been omitted.

In a browser, test files are loaded by `<script>` tags, and calling `mocha.run()` begins at step 9 [below](#serial-mode).

### Serial Mode

1. User (that's you) executes `mocha`
2. Loads options from config files, if present
3. Mocha processes any command-line options provided (see section on [configuration merging](#merging) for details)
4. If known flags for the `node` executable are found:
   1. Mocha will spawn `node` in a child process, executing itself with these flags
   2. Otherwise, Mocha does not spawn a child process
5. Mocha loads modules specified by `--require`
   1. If a file loaded this way contains known Mocha-specific exports (e.g., [root hook plugins]), Mocha "registers" these
   2. If not, Mocha ignores any exports of a `--require`'d module
6. Mocha validates any custom reporters or interfaces which were loaded via `--require` or otherwise
7. Mocha _discovers_ test files; when given no files or directories, it finds files with extensions `.js`, `.mjs` or `.cjs` in the `test` directory (but not its children), relative to the current working directory
8. The (default) [bdd interface](#bdd) loads the test files _in no particular order_, which are given an interface-specific `global` context (this is how, e.g., `describe()` ends up as a global in a test file)
   1. When a test file is loaded, Mocha executes all of its suites and finds--_but does not execute_--any hooks and tests therein.
   2. Top-level hooks, tests and suites are all made members of an "invisible" _root suite_; there is only _one_ root suite for the entire process
9. Mocha runs [global setup fixtures], if any
10. Starting with the "root" suite, Mocha executes:
11. Any "before all" hooks (for the _root_ suite, this only happens once; see [root hook plugins])
12. For each test, Mocha executes:
    1. Any "before each" hooks
    2. The test (and reports the result)
    3. Any "after each" hooks
13. If the current suite has a child suite, repeat the steps in 10. for each child suite; each child suite _inherits_ any "before each" and "after each" hooks defined in its parent
14. Any "after all" hooks (for the _root_ suite, this only happens once; see [root hook plugins])
15. Mocha prints a final summary/epilog, if applicable
16. Mocha runs [global teardown fixtures], if any

### Parallel Mode

1. Repeat steps 1 through 6 from [Serial Mode](#serial-mode) above, skipping reporter validation
2. All test files found are put into a queue (they are _not_ loaded by the main process)
3. Mocha runs [global setup fixtures], if any
4. Mocha creates a pool of subprocesses ("workers")
5. _Immediately before_ a worker runs the first test it receives, the worker "bootstraps" itself by:
   1. Loading all `--require`'d modules
   2. Registering any root hook plugins
   3. _Ignoring_ global fixtures and custom reporters
   4. Asserting the built-in or custom interface is valid
6. When a worker receives a test file to run, the worker creates a new Mocha instance _for the single test file_, and:
7. The worker repeats step 8 from [above](#serial-mode)
8. The worker repeats step 10 from [above](#serial-mode), with the caveat that the worker _does not_ report test results directly; it holds them in a memory buffer
9. When the worker completes the test file, buffered results are returned to the main process, which then gives them to the user-specified reporter (`spec` by default)
10. The worker makes itself available to the pool; the pool gives the worker another test file to run, if any remain
11. Mocha prints a final summary/epilog, if applicable
12. Mocha runs [global teardown fixtures], if any

## Detects Multiple Calls to `done()`

If you use callback-based async tests, Mocha will throw an error if `done()` is called multiple times. This is handy for catching accidental double callbacks.

```javascript
it('double done', function (done) {
  // Calling `done()` twice is an error
  setImmediate(done);
  setImmediate(done);
});
```

Running the above test will give you the below error message:

```bash
$ ./node_modules/.bin/mocha mocha.test.js


  ✓ double done
  1) double done

  1 passing (6ms)
  1 failing

  1) double done:
     Error: done() called multiple times
      at Object.<anonymous> (mocha.test.js:1:63)
      at require (internal/module.js:11:18)
      at Array.forEach (<anonymous>)
      at startup (bootstrap_node.js:187:16)
      at bootstrap_node.js:608:3
```

## Assertions

Mocha allows you to use any assertion library you wish. In the above example, we're using Node.js' built-in [assert][node-assert] module &mdash; but generally, if it throws an `Error`, it will work! This means you can use libraries such as:

- [should.js][] - BDD style shown throughout these docs
- [expect.js][] - `expect()` style assertions
- [chai][] - `expect()`, `assert()` and `should`-style assertions
- [better-assert][] - C-style self-documenting `assert()`
- [unexpected][] - "the extensible BDD assertion toolkit"

## Asynchronous Code

By adding an argument (usually named `done`) to `it()` to a test callback, Mocha will know that it should wait for this function to be called to complete the test. This callback accepts both an `Error` instance (or subclass thereof) _or_ a falsy value; anything else is invalid usage and throws an error (usually causing a failed test).

```js
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      var user = new User('Luna');
      user.save(function (err) {
        if (err) done(err);
        else done();
      });
    });
  });
});
```

Alternatively, use the `done()` callback directly (which will handle an error argument, if it exists):

```js
describe('User', function () {
  describe('#save()', function () {
    it('should save without error', function (done) {
      var user = new User('Luna');
      user.save(done);
    });
  });
});
```

### Working with Promises

Alternately, instead of using the `done()` callback, you may return a [Promise][mdn-promise]. This is useful if the APIs you are testing return promises instead of taking callbacks:

```js
beforeEach(function () {
  return db.clear().then(function () {
    return db.save([tobi, loki, jane]);
  });
});

describe('#find()', function () {
  it('respond with matching records', function () {
    return db.find({type: 'User'}).should.eventually.have.length(3);
  });
});
```

> The latter example uses [Chai as Promised][npm-chai-as-promised] for fluent promise assertions.

In Mocha v3.0.0 and newer, returning a `Promise` _and_ calling `done()` will result in an exception, as this is generally a mistake:

```js
const assert = require('assert');

// antipattern
it('should complete this test', function (done) {
  return new Promise(function (resolve) {
    assert.ok(true);
    resolve();
  }).then(done);
});
```

The above test will fail with `Error: Resolution method is overspecified. Specify a callback *or* return a Promise; not both.`. In versions older than v3.0.0, the call to `done()` is effectively ignored.

### Using async / await

If your JS environment supports [async / await][mdn-async], you can also write asynchronous tests like this:

```js
beforeEach(async function () {
  await db.clear();
  await db.save([tobi, loki, jane]);
});

describe('#find()', function () {
  it('responds with matching records', async function () {
    const users = await db.find({type: 'User'});
    users.should.have.length(3);
  });
});
```

### Limitations of asynchronous callbacks

You can use all asynchronous callbacks (`done`, `Promise`, and `async`/`await`) in callbacks for `it()`, `before()`, `after()`, `beforeEach()`, `afterEach()`) but not `describe()` -- it must be synchronous.
See [#5046](https://github.com/mochajs/mocha/pull/5046) for more information.

## Synchronous Code

When testing synchronous code, omit the callback and Mocha will automatically continue on to the next test.

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      [1, 2, 3].indexOf(5).should.equal(-1);
      [1, 2, 3].indexOf(0).should.equal(-1);
    });
  });
});
```

## Arrow Functions

Passing [arrow functions][mdn-arrow] (aka "lambdas") to Mocha is discouraged. Lambdas lexically bind `this` and cannot access the Mocha context. For example, the following code will fail:

```js
describe('my suite', () => {
  it('my test', () => {
    // should set the timeout of this test to 1000 ms; instead will fail
    this.timeout(1000);
    assert.ok(true);
  });
});
```

_If you do not need to use_ Mocha's context, lambdas should work. Be aware that using lambdas will be more painful to refactor if the need eventually arises!

Alternatively, you can override certain context variables, such as test timeouts, by chain-calling methods of the created tests and/or hooks:

```js
describe('my suite', () => {
  beforeEach(() => {}).timeout(1000);
  it('my test', () => {
    assert.ok(true);
  }).timeout(1000);
}).timeout(1000);
```

## Hooks

With its default "BDD"-style interface, Mocha provides the hooks `before()`, `after()`, `beforeEach()`, and `afterEach()`. These should be used to set up preconditions and clean up after your tests.

```js
describe('hooks', function () {
  before(function () {
    // runs once before the first test in this block
  });

  after(function () {
    // runs once after the last test in this block
  });

  beforeEach(function () {
    // runs before each test in this block
  });

  afterEach(function () {
    // runs after each test in this block
  });

  // test cases
});
```

> Tests can appear before, after, or interspersed with your hooks. Hooks will run in the order they are defined, as appropriate; all `before()` hooks run (once), then any `beforeEach()` hooks, tests, any `afterEach()` hooks, and finally `after()` hooks (once).

### Describing Hooks

Any hook can be invoked with an optional description, making it easier to pinpoint errors in your tests. If a hook is given a named function, that name will be used if no description is supplied.

```js
beforeEach(function () {
  // beforeEach hook
});

beforeEach(function namedFun() {
  // beforeEach:namedFun
});

beforeEach('some description', function () {
  // beforeEach:some description
});
```

### Asynchronous Hooks

All hooks (`before()`, `after()`, `beforeEach()`, `afterEach()`) may be sync or async as well, behaving much like a regular test-case. For example, you may wish to populate database with dummy content before each test:

```js
describe('Connection', function () {
  var db = new Connection(),
    tobi = new User('tobi'),
    loki = new User('loki'),
    jane = new User('jane');

  beforeEach(function (done) {
    db.clear(function (err) {
      if (err) return done(err);
      db.save([tobi, loki, jane], done);
    });
  });

  describe('#find()', function () {
    it('respond with matching records', function (done) {
      db.find({type: 'User'}, function (err, res) {
        if (err) return done(err);
        res.should.have.length(3);
        done();
      });
    });
  });
});
```

### Root-Level Hooks

A hook defined at the top scope of a test file (outside of a suite) is a _root hook_.

As of v8.0.0, [Root Hook Plugins] are the preferred mechanism for setting root hooks.

### Delayed Root Suite

> _WARNING: Delayed root suites are incompatible with [parallel mode](#parallel-tests)._

If you need to perform asynchronous operations before any of your suites are run (e.g. for dynamically generating tests), you may delay the root suite. Run `mocha` with the `--delay` flag. This will attach a special callback function, `run()`, to the global context:

```js
const assert = require('assert');

const fn = async x => {
  return new Promise(resolve => {
    setTimeout(resolve, 3000, 2 * x);
  });
};

// instead of an IIFE, you can use 'setImmediate' or 'nextTick' or 'setTimeout'
(async function () {
  const z = await fn(3);

  describe('my suite', function () {
    it(`expected value ${z}`, function () {
      assert.strictEqual(z, 6);
    });
  });

  run();
})();
```

## Pending Tests

"Pending" — as in "someone should write these test cases eventually" — test-cases are those _without_ a callback:

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    // pending test below
    it('should return -1 when the value is not present');
  });
});
```

Pending tests will be included in the test results, and marked as pending. A pending test is not considered a failed test.

Read the [inclusive tests section](#inclusive-tests) for an example of conditionally marking a test as pending via `this.skip()`.

## Exclusive Tests

> _WARNING: Exclusive tests are incompatible with [parallel mode](#parallel-tests)._

The exclusivity feature allows you to run _only_ the specified suite or test-case
by appending `.only()` to the function. Here's an example of executing only a particular suite:

```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    // ...
  });
});
```

_Note_: All nested suites will still be executed.

Here's an example of executing an individual test case:

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // ...
    });

    it('should return the index when present', function () {
      // ...
    });
  });
});
```

Previous to v3.0.0, `.only()` used string matching to decide which tests to execute; this is no longer the case. In v3.0.0 or newer, `.only()` can be used multiple times to define a subset of tests to run:

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // this test will be run
    });

    it.only('should return the index when present', function () {
      // this test will also be run
    });

    it('should return -1 if called with a non-Array context', function () {
      // this test will not be run
    });
  });
});
```

You may also choose multiple suites:

```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    it('should return -1 unless present', function () {
      // this test will be run
    });

    it('should return the index when present', function () {
      // this test will also be run
    });
  });

  describe.only('#concat()', function () {
    it('should return a new Array', function () {
      // this test will also be run
    });
  });

  describe('#slice()', function () {
    it('should return a new Array', function () {
      // this test will not be run
    });
  });
});
```

But _tests will have precedence_:

```js
describe('Array', function () {
  describe.only('#indexOf()', function () {
    it.only('should return -1 unless present', function () {
      // this test will be run
    });

    it('should return the index when present', function () {
      // this test will not be run
    });
  });
});
```

_Note_: Hooks, if present, will still be executed.

> Be mindful not to commit usages of `.only()` to version control, unless you really mean it! To do so one can run mocha with the option `--forbid-only` in the continuous integration test command (or in a git precommit hook).

## Inclusive Tests

This feature is the inverse of `.only()`. By appending `.skip()`, you may tell Mocha to ignore test case(s). Anything skipped will be marked as [pending](#pending-tests), and reported as such. Here's an example of skipping an individual test:

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it.skip('should return -1 unless present', function () {
      // this test will not be run
    });

    it('should return the index when present', function () {
      // this test will be run
    });
  });
});
```

You can also put `.skip()` on an entire suite. This is equivalent to appending `.skip()` onto all tests in the suite. Hooks in the suite are also skipped.

```js
describe('Array', function () {
  describe.skip('#indexOf()', function () {
    it('should return -1 unless present', function () {
      // this test will not be run
    });
  });
});
```

_Note_: Code in skipped suites, that is placed outside of hooks or tests is still executed, as mocha will still invoke the suite function to build up the suite structure for visualization.

> _Best practice_: Use `.skip()` instead of commenting tests out.

You may also skip _at runtime_ using `this.skip()`. If a test needs an environment or configuration which cannot be detected beforehand, a runtime skip is appropriate. For example:

```js
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    this.skip();
  }
});
```

The above test will be reported as [pending](#pending-tests). It's also important to note that calling `this.skip()` will effectively _abort_ the test.

> _Best practice_: To avoid confusion, do not execute further instructions in a test or hook after calling `this.skip()`.

Contrast the above test with the following code:

```js
it('should only test in the correct environment', function() {
  if (/* check test environment */) {
    // make assertions
  } else {
    // do nothing
  }
});
```

Because this test _does nothing_, it will be reported as _passing_.

> _Best practice_: Don't do nothing! A test should make an assertion or use `this.skip()`.

To skip _multiple_ tests in this manner, use `this.skip()` in a "before all" hook:

```js
before(function() {
  if (/* check test environment */) {
    // setup code
  } else {
    this.skip();
  }
});
```

This will skip all `it`, `beforeEach/afterEach`, and `describe` blocks within the suite. `before/after` hooks are skipped unless they are defined at the same level as the hook containing `this.skip()`.

```js
describe('outer', function () {
  before(function () {
    this.skip();
  });

  after(function () {
    // will be executed
  });

  describe('inner', function () {
    before(function () {
      // will be skipped
    });

    after(function () {
      // will be skipped
    });
  });
});
```

> _Updated in v7.0.0:_ skipping a test within an "after all" hook is disallowed and will throw an exception. Use a return statement or other means to abort hook execution.

Before Mocha v3.0.0, `this.skip()` was not supported in asynchronous tests and hooks.

## Retry Tests

You can choose to retry failed tests up to a certain number of times. This feature is designed to handle end-to-end tests (functional tests/Selenium...) where resources cannot be easily mocked/stubbed. **It's not recommended to use this feature for unit tests**.

This feature does re-run a failed test and its corresponding `beforeEach/afterEach` hooks, but not `before/after` hooks. `this.retries()` has no effect on failing hooks.

**NOTE**: Example below was written using Selenium webdriver (which [overwrites global Mocha hooks][selenium-webdriver-testing] for `Promise` chain).

```js
describe('retries', function () {
  // Retry all tests in this suite up to 4 times
  this.retries(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should succeed on the 3rd try', function () {
    // Specify this test to only retry up to 2 times
    this.retries(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});
```

## Repeat Tests

Tests can also be repeated when they pass. This feature can be used to test for leaks and proper tear-down procedures. In this case a test is considered to be successful only if all the runs are successful.

This feature does re-run a passed test and its corresponding `beforeEach/afterEach` hooks, but not `before/after` hooks.

If using both `repeat` and `retries`, the test will be run `repeat` times tolerating up to `retries` failures in total.

```js
describe('repeat', function () {
  // Repeat all tests in this suite 4 times
  this.repeats(4);

  beforeEach(function () {
    browser.get('http://www.yahoo.com');
  });

  it('should use proper tear-down', function () {
    // Specify this test to only retry up to 2 times
    this.repeats(2);
    expect($('.foo').isDisplayed()).to.eventually.be.true;
  });
});
```

## Dynamically Generating Tests

Given Mocha's use of function expressions to define suites and test cases, it's straightforward to generate your tests dynamically. No special syntax is required &mdash; plain ol' JavaScript can be used to achieve functionality similar to "parameterized" tests, which you may have seen in other frameworks.

Take the following example:

```js
const assert = require('assert');

function add(args) {
  return args.reduce((prev, curr) => prev + curr, 0);
}

describe('add()', function () {
  const tests = [
    {args: [1, 2], expected: 3},
    {args: [1, 2, 3], expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(({args, expected}) => {
    it(`correctly adds ${args.length} args`, function () {
      const res = add(args);
      assert.strictEqual(res, expected);
    });
  });
});
```

The above code will produce a suite with three specs:

```bash
$ mocha

  add()
    ✓ correctly adds 2 args
    ✓ correctly adds 3 args
    ✓ correctly adds 4 args
```

Tests added inside a `.forEach` handler often don't play well with editor plugins, especially with "right-click run" features.
Another way to parameterize tests is to generate them with a closure. This following example is equivalent to the one above:

```js
describe('add()', function () {
  const testAdd = ({args, expected}) =>
    function () {
      const res = add(args);
      assert.strictEqual(res, expected);
    };

  it('correctly adds 2 args', testAdd({args: [1, 2], expected: 3}));
  it('correctly adds 3 args', testAdd({args: [1, 2, 3], expected: 6}));
  it('correctly adds 4 args', testAdd({args: [1, 2, 3, 4], expected: 10}));
});
```

With `top-level await` you can collect your test data in a dynamic and asynchronous way while the test file is being loaded.<br>
See also [`--delay`](#delayed-root-suite) for CommonJS modules without `top-level await`.

```js
// testfile.mjs
import assert from 'assert';

// top-level await: Node >= v14.8.0 with ESM test file
const tests = await new Promise(resolve => {
  setTimeout(resolve, 5000, [
    {args: [1, 2], expected: 3},
    {args: [1, 2, 3], expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ]);
});

// in suites ASYNCHRONOUS callbacks are NOT supported
describe('add()', function () {
  tests.forEach(({args, expected}) => {
    it(`correctly adds ${args.length} args`, function () {
      const res = args.reduce((sum, curr) => sum + curr, 0);
      assert.strictEqual(res, expected);
    });
  });
});
```

<h2 id="test-duration">Test duration</h2>

Many reporters will display test duration and flag tests that are slow (default: 75ms), as shown here with the SPEC reporter:

![test duration](images/reporter-spec-duration.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

There are three levels of test duration (depicted in the following image):

1. FAST: Tests that run within half of the "slow" threshold will show the duration in green (if at all).
2. NORMAL: Tests that run exceeding half of the threshold (but still within it) will show the duration in yellow.
3. SLOW: Tests that run exceeding the threshold will show the duration in red.

![test duration range](images/test-duration-range.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

To tweak what's considered "slow", you can use the `slow()` method:

```js
describe('something slow', function () {
  this.slow(300000); // five minutes

  it('should take long enough for me to go make a sandwich', function () {
    // ...
  });
});
```

## Timeouts

### Suite-level

Suite-level timeouts may be applied to entire test "suites", or disabled via `this.timeout(0)`. This will be inherited by all nested suites and test-cases that do not override the value.

```js
describe('a suite of tests', function () {
  this.timeout(500);

  it('should take less than 500ms', function (done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function (done) {
    setTimeout(done, 250);
  });
});
```

### Test-level

Test-specific timeouts may also be applied, or the use of `this.timeout(0)` to disable timeouts all together:

```js
it('should take less than 500ms', function (done) {
  this.timeout(500);
  setTimeout(done, 300);
});
```

### Hook-level

Hook-level timeouts may also be applied:

```js
describe('a suite of tests', function () {
  beforeEach(function (done) {
    this.timeout(3000); // A very long environment setup.
    setTimeout(done, 2500);
  });
});
```

Again, use `this.timeout(0)` to disable the timeout for a hook.

> In v3.0.0 or newer, a parameter passed to `this.timeout()` greater than the [maximum delay value][mdn-settimeout-maxdelay] will cause the timeout to be disabled.
> In v8.0.0 or newer, `this.enableTimeouts()` has been removed.
> **Warning:** With async tests if you disable timeouts via `this.timeout(0)` and then do not call `done()`, your test will exit silently.

## Diffs

Mocha supports the `err.expected` and `err.actual` properties of any thrown `AssertionError`s from an assertion library. Mocha will attempt to display the difference between what was expected, and what the assertion actually saw. Here's an example of a "string" diff using `--inline-diffs`:

![string diffs](images/reporter-string-diffs.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

## Command-Line Usage

```
{{ usage }}
```

### `--allow-uncaught`

By default, Mocha will attempt to trap uncaught exceptions thrown from running tests and report these as test failures. Use `--allow-uncaught` to disable this behavior and allow uncaught exceptions to propagate. Will typically cause the process to crash.

This flag is useful when debugging particularly difficult-to-track exceptions.

### `--async-only, -A`

Enforce a rule that tests must be written in "async" style, meaning each test provides a `done` callback or returns a `Promise`. Non-compliant tests will be marked as failures.

### `--bail, -b`

Causes Mocha to stop running tests after the first test failure it encounters. Corresponding "after each" and "after all" hooks are executed for potential cleanup.

`--bail` does _not_ imply `--exit`.

### `--check-leaks`

Use this option to have Mocha check for global variables that are leaked while running tests. Specify globals that are acceptable via the `--global` option (for example: `--check-leaks --global jQuery --global MyLib`).

### `--compilers`

> _`--compilers` was removed in v6.0.0. See [further explanation and workarounds][mocha-wiki-compilers]._

### `--dry-run`

> _Since v9.0.0_ Report tests without executing any of them, neither tests nor hooks.

### `--exit`

> _Updated in v4.0.0._

TL;DR: If your tests hang after an upgrade to Mocha v4.0.0 or newer, use `--exit` for a quick (though not necessarily recommended) fix.

_Prior to_ version v4.0.0, _by default_, Mocha would force its own process to exit once it was finished executing all tests. This behavior enables a set of potential problems; it's indicative of tests (or fixtures, harnesses, code under test, etc.) which don't clean up after themselves properly. Ultimately, "dirty" tests can (but not always) lead to _false positive_ or _false negative_ results.

"Hanging" most often manifests itself if a server is still listening on a port, or a socket is still open, etc. It can also be something like a runaway `setInterval()`, or even an errant `Promise` that never fulfilled.

The _default behavior_ in v4.0.0 (and newer) is `--no-exit`, where previously it was `--exit`.

**The easiest way to "fix" the issue is to pass `--exit` to the Mocha process.** It _can_ be time-consuming to debug &mdash; because it's not always obvious where the problem is &mdash; but it _is_ recommended to do so.

To ensure your tests aren't leaving messes around, here are some ideas to get started:

- See the [Node.js guide to debugging][node-inspector]
- Use the new [`async_hooks`][node-async-hooks] API ([example][gist-async-hooks])
- Try something like [wtfnode][npm-wtfnode]
- Use [`.only`](#exclusive-tests) until you find the test that causes Mocha to hang

### `--pass-on-failing-test-suite`

> _Since v10.7.0_

If set to `true`, Mocha returns exit code `0` even if there are failed tests during run.

### `--fail-zero`

> _Since v9.1.0_

Fail test run if no tests are encountered with `exit-code: 1`.

### `--forbid-only`

Enforce a rule that tests may not be exclusive (use of e.g., `describe.only()` or `it.only()` is disallowed).

`--forbid-only` causes Mocha to fail when an exclusive ("only'd") test or suite is encountered, and it will abort further test execution.

### `--forbid-pending`

Enforce a rule that tests may not be skipped (use of e.g., `describe.skip()`, `it.skip()`, or `this.skip()` anywhere is disallowed).

`--forbid-pending` causes Mocha to fail when a skipped ("pending") test or suite is encountered, and it will abort further test execution.

### `--global <variable-name>`

> _Updated in v6.0.0; the option is `--global` and `--globals` is now an alias._

Define a global variable name. For example, suppose your app deliberately exposes a global named `app` and `YUI`, you may want to add `--global app --global YUI`.

`--global` accepts wildcards. You could do `--global '*bar'` and it would match `foobar`, `barbar`, etc. You can also pass in `'*'` to ignore all globals.

`--global` can accept a comma-delimited list; `--global app,YUI` is equivalent to `--global app --global YUI`.

By using this option in conjunction with `--check-leaks`, you can specify a whitelist of known global variables that you _expect_ to leak into global scope.

### `--retries <n>`

Retries failed tests `n` times.

Mocha does not retry test failures by default.

### `--slow <ms>, -s <ms>`

Specify the "slow" test threshold in milliseconds. Mocha uses this to highlight test cases that are taking too long. "Slow" tests are not considered failures.

Note: A test that executes for _half_ of the "slow" time will be highlighted _in yellow_ with the default `spec` reporter; a test that executes for entire "slow" time will be highlighted _in red_.

### `--timeout <ms>, -t <ms>`

> _Update in v6.0.0: `--timeout 0` is implied when invoking Mocha using inspect flags. `--timeout 99999999` is no longer needed._

Specifies the test case timeout, defaulting to two (2) seconds (2000 milliseconds). Tests taking longer than this amount of time will be marked as failed.

To override you may pass the timeout in milliseconds, or a value with the `s` suffix, e.g., `--timeout 2s` and `--timeout 2000` are equivalent.

To disable timeouts, use `--timeout 0`.

Note: synchronous (blocking) tests are also bound by the timeout, but they will not complete until the code stops blocking. Infinite loops will still be infinite loops!

### `--ui <name>, -u <name>`

The `--ui` option lets you specify the interface to use, defaulting to `bdd`.

### `--color, -c, --colors`

> _Updated in v6.0.0. `--colors` is now an alias for `--color`._

"Force" color output to be enabled, or alternatively force it to be disabled via `--no-color`. By default, Mocha uses the [supports-color][npm-supports-color] module to decide.

In some cases, color output will be explicitly suppressed by certain reporters outputting in a machine-readable format.

### `--diff`

When possible, show the difference between expected and actual values when an assertion failure is encountered.

This flag is unusual in that it **defaults to `true`**; use `--no-diff` to suppress Mocha's own diff output.

Some assertion libraries will supply their own diffs, in which case Mocha's will not be used, regardless of the default value.

Mocha's own diff output does not conform to any known standards, and is designed to be human-readable.

> _Since v9.2.1_

By default strings are truncated to 8192 characters before generating a diff. This is to prevent performance problems with large strings.

It can however make the output harder to interpret when comparing large strings. Therefore it is possible to configure this value using `--reporter-option maxDiffSize=[number]`.

A value of 0 indicates no limit, default is 8192 characters.

### `--full-trace`

Enable "full" stack traces. By default, Mocha attempts to distill stack traces into less noisy (though still useful) output.

This flag is helpful when debugging a suspected issue within Mocha or Node.js itself.

### `--inline-diffs`

Enable "inline" diffs, an alternative output for diffing strings.

Useful when working with large strings.

Does nothing if an assertion library supplies its own diff output.

### `--reporter <name>, -R <name>`

Specify the reporter that will be used, defaulting to `spec`.

Allows use of third-party reporters. For example, [mocha-lcov-reporter][npm-mocha-lcov-reporter] may be used with `--reporter mocha-lcov-reporter` after it has been installed.

### `--reporter-option <option>, -O <option>, --reporter-options <option>`

> _Updated in v6.0.0. Can be specified multiple times. `--reporter-options` is now an alias for `--reporter-option`._

Provide options specific to a reporter in `<key>=<value>` format, e.g., `--reporter tap --reporter-option tapVersion=13`.

Not all reporters accept options.

Can be specified as a comma-delimited list.

### `--config <path>`

> _Since v6.0.0_

Specify an explicit path to a [configuration file](#configuring-mocha-nodejs).

By default, Mocha will search for a config file if `--config` is not specified; use `--no-config` to suppress this behavior.

### `--node-option <name>, -n <name>`

> _Since v9.1.0_

For Node.js and V8 options. Mocha forwards these options to Node.js by spawning a new child-process.<br>
The options are set without leading dashes `--`, e.g. `-n require=foo -n unhandled-rejections=strict`

Can also be specified as a comma-delimited list: `-n require=foo,unhandled-rejections=strict`

### `--opts <path>`

> _Removed in v8.0.0. Please use [configuration file](#configuring-mocha-nodejs) instead._

### `--package <path>`

> _Since v6.0.0_

Specify an explicit path to a [`package.json` file](#configuring-mocha-nodejs) (ostensibly containing configuration in a `mocha` property).

By default, Mocha looks for a `package.json` in the current working directory or nearest ancestor, and will use the first file found (regardless of whether it contains a `mocha` property); to suppress `package.json` lookup, use `--no-package`.

### `--extension <ext>`

Files having this extension will be considered test files. Defaults to `js`.

Specifying `--extension` will _remove_ `.js` as a test file extension; use `--extension js` to re-add it. For example, to load `.mjs` and `.js` test files, you must supply `--extension mjs --extension js`.

The option can be given multiple times. The option accepts a comma-delimited list: `--extension a,b` is equivalent to `--extension a --extension b`.

> _Since v8.2.0_

`--extension` now supports multipart extensions (e.g., `spec.js`), leading dots (`.js`) and combinations thereof (`.spec.js`);

### `--file <file>`

> _WARNING: `--file` is incompatible with [parallel mode](#parallel-tests)._

Explicitly _include_ a test file to be loaded before other test files. Multiple uses of `--file` are allowed, and will be loaded in order given.

Useful if you want to declare, for example, hooks to be run before every test across all other test files.

Files specified this way are not affected by `--sort` or `--recursive`.

Files specified in this way should contain one or more suites, tests or hooks. If this is not the case, consider `--require` instead.

### `--ignore <file|directory|glob>, --exclude <file|directory|glob>,`

Explicitly ignore one or more test files, directories or globs (e.g., `some/**/files*`) that would otherwise be loaded.<br>
Can be specified multiple times.

> _Since v10.0.0:_ In Windows always use forward-slashes `/` as path separator.

Files specified using `--file` _are not affected_ by this option.

### `--recursive`

When looking for test files, recurse into subdirectories.

See `--extension` for defining which files are considered test files.

### `--require <module>, -r <module>`

Require a module before loading the user interface or test files. This is useful for:

- Test harnesses
- Assertion libraries that augment built-ins or global scope (such as [should.js][npm-should.js])
- Compilers such as Babel via [@babel/register][npm-babel-register] or TypeScript via [ts-node][npm-ts-node] (using `--require ts-node/register`). See [Babel][example-babel] or [TypeScript][example-typescript] working examples.

Modules required in this manner are expected to do work synchronously; Mocha won't wait for async tasks in a required module to finish.

**You cannot use `--require` to set hooks**. If you want to set hooks to run, e.g., before each test, use a [Root Hook Plugin](#root-hook-plugins).

> As of v8.0.0, Mocha supports `--require` for [NodeJS native ESM](#nodejs-native-esm-support). There is no separate `--import` flag.

### `--sort, -S`

> _WARNING: `--sort` is incompatible with [parallel mode](#parallel-tests)._

Sort test files (by absolute path) using [Array.prototype.sort][mdn-array-sort].

### `--watch, -w`

Rerun tests on file changes.

The `--watch-files` and `--watch-ignore` options can be used to control which files are watched for changes.

Tests may be rerun manually by typing &#x24e1; &#x24e2; &#x23ce; (same shortcut as `nodemon`).

### `--watch-files <file|directory|glob>`

> _Since v7.0.0_

List of paths or globs to watch when `--watch` is set. If a file matching the given glob changes or is added or removed mocha will rerun all tests.

If the path is a directory all files and subdirectories will be watched.

By default all files in the current directory having one of the extensions provided by `--extension` and not contained in the `node_modules` or `.git` folders are watched.

The option can be given multiple times. The option accepts a comma-delimited list: `--watch-files a,b` is equivalent to `--watch-files a --watch-files b`

### `--watch-ignore <file|directory|glob>`

> _Since v7.0.0_

List of paths or globs to exclude from watching. Defaults to `node_modules` and `.git`.

To exclude all files in a directory it is preferable to use `foo/bar` instead of `foo/bar/**/*`. The latter will still watch the directory `foo/bar` but will ignore all changes to the content of that directory.

The option can be given multiple times. The option accepts a comma-delimited list: `--watch-ignore a,b` is equivalent to `--watch-ignore a --watch-ignore b`

### `--fgrep <string>, -f <string>`

> _BREAKING CHANGE in v6.0.0; now mutually exclusive with `--grep`._

Cause Mocha to only run tests having titles containing the given `string`.

Mutually exclusive with `--grep`.

### `--grep <regexp>, -g <regexp>`

> _BREAKING CHANGE in v6.0.0; now mutually exclusive with `--fgrep`._

Cause Mocha to only run tests matching the given `regexp`, which is internally compiled to a [RegExp][mdn-regexp].

Suppose, for example, you have "api" related tests, as well as "app" related tests, as shown in the following snippet; One could use `--grep api` or `--grep app` to run one or the other. The same goes for any other part of a suite or test-case title, `--grep users` would be valid as well, or even `--grep GET`.

And another option with double quotes: `--grep "groupA|groupB"`.<br>
And for more complex criteria: `--grep "/get/i"`. Some shells as e.g. Git-Bash-for-Windows may require: `--grep "'/get/i'"`. Using flags other than the `ignoreCase /i` (especially `/g` and `/y`) may lead to unpredictable results.

```js
describe('api', function () {
  describe('GET /api/users groupA', function () {
    it('respond with an array of users', function () {
      // ...
    });
  });
});

describe('app', function () {
  describe('GET /users groupB', function () {
    it('respond with an array of users', function () {
      // ...
    });
  });
});
```

Mutually exclusive with `--fgrep`.

### `--invert`

Use the _inverse_ of the match specified by `--grep` or `fgrep`.

Requires either `--grep` or `--fgrep` (but not both).

### `--inspect, --inspect-brk, inspect`

Enables Node.js' inspector.

Use `--inspect` / `--inspect-brk` to launch the V8 inspector for use with Chrome Dev Tools.

Use `inspect` to launch Node.js' internal debugger.

All of these options are mutually exclusive.

Implies `--timeout 0`.

### `--parallel, -p`

> _Since v.8.0.0._

Use the `--parallel` flag to run tests in a worker pool.

Each test file will be put into a queue and executed as workers become available.

**NOTICE**: `--parallel` has certain implications for Mocha's behavior which you must be aware of. Read more about [running tests in parallel](#parallel-tests).

### `--jobs <count>, -j <count>`

> _Since v.8.0.0._

Use `--jobs <count>` to specify the _maximum_ number of processes in the worker pool.

The default value is the _number of CPU cores_ less 1.

Hint: Use `--jobs 0` or `--jobs 1` to temporarily disable `--parallel`.

Has no effect unless used with [`--parallel`](#-parallel-p).

### About Option Types

> _Updated in v6.0.0._

Each flag annotated of type `[boolean]` in Mocha's `--help` output can be _negated_ by prepending `--no-` to the flag name. For example, `--no-color` will disable Mocha's color output, which is enabled by default.

Unless otherwise noted, _all_ boolean flags default to `false`.

### About `node` Flags

The `mocha` executable supports all applicable flags which the `node` executable supports.

These flags vary depending on your version of Node.js.

`node` flags can be defined in Mocha's [configuration](#configuring-mocha-nodejs).

> _Since v9.1.0_ You can also pass `node` flags to Node.js using [`--node-option`](#-node-option-name-n-name).

### `--enable-source-maps`

> _Since Node.js v12.12.0_

If the [`--enable-source-maps`](https://nodejs.org/dist/latest-v12.x/docs/api/cli.html#cli_enable_source_maps) flag
is passed to mocha, source maps will be collected and used to provide accurate stack traces for transpiled code:

```bash
Error: cool
    at Object.<anonymous> (/Users/fake-user/bigco/nodejs-tasks/build/src/index.js:27:7)
        -> /Users/fake-user/bigco/nodejs-tasks/src/index.ts:24:7
```

### About V8 Flags

Prepend `--v8-` to any flag listed in the output of `node --v8-options` (excluding `--v8-options` itself) to use it.

V8 flags can be defined in Mocha's [configuration](#configuring-mocha-nodejs).

> _Since v9.1.0_ You can also pass V8 flags (without `--v8-`) to Node.js using [`--node-option`](#-node-option-name-n-name).

## Parallel Tests

> _Since v.8.0.0._

Depending on the number and nature of your tests, you may find a significant performance benefit when running tests in parallel (using the [`--parallel`](#-parallel-p) flag).

Parallel tests should work out-of-the box for many use cases. However, you must be aware of some important implications of the behavior.

> _Note: Authors of third-party libraries built on Mocha should read this!_

### Reporter Limitations

Due to the nature of the following reporters, they cannot work when running tests in parallel:

- [`markdown`](#markdown)
- [`progress`](#progress)
- [`json-stream`](#json-stream)
  {:.single-column}

These reporters expect Mocha to know _how many tests it plans to run_ before execution. This information is unavailable in parallel mode, as test files are loaded only when they are about to be run.

In serial mode, tests results will "stream" as they occur. In parallel mode, reporter output is _buffered_; reporting will occur after each file is completed. In practice, the reporter output will appear in "chunks" (but will otherwise be identical). If a test file is particularly slow, there may be a significant pause while it's running.

### Exclusive Tests are Disallowed

**You cannot use `it.only`, `describe.only`, `this.only()`, etc., in parallel mode.** This is for the same reason as the incompatible reporters noted above: in parallel mode, Mocha does not load all files and suites into memory before running tests.

Suggested workarounds:

1. Use [`--grep`](#-grep-regexp-g-regexp) or [`--fgrep`](#-fgrep-string-f-string) instead; it's not particularly efficient, but it will work.
1. Don't use parallel mode. Likely, you won't be running very many exclusive tests, so you won't see a great benefit from parallel mode anyhow.

> _TIP: If parallel mode is defined in your config file, you can temporarily disable it on the command-line by using either the `--no-parallel` flag or reducing the job count, e.g., `--jobs=0`._

### File Order is Non-Deterministic

In parallel mode, Mocha does not guarantee the order in which test files will run, nor which worker process runs them.

Because of this, the following options, which depend on order, _cannot be used_ in parallel mode:

- [`--file`](#-file-file)
- [`--sort`](#-sort-s)
- [`--delay`](#delayed-root-suite)
  {:.single-column}

### Test Duration Variability

Running tests in parallel mode will naturally use more system resources. The OS may take extra time to schedule and complete some operations, depending on system load. For this reason, the timeouts of _individual tests_ may need to be increased either [globally](#-timeout-ms-t-ms) or [otherwise](#timeouts).

### "Bail" is "Best Effort"

When used with `--bail` (or `this.bail()`) to exit after the first failure, it's likely other tests will be running at the same time. Mocha must shut down its worker processes before exiting.

Likewise, subprocesses may throw uncaught exceptions. When used with `--allow-uncaught`, Mocha will "bubble" this exception to the main process, but still must shut down its processes.

Either way, Mocha will abort the test run "very soon."

### Root Hooks Are Not Global

> _NOTE: This only applies when running in parallel mode._

A _root hook_ is a hook in a test file which is _not defined_ within a suite. An example using the `bdd` interface:

```js
// test/setup.js

// root hook to run before every test (even in other files)
beforeEach(function () {
  doMySetup();
});

// root hook to run after every test (even in other files)
afterEach(function () {
  doMyTeardown();
});
```

When run (in the default "serial" mode) via this command:

```bash
mocha --file "./test/setup.js" "./test/**/*.spec.js"
```

`setup.js` will be executed _first_, and install the two hooks shown above for every test found in `./test/**/*.spec.js`.

**The above example does not work in parallel mode.**

When Mocha runs in parallel mode, **test files do not share the same process,** nor do they share the same instance of Mocha. Consequently, a hypothetical root hook defined in test file _A_ **will not be present** in test file _B_.

Here are a couple suggested workarounds:

1. `require('./setup.js')` or `import './setup.js'` at the top of every test file. Best avoided for those averse to boilerplate.
1. _Recommended_: Define root hooks in a "required" file, using the new (also as
   of v8.0.0) [Root Hook Plugin](#root-hook-plugins) system.

If you need to run some code _once and only once_, use a [global
fixture](#global-fixtures) instead.

### No Browser Support

Parallel mode is only available in Node.js, for now.

### Limited Reporter API for Third-Party Reporters

Third-party reporters may encounter issues when attempting to access non-existent properties within `Test`, `Suite`, and `Hook` objects. If a third-party reporter does not work in parallel mode (but otherwise works in serial mode), please [file an issue](https://github.com/mochajs/mocha/issues/new).

### Troubleshooting Parallel Mode

If you find your tests don't work properly when run with [`--parallel`](#-parallel-p), either shrug and move on, or use this handy-dandy checklist to get things working:

- :white_check_mark: Ensure you are using a [supported reporter](#reporter-limitations).
- :white_check_mark: Ensure you are not using [other unsupported flags](#file-order-is-non-deterministic).
- :white_check_mark: Double-check your [config file](#configuring-mocha-nodejs); options set in config files will be merged with any command-line option.
- :white_check_mark: Look for root hooks (they look like [this](#root-hooks-are-not-global)) in your tests. Move them into a [Root Hook Plugin](#root-hook-plugins).
- :white_check_mark: Do any assertion, mock, or other test libraries you're consuming use root hooks? They may need to be [migrated](#migrating-a-library-to-use-root-hook-plugins) for compatibility with parallel mode.
- :white_check_mark: If tests are unexpectedly timing out, you may need to increase the default test timeout (via [`--timeout`](#-timeout-ms-t-ms))
- :white_check_mark: Ensure your tests do not depend on being run in a specific order.
- :white_check_mark: Ensure your tests clean up after themselves; remove temp files, handles, sockets, etc. Don't try to share state or resources between test files.

### Caveats About Testing in Parallel

Some types of tests are _not_ so well-suited to run in parallel. For example, extremely timing-sensitive tests, or tests which make I/O requests to a limited pool of resources (such as opening ports, or automating browser windows, hitting a test DB, or remote server, etc.).

Free-tier cloud CI services may not provide a suitable multi-core container or VM for their build agents. Regarding expected performance gains in CI: your mileage may vary. It may help to use a conditional in a `.mocharc.js` to check for `process.env.CI`, and adjust the job count as appropriate.

It's unlikely (but not impossible) to see a performance gain from a [job count](#-jobs-count-j-count) _greater than_ the number of available CPU cores. That said, _play around with the job count_--there's no one-size-fits all, and the unique characteristics of your tests will determine the optimal number of jobs; it may even be that fewer is faster!

### Parallel Mode Worker IDs

> _Since v9.2.0_

Each process launched by parallel mode is assigned a unique id, from 0 for the first process to be launched, to N-1 for the Nth process. This worker id may be accessed in tests via the environment variable `MOCHA_WORKER_ID`. It can be used for example to assign a different database, service port, etc for each test process.

## Root Hook Plugins

> _Since v8.0.0_

In some cases, you may want a [hook](#hooks) before (or after) every test in every file. These are called _root hooks_. Previous to v8.0.0, the way to accomplish this was to use `--file` combined with root hooks (see [example above](#root-hooks-are-not-global)). This still works in v8.0.0, but _not_ when running tests in parallel mode! For that reason, running root hooks using this method is _strongly discouraged_, and may be deprecated in the future.

A _Root Hook Plugin_ is a JavaScript file loaded via [`--require`](#-require-module-r-module) which "registers" one or more root hooks to be used across all test files.

In browsers you can set root hooks directly via a `rootHooks` object: `mocha.setup({ rootHooks: {beforeEach() {...}} })`, see [`mocha.setup()`](#running-mocha-in-the-browser)

### Defining a Root Hook Plugin

A Root Hook Plugin file is a script which exports (via `module.exports`) a `mochaHooks` property. It is loaded via `--require <file>`.

Here's a simple example which defines a root hook, written using CJS and ESM syntax.

#### With CommonJS

```js
// test/hooks.js

exports.mochaHooks = {
  beforeEach(done) {
    // do something before every test
    done();
  }
};
```

#### With ES Modules

We're using the `.mjs` extension in these examples.

> _Tip: If you're having trouble getting ES modules to work, refer to [the Node.js documentation](https://nodejs.org/api/esm.html)._

```js
// test/hooks.mjs

export const mochaHooks = {
  beforeEach(done) {
    // do something before every test
    done();
  }
};
```

> _Note: Further examples will use ESM syntax._

### Available Root Hooks

Root hooks work with any interface, but _the property names do not change_. In other words, if you are using the `tdd` interface, `suiteSetup` maps to `beforeAll`, and `setup` maps to `beforeEach`.

Available root hooks and their behavior:

- `beforeAll`:
  - In **serial** mode (Mocha's default), _before all tests begin, once only_
  - In **parallel** mode, run _before all tests begin, for each file_
- `beforeEach`:
  - In **both** modes, run _before each test_
- `afterAll`:
  - In **serial** mode, run _after all tests end, once only_
  - In **parallel** mode, run _after all tests end, for each file_
- `afterEach`:
  - In **both** modes, run _after every test_

{:.single-column}

> _Tip: If you need to ensure code runs once and only once in any mode, use [global fixtures](#global-fixtures)._

As with other hooks, `this` refers to the current context object:

```js
// test/hooks.mjs

export const mochaHooks = {
  beforeAll() {
    // skip all tests for bob
    if (require('os').userInfo().username === 'bob') {
      return this.skip();
    }
  }
};
```

### Multiple Root Hooks in a Single Plugin

Multiple root hooks can be defined in a single plugin, for organizational purposes. For example:

```js
// test/hooks.mjs

export const mochaHooks = {
  beforeEach: [
    function (done) {
      // do something before every test,
      // then run the next hook in this array
    },
    async function () {
      // async or Promise-returning functions allowed
    }
  ]
};
```

### Root Hook Plugins Can Export a Function

If you need to perform some logic--such as choosing a root hook conditionally, based on the environment--`mochaHooks` can be a _function_ which returns the expected object.

```js
// test/hooks.mjs

export const mochaHooks = () => {
  if (process.env.CI) {
    // root hooks object
    return {
      beforeEach: [
        function () {
          // CI-specific beforeEach
        },
        function () {
          // some other CI-specific beforeEach
        }
      ]
    };
  }
  // root hooks object
  return {
    beforeEach() {
      // regular beforeEach
    }
  };
};
```

If you need to perform an async operation, `mochaHooks` can be `Promise`-returning:

```js
// test/hooks.mjs

export const mochaHooks = async () => {
  const result = await checkSomething();
  // only use a root hook if `result` is truthy
  if (result) {
    // root hooks object
    return {
      beforeEach() {
        // something
      }
    };
  }
};
```

### Multiple Root Hook Plugins

Multiple root hook plugins can be registered by using `--require` multiple times. For example, to register the root hooks in `hooks-a.js` and `hooks-b.js`, use `--require hooks-a.js --require hooks-b.js`. These will be registered (and run) _in order_.

### Migrating Tests to use Root Hook Plugins

To migrate your tests using root hooks to a root hook plugin:

1. Find your root hooks (hooks defined _outside_ of a suite--usually `describe()` callback).
1. Create a new file, e.g., `test/hooks.js`.
1. _Move_ your root hooks into `test/hooks.js`.
1. In `test/hooks.js`, make your hooks a member of an exported `mochaHooks` property.
1. Use `--require test/hooks.js` (even better: use a [config file](#configuring-mocha-nodejs) with `{"require": "test/hooks.js"}`) when running your tests.

For example, given the following file, `test/test.spec.js`, containing root hooks:

```js
// test/test.spec.js

beforeEach(function () {
  // global setup for all tests
});

after(function () {
  // one-time final cleanup
});

describe('my test suite', function () {
  it('should have run my global setup', function () {
    // make assertion
  });
});
```

Your `test/hooks.js` (for this example, a CJS module) should contain:

```js
// test/hooks.js

exports.mochaHooks = {
  beforeEach: function () {
    // global setup for all tests
  },
  afterAll: function () {
    // one-time final cleanup
  }
};
```

> _NOTE: Careful! `after` becomes `afterAll` and `before` becomes `beforeAll`._

Your original `test/test.spec.js` should now contain:

```js
// test/test.spec.js

describe('my test suite', function () {
  it('should have run my global setup', function () {
    // make assertion
  });
});
```

Running `mocha --require test/hooks.js test/test.spec.js` will run as before (and is now ready to be used with [`--parallel`](#-parallel-p)).

### Migrating a Library to use Root Hook PLugins

If you're a library maintainer, and your library uses root hooks, you can migrate by refactoring your entry point:

- Your library should _always_ export a [`mochaHooks` object](#defining-a-root-hook-plugin).
- To maintain backwards compatibility, run your root hooks _if and only if_ `global.beforeEach` (or other relevant hook) exists.
- Instruct your users to `--require <your-package>` when running `mocha`.

## Global Fixtures

> _Since v8.2.0_

At first glance, _global fixtures_ seem similar to [root hooks](#root-hook-plugins). However, unlike root hooks, global fixtures:

1. Are _guaranteed_ to execute _once and only once_
1. Work identically parallel mode, watch mode, and serial mode
1. Do not share a context with tests, suites, or other hooks

There are two types of global fixtures: [global setup fixtures] and [global teardown fixtures].

### Global Setup Fixtures

To create a global setup fixture, export `mochaGlobalSetup` from a script, e.g.,:

```js
// fixtures.cjs

// can be async or not
exports.mochaGlobalSetup = async function () {
  this.server = await startSomeServer({port: process.env.TEST_PORT});
  console.log(`server running on port ${this.server.port}`);
};
```

...or an ES module:

```js
// fixtures.mjs

// can be async or not
export async function mochaGlobalSetup() {
  this.server = await startSomeServer({port: process.env.TEST_PORT});
  console.log(`server running on port ${this.server.port}`);
}
```

To use it, load this file when running Mocha via `mocha --require fixtures.cjs` (or whatever you have named the file).

> Remember: you can define "requires" in a [configuration file](#configuring-mocha-nodejs).

Now, before Mocha loads and runs your tests, it will execute the above global setup fixture, starting a server for testing. This won't shut _down_ the server when Mocha is done, however! To do that, use a [_global teardown fixture_](#global-teardown-fixtures).

### Global Teardown Fixtures

Just like a [global setup fixture](#global-setup-fixtures), a _global teardown fixture_ can be created by exporting from a "required" script (we can put both types of fixtures in a single file):

```js
// fixtures.cjs, cont'd

// can be async or not
exports.mochaGlobalTeardown = async function () {
  await this.server.stop();
  console.log('server stopped!');
};
```

...or an ES module:

```js
// fixtures.mjs, cont'd

// can be async or not
export async function mochaGlobalTeardown() {
  await this.server.stop();
  console.log('server stopped!');
}
```

You'll note that we used `this` in the fixture examples. Global setup fixtures and global teardown fixtures _share a context_, which means we can add properties to the context object (`this`) in the setup fixture, and reference them later in the teardown fixture. This is more useful when the fixtures are in separate files, since you can just use JS' variable scoping rules instead ([example below](#when-not-to-use-global-fixtures)).

As explained [above](#global-fixtures)--and [below](#when-not-to-use-global-fixtures)--test files _do not_ have access to this context object.

### When To Use Global Fixtures

Global fixtures are good for spinning up a server, opening a socket, or otherwise creating a resource that your tests will repeatedly access via I/O.

### When Not To Use Global Fixtures

If you need to access an in-memory value (such as a file handle or database connection), _don't_ use global fixtures to do this, because your tests will not have access to the value.

> You could be clever and try to get around this restriction by assigning something to the `global` object, but this will _not_ work in parallel mode. It's probably best to play by the rules!

Instead, use the global fixture to _start_ the database, and use [root hook plugins](#root-hook-plugins) or plain ol' [hooks](#hooks) to create a connection.

Here's an example of using global fixtures and "before all" hooks to get the job done. Note that we do not reference the `server` object anywhere in our tests!

First, use a global fixture to start and stop a test server:

```js
// fixtures.mjs

let server;

export const mochaGlobalSetup = async () => {
  server = await startSomeServer({port: process.env.TEST_PORT});
  console.log(`server running on port ${server.port}`);
};

export const mochaGlobalTeardown = async () => {
  await server.stop();
  console.log('server stopped!');
};
```

Then, connect to the server in your tests:

```js
// test.spec.mjs

import {connect} from 'my-server-connector-thingy';

describe('my API', function () {
  let connection;

  before(async function () {
    connection = await connect({port: process.env.TEST_PORT});
  });

  it('should be a nice API', function () {
    // assertions here
  });

  after(async function () {
    return connection.close();
  });
});
```

Finally, use this command to bring it together: `mocha --require fixtures.mjs test.spec.mjs`.

## Test Fixture Decision-Tree Wizard Thing

This flowchart will help you decide which of [hooks], [root hook plugins] or
[global fixtures] you should use.

{% include 'fixture-wizard.html' %}

## Interfaces

Mocha's "interface" system allows developers to choose their style of DSL. Mocha has **BDD**, **TDD**, **Exports**, **QUnit** and **Require**-style interfaces.

### BDD

The **BDD** interface provides `describe()`, `context()`, `it()`, `specify()`, `before()`, `after()`, `beforeEach()`, and `afterEach()`.

`context()` is just an alias for `describe()`, and behaves the same way; it provides a way to keep tests easier to read and organized. Similarly, `specify()` is an alias for `it()`.

> All of the previous examples were written using the **BDD** interface.

```js
describe('Array', function () {
  before(function () {
    // ...
  });

  describe('#indexOf()', function () {
    context('when not present', function () {
      it('should not throw an error', function () {
        (function () {
          [1, 2, 3].indexOf(4);
        }).should.not.throw();
      });
      it('should return -1', function () {
        [1, 2, 3].indexOf(4).should.equal(-1);
      });
    });
    context('when present', function () {
      it('should return the index where the element first appears in the array', function () {
        [1, 2, 3].indexOf(3).should.equal(2);
      });
    });
  });
});
```

### TDD

The **TDD** interface provides `suite()`, `test()`, `suiteSetup()`, `suiteTeardown()`, `setup()`, and `teardown()`:

```js
suite('Array', function () {
  setup(function () {
    // ...
  });

  suite('#indexOf()', function () {
    test('should return -1 when not present', function () {
      assert.equal(-1, [1, 2, 3].indexOf(4));
    });
  });
});
```

### Exports

The **Exports** interface allows for organizing tests in a modular fashion. It is particularly useful in larger projects where test suites can be segmented into different files.

**Note**: The Exports interface is not supported in browser environments. This limitation arises because browsers handle module exports differently from Node.js. If you intend to run tests in a browser, consider using the BDD or TDD interfaces, which are fully supported.

The Exports interface is much like Mocha's predecessor [expresso][]. The keys `before`, `after`, `beforeEach`, and `afterEach` are special-cased, object values are suites, and function values are test-cases:

```js
module.exports = {
  before: function () {
    // ...
  },

  Array: {
    '#indexOf()': {
      'should return -1 when not present': function () {
        [1, 2, 3].indexOf(4).should.equal(-1);
      }
    }
  }
};
```

### QUnit

The [QUnit][]-inspired interface matches the "flat" look of QUnit, where the test suite title is defined _before_ the test-cases. Like TDD, it uses `suite()` and `test()`, but resembling BDD, it also contains `before()`, `after()`, `beforeEach()`, and `afterEach()`.

```js
function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite('Array');

test('#length', function () {
  var arr = [1, 2, 3];
  ok(arr.length == 3);
});

test('#indexOf()', function () {
  var arr = [1, 2, 3];
  ok(arr.indexOf(1) == 0);
  ok(arr.indexOf(2) == 1);
  ok(arr.indexOf(3) == 2);
});

suite('String');

test('#length', function () {
  ok('foo'.length == 3);
});
```

### Require

The `require` interface allows you to require the `describe` and friend words directly using `require` and call them whatever you want. This interface is also useful if you want to avoid global variables in your tests.

_Note_: The `require` interface cannot be run via the `node` executable, and must be run via `mocha`.

```js
var testCase = require('mocha').describe;
var pre = require('mocha').before;
var assertions = require('mocha').it;
var assert = require('chai').assert;

testCase('Array', function () {
  pre(function () {
    // ...
  });

  testCase('#indexOf()', function () {
    assertions('should return -1 when not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

## Reporters

Mocha reporters adjust to the terminal window, and always disable ANSI-escape coloring when the stdio streams are not associated with a TTY.

### Spec

Alias: `Spec`, `spec`

This is the default reporter. The Spec reporter outputs a hierarchical view nested just as the test cases are.

![spec reporter](images/reporter-spec.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}
![spec reporter with failure](images/reporter-spec-fail.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Dot Matrix

Alias: `Dot`, `dot`

The Dot Matrix reporter is a series of characters which represent test cases. Failures highlight in red exclamation marks (`!`), pending tests with a blue comma (`,`), and slow tests as yellow. Good if you prefer minimal output.

![dot matrix reporter](images/reporter-dot.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Nyan

Alias: `Nyan`, `nyan`

The Nyan reporter is exactly what you might expect:

![js nyan cat reporter](images/reporter-nyan.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### TAP

Alias: `TAP`, `tap`

The TAP reporter emits lines for a [Test-Anything-Protocol][] consumer.

![test anything protocol](images/reporter-tap.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Landing Strip

Alias: `Landing`, `landing`

The Landing Strip reporter is a gimmicky test reporter simulating a plane landing :) unicode ftw

![landing strip plane reporter](images/reporter-landing.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}
![landing strip with failure](images/reporter-landing-fail.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### List

Alias: `List`, `list`

The List reporter outputs a simple specifications list as test cases pass or fail, outputting the failure details at the bottom of the output.

![list reporter](images/reporter-list.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Progress

Alias: `Progress`, `progress`

The Progress reporter implements a simple progress-bar:

![progress bar](images/reporter-progress.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### JSON

Alias: `JSON`, `json`

The JSON reporter outputs a single large JSON object when the tests have completed (failures or not).

By default, it will output to the console. To write directly to a file, use `--reporter-option output=filename.json`.

![json reporter](images/reporter-json.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### JSON Stream

Alias: `JSONStream`, `json-stream`

The JSON Stream reporter outputs newline-delimited JSON "events" as they occur, beginning with a "start" event, followed by test passes or failures, and then the final "end" event.

![json stream reporter](images/reporter-json-stream.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Min

Alias: `Min`, `min`

The Min reporter displays the summary only, while still outputting errors on failure. This reporter works great with `--watch` as it clears the terminal in order to keep your test summary at the top.

![min reporter](images/reporter-min.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

### Doc

Alias: `Doc`, `doc`

The Doc reporter outputs a hierarchical HTML body representation of your tests. Wrap it with a header, footer, and some styling, then you have some fantastic documentation!

![doc reporter](images/reporter-doc.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

For example, suppose you have the following JavaScript:

```js
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      [1, 2, 3].indexOf(5).should.equal(-1);
      [1, 2, 3].indexOf(0).should.equal(-1);
    });
  });
});
```

The command `mocha --reporter doc array` would yield:

```html
<section class="suite">
  <h1>Array</h1>
  <dl>
    <section class="suite">
      <h1>#indexOf()</h1>
      <dl>
        <dt>should return -1 when the value is not present</dt>
        <dd>
          <pre><code>[1,2,3].indexOf(5).should.equal(-1);
[1,2,3].indexOf(0).should.equal(-1);</code></pre>
        </dd>
      </dl>
    </section>
  </dl>
</section>
```

The SuperAgent request library [test documentation][superagent-docs-test] was generated with Mocha's doc reporter using this Bash command:

```bash
$ mocha --reporter=doc | cat docs/head.html - docs/tail.html > docs/test.html
```

View SuperAgent's [Makefile][superagent-makefile] for reference.

### Markdown

Alias: `Markdown`, `markdown`

The Markdown reporter generates a markdown TOC and body for your test suite.
This is great if you want to use the tests as documentation within a Github
wiki page, or a markdown file in the repository that Github can render. For
example, here is the Connect [test output][connect-test-output].

### XUnit

Alias: `XUnit`, `xunit`

The XUnit reporter is also available. It outputs an XUnit-compatible XML document, often applicable in CI servers.

By default, it will output to the console. To write directly to a file, use `--reporter-option output=filename.xml`.

To specify custom report title, use `--reporter-option suiteName="Custom name"`.

### Third-Party Reporters

Mocha allows you to define custom reporters. For more information see the [wiki][mocha-wiki-more-reporters].

Examples:

- the [TeamCity reporter][mocha-teamcity-reporter]
- our [working example][example-third-party-reporter]

### HTML Reporter

Alias: `HTML`, `html`

**The HTML reporter is not intended for use on the command-line.**

## Node.JS native ESM support

> _Since v7.1.0_

Mocha supports writing your tests as ES modules, and not just using CommonJS. For example:

```js
// test.mjs
import {add} from './add.mjs';
import assert from 'assert';

it('should add to numbers from an es module', () => {
  assert.equal(add(3, 5), 8);
});
```

To enable this you don't need to do anything special. Write your test file as an ES module. In Node.js
this means either ending the file with a `.mjs` extension, or, if you want to use the regular `.js` extension, by
adding `"type": "module"` to your `package.json`.
More information can be found in the [Node.js documentation](https://nodejs.org/api/esm.html).

### Current Limitations

- [Watch mode](#-watch-w) does not support ES Module test files
- [Custom reporters](#third-party-reporters) and [custom interfaces](#interfaces)
  can only be CommonJS files
- [Configuration file](#configuring-mocha-nodejs) can only be a CommonJS file (`.mocharc.js` or `.mocharc.cjs`)
- When using module-level mocks via libs like `proxyquire`, `rewiremock` or `rewire`,
  hold off on using ES modules for your test files. You can switch to using `testdouble`,
  which does support ESM.

## Running Mocha in the Browser

Mocha runs in the browser. Every release of Mocha will have new builds of `./mocha.js` and `./mocha.css` for use in the browser.

A typical setup might look something like the following, where we call `mocha.setup('bdd')` to use the **BDD** interface before loading the test scripts, running them `onload` with `mocha.run()`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Mocha Tests</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://unpkg.com/mocha/mocha.css" />
  </head>
  <body>
    <div id="mocha"></div>

    <script src="https://unpkg.com/chai@4/chai.js"></script>
    <script src="https://unpkg.com/mocha/mocha.js"></script>

    <script class="mocha-init">
      mocha.setup('bdd');
      mocha.checkLeaks();
    </script>
    <script src="test.array.js"></script>
    <script src="test.object.js"></script>
    <script src="test.xhr.js"></script>
    <script class="mocha-exec">
      mocha.run();
    </script>
  </body>
</html>
```

### Grep

The browser may use the `--grep` as functionality. Append a query-string to your URL: `?grep=api`.

### Browser Configuration

Mocha options can be set via `mocha.setup()`. Examples:

```js
// Use "tdd" interface.  This is a shortcut to setting the interface;
// any other options must be passed via an object.
mocha.setup('tdd');

// This is equivalent to the above.
mocha.setup({
  ui: 'tdd'
});

// Examples of options:
mocha.setup({
  allowUncaught: true,
  asyncOnly: true,
  bail: true,
  checkLeaks: true,
  dryRun: true,
  failZero: true,
  forbidOnly: true,
  forbidPending: true,
  global: ['MyLib'],
  retries: 3,
  repeats: 1,
  rootHooks: { beforeEach(done) { ... done();} },
  slow: '100',
  timeout: '2000',
  ui: 'bdd'
});
```

### Browser-specific Option(s)

Browser Mocha supports many, but not all [cli options](#command-line-usage).
To use a [cli option](#command-line-usage) that contains a "-", please convert the option to camel-case, (eg. `check-leaks` to `checkLeaks`).

#### Options that differ slightly from [cli options](#command-line-usage):

`reporter` _{string|constructor}_
You can pass a reporter's name or a custom reporter's constructor. You can find **recommended** reporters for the browser [here](#reporting). It is possible to use [built-in reporters](#reporters) as well. Their employment in browsers is neither recommended nor supported, open the console to see the test results.

#### Options that _only_ function in browser context:

`noHighlighting` _{boolean}_
If set to `true`, do not attempt to use syntax highlighting on output test code.

### Reporting

The HTML reporter is the default reporter when running Mocha in the browser. It looks like this:

![HTML test reporter](images/reporter-html.png?withoutEnlargement&resize=920,9999){:class="screenshot" loading="lazy"}

[Mochawesome][npm-mochawesome] is a great alternative to the default HTML reporter.

## Configuring Mocha (Node.js)

> _Since v6.0.0_

Mocha supports configuration files, typical of modern command-line tools, in several formats:

- **JavaScript**: Create a `.mocharc.js` (or `.mocharc.cjs` when using [`"type"="module"`](#nodejs-native-esm-support) in your `package.json`)
  in your project's root directory, and export an object (`module.exports = {/* ... */}`) containing your configuration.
- **YAML**: Create a `.mocharc.yaml` (or `.mocharc.yml`) in your project's root directory.
- **JSON**: Create a `.mocharc.json` (or `.mocharc.jsonc`) in your project's root directory. Comments &mdash; while not valid JSON &mdash; are allowed in this file, and will be ignored by Mocha.
- **package.json**: Create a `mocha` property in your project's `package.json`.

### Custom Locations

You can specify a custom location for your configuration file with the `--config <path>` option. Mocha will use the file's extension to determine how to parse the file, and will assume JSON if unknown.

You can specify a custom `package.json` location as well, using the `--package <path>` option.

### Ignoring Config Files

To skip looking for config files, use `--no-config`. Likewise, use `--no-package` to stop Mocha from looking for configuration in a `package.json`.

### Priorities

If no custom path was given, and if there are multiple configuration files in the same directory, Mocha will search for &mdash; and use &mdash; only one. The priority is:

1. `.mocharc.js`
1. `.mocharc.yaml`
1. `.mocharc.yml`
1. `.mocharc.jsonc`
1. `.mocharc.json`

### Environment Variables

The `MOCHA_OPTIONS` environment variable may be used to specify command line arguments. These arguments take priority over those found in configuration files.

For example, setting the `bail` and `retries` options:

```bash
$ MOCHA_OPTIONS="--bail --retries 3" mocha
```

### Merging

Mocha will also _merge_ any options found in `package.json` into its run-time configuration. In case of conflict, the priority is:

1. Arguments specified on command-line
1. Arguments specified in `MOCHA_OPTIONS` environment variable.
1. Configuration file (`.mocharc.js`, `.mocharc.yml`, etc.)
1. `mocha` property of `package.json`

Options which can safely be repeated (e.g., `--require`) will be _concatenated_, with higher-priority configuration sources appearing earlier in the list. For example, a `.mocharc.json` containing `"require": "bar"`, coupled with execution of `mocha --require foo`, would cause Mocha to require `foo`, then `bar`, in that order.

### Extending Configuration

Configurations can inherit from other modules using the `extends` keyword. See [here][yargs-configobject-extends] for more information.

### Configuration Format

- Any "boolean" flag (which doesn't require a parameter, such as `--bail`), can be specified using a boolean value, e.g.: `"bail": true`.
- Any "array"-type option (see `mocha --help` for a list) can be a single string value.
- For options containing a dash (`-`), the option name can be specified using camelCase.
- Aliases are valid names, e.g., `R` instead of `reporter`.
- Test files can be specified using `spec`, e.g., `"spec": "test/**/*.spec.js"`.
- Flags to `node` are _also_ supported in configuration files. Use caution, as these can vary between versions of Node.js!

**For more configuration examples, see the [`example/config`][example-mocha-config] directory on GitHub.**

## The `test/` Directory

By default, `mocha` looks for the glob `"./test/*.{js,cjs,mjs}"`, so you may want to put
your tests in `test/` folder. If you want to include subdirectories, pass the
`--recursive` option.

To configure where `mocha` looks for tests, you may pass your own glob:

```bash
$ mocha --recursive "./spec/*.js"
```

Some shells support recursive matching by using the globstar (`**`) wildcard. Bash >= 4.3 supports this with the [`globstar` option][bash-globbing] which [must be enabled](https://github.com/mochajs/mocha/pull/3348#issuecomment-383937247) to get the same results as passing the `--recursive` option ([ZSH][zsh-globbing] and [Fish][fish-globbing] support this by default). With recursive matching enabled, the following is the same as passing `--recursive`:

```bash
$ mocha "./spec/**/*.js"
```

You should _always_ quote your globs in npm scripts. If you
use quotes, the [`node-glob`][npm-glob] module will
handle its expansion. For maximum compatibility,
surround the entire expression with double quotes and refrain
from `$`, `"`, `^`, and `\` within your expression.

See this [tutorial][gist-globbing-tutorial] on using globs.

_Note_: Double quotes around the glob are recommended for portability.

## Error Codes

> _Since v6.0.0_

When Mocha itself throws exception, the associated `Error` will have a `code` property. Where applicable, consumers should check the `code` property instead of string-matching against the `message` property. The following table describes these error codes:

| Code                               | Description                                                  |
| ---------------------------------- | ------------------------------------------------------------ |
| `ERR_MOCHA_INVALID_ARG_TYPE`       | wrong type was passed for a given argument                   |
| `ERR_MOCHA_INVALID_ARG_VALUE`      | invalid or unsupported value was passed for a given argument |
| `ERR_MOCHA_INVALID_EXCEPTION`      | a falsy or otherwise underspecified exception was thrown     |
| `ERR_MOCHA_INVALID_INTERFACE`      | interface specified in options not found                     |
| `ERR_MOCHA_INVALID_REPORTER`       | reporter specified in options not found                      |
| `ERR_MOCHA_NO_FILES_MATCH_PATTERN` | test file(s) could not be found                              |
| `ERR_MOCHA_UNSUPPORTED`            | requested behavior, option, or parameter is unsupported      |

## Editor Plugins

The following editor-related packages are available:

### TextMate

The [Mocha TextMate bundle][textmate-mocha] includes snippets to make writing tests quicker and more enjoyable.

### JetBrains

[JetBrains][] provides a [NodeJS plugin][jetbrains-plugin] for its suite of IDEs (IntelliJ IDEA, WebStorm, etc.), which contains a Mocha test runner, among other things.

![JetBrains Mocha Runner Plugin in Action](images/jetbrains-plugin.png?withoutEnlargement&resize=920,9999&pngquant){:class="screenshot" loading="lazy"}

The plugin is titled **NodeJS**, and can be installed via **Preferences** > **Plugins**, assuming your license allows it.

### Wallaby.js

[Wallaby.js][] is a continuous testing tool that enables real-time code coverage for Mocha with any assertion library in VS Code, Atom, JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.), Sublime Text and Visual Studio for both browser and node.js projects.

![Wallaby.js in Action](images/wallaby.png?withoutEnlargement&resize=920,9999&pngquant){:class="screenshot" loading="lazy"}

### Emacs

[Emacs][] support for running Mocha tests is available via a 3rd party package [mocha.el][emacs-mocha.el]. The package is available on MELPA, and can be installed via `M-x package-install mocha`.

![Emacs Mocha Runner in Action](images/emacs.png?withoutEnlargement&resize=920,9999&pngquant){:class="screenshot" loading="lazy"}

### Mocha Sidebar (VS Code)

[Mocha sidebar][vscode-mocha-sidebar] is the most complete mocha extension for vs code.

#### Features

- see all tests in VS Code sidebar menu
- run & debug tests for each level hierarchy from all tests to a single test (and each suite)
- auto run tests on file save
- see tests results directly in the code editor

![mocha side bar in Action](images/mocha_side_bar.png?withoutEnlargement&resize=920,9999&pngquant){:class="screenshot" loading="lazy"}

## Examples

Real live example code:

- [Mocha examples][mocha-examples]
- [Express][example-express-test]
- [Connect][example-connect-test]
- [SuperAgent][example-superagent-test]
- [WebSocket.io][example-websocket.io-test]
- [Mocha tests][example-mocha-test]

## Testing Mocha

To run Mocha's tests, you will need GNU Make or compatible; Cygwin should work.

```bash
$ cd /path/to/mocha
$ npm install
$ npm test
```

## More Information

In addition to chatting with us on [our Discord][discord-mocha], for additional information such as using
spies, mocking, and shared behaviours be sure to check out the [Mocha Wiki][mocha-wiki] on GitHub.
For a running example of Mocha, view [example/tests.html](example/tests.html). For the JavaScript API, view the [API documentation](api/)
or the [source](https://github.com/mochajs/mocha/blob/main/lib/mocha.js).

[//]: # 'Cross reference section'
[bash-globbing]: https://www.gnu.org/software/bash/manual/html_node/The-Shopt-Builtin.html
[better-assert]: https://github.com/visionmedia/better-assert
[caniuse-notifications]: https://caniuse.com/#feat=notifications
[caniuse-promises]: https://caniuse.com/#feat=promises
[chai]: https://www.chaijs.com/
[connect-test-output]: https://github.com/senchalabs/connect/blob/90a725343c2945aaee637e799b1cd11e065b2bff/tests.md
[discord-mocha]: https://discord.gg/KeDn2uXhER
[emacs]: https://www.gnu.org/software/emacs/
[emacs-mocha.el]: https://github.com/scottaj/mocha.el
[example-babel]: https://github.com/mochajs/mocha-examples/tree/main/packages/babel
[example-connect-test]: https://github.com/senchalabs/connect/tree/master/test
[example-express-test]: https://github.com/visionmedia/express/tree/master/test
[example-mocha-test]: https://github.com/mochajs/mocha/tree/main/test
[example-mocha-config]: https://github.com/mochajs/mocha/tree/main/example/config
[example-superagent-test]: https://github.com/visionmedia/superagent/tree/master/test/node
[example-third-party-reporter]: https://github.com/mochajs/mocha-examples/tree/main/packages/third-party-reporter
[example-typescript]: https://github.com/mochajs/mocha-examples/tree/main/packages/typescript
[example-websocket.io-test]: https://github.com/LearnBoost/websocket.io/tree/master/test
[expect.js]: https://github.com/LearnBoost/expect.js
[expresso]: https://github.com/tj/expresso
[fish-globbing]: https://fishshell.com/docs/current/#expand-wildcard
[github-mocha]: https://github.com/mochajs/mocha
[gist-async-hooks]: https://gist.github.com/boneskull/7fe75b63d613fa940db7ec990a5f5843
[gist-globbing-tutorial]: https://gist.github.com/reggi/475793ea1846affbcfe8
[jetbrains]: https://www.jetbrains.com/
[jetbrains-plugin]: https://www.jetbrains.com/idea/features/nodejs.html
[mdn-array-sort]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
[mdn-arrow]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
[mdn-async]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Statements/async_function
[mdn-promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
[mdn-regexp]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Regexp
[mdn-settimeout-maxdelay]: https://developer.mozilla.org/docs/Web/API/WindowTimers/setTimeout#Maximum_delay_value
[mocha-examples]: https://github.com/mochajs/mocha-examples
[mocha-teamcity-reporter]: https://github.com/travisjeffery/mocha-teamcity-reporter
[mocha-website]: https://mochajs.org/
[mocha-wiki]: https://github.com/mochajs/mocha/wiki
[mocha-wiki-compilers]: https://github.com/mochajs/mocha/wiki/compilers-deprecation
[mocha-wiki-more-reporters]: https://github.com/mochajs/mocha/wiki/Third-party-reporters
[node.js]: https://nodejs.org/
[node-assert]: https://nodejs.org/api/assert.html
[node-async-hooks]: https://github.com/nodejs/node/blob/master/doc/api/async_hooks.md
[node-inspector]: https://nodejs.org/en/docs/inspector/
[npm]: https://npmjs.org/
[npm-babel-register]: https://npm.im/@babel/register
[npm-chai-as-promised]: https://www.npmjs.com/package/chai-as-promised
[npm-glob]: https://www.npmjs.com/package/glob
[npm-mocha-lcov-reporter]: https://npm.im/mocha-lcov-reporter
[npm-mochawesome]: https://npm.im/mochawesome
[npm-should.js]: https://npm.im/should
[npm-supports-color]: https://npm.im/supports-color
[npm-ts-node]: https://npm.im/ts-node
[npm-wtfnode]: https://npm.im/wtfnode
[qunit]: https://qunitjs.com/
[selenium-webdriver-testing]: https://github.com/SeleniumHQ/selenium/blob/c10e8a955883f004452cdde18096d70738397788/javascript/node/selenium-webdriver/testing/index.js
[should.js]: https://github.com/shouldjs/should.js
[superagent-docs-test]: https://ladjs.github.io/superagent/docs/test.html
[superagent-makefile]: https://github.com/visionmedia/superagent/blob/master/Makefile
[test-anything-protocol]: https://en.wikipedia.org/wiki/Test_Anything_Protocol
[textmate-mocha]: https://github.com/mochajs/mocha.tmbundle
[unexpected]: https://unexpected.js.org/
[vscode-mocha-sidebar]: https://marketplace.visualstudio.com/items?itemName=maty.vscode-mocha-sidebar
[wallaby.js]: https://wallabyjs.com/
[yargs-configobject-extends]: http://yargs.js.org/docs/#api-reference-configobject-extends-keyword
[zsh-globbing]: http://zsh.sourceforge.net/Doc/Release/Expansion.html#Recursive-Globbing
[root hook plugins]: #root-hook-plugins
[global setup fixtures]: #global-setup-fixtures
[global teardown fixtures]: #global-teardown-fixtures
[global fixtures]: #global-fixtures
[hooks]: #hooks
