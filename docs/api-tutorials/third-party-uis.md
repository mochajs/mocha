Mocha allows you to define custom UIs with the same power as those readily available. When defining UIs locally, you need to `--require` the file in question, along with specifying the `--ui`. However, when published as an npm module, you can use the ui flag as you would any other interface, such as bdd, tdd, etc.

Creating a Third Party UI involves listening for the `pre-require` event emitted by the root suite. It passes a Mocha context object on which you can install the various functions necessary for the UI. Your UI will need to manage the organization and nesting of suites and tests itself, along with marking suites as skipped/pending if this is behavior you chose to expose.

In this first brief example, we'll create an interface with only a single function: `test`

``` javascript
var Mocha = require('mocha');
    Suite = require('mocha/lib/suite'),
    Test  = require('mocha/lib/test');

/**
 * A simple UI that only exposes a single function: test
 */
module.exports = Mocha.interfaces['simple-ui'] = function(suite) {
  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')([suite], context);

    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Describes a specification or test-case with the given `title`
     * and callback `fn` acting as a thunk.
     */
    context.test = function(title, fn) {
      var test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);

      return test;
    };
  });
};
```

``` javascript
test('pass', function() {
  // pass
});

test('fail', function() {
  throw new Error('oops!');
});
```

```
$ # Install dependencies
$ npm install mocha
$ mocha --require ./simple-ui.js --ui simple-ui test.js


  ✓ pass
  1) fail

  1 passing (4ms)
  1 failing

  1)  fail:
     Error: oops!
      at Context.<anonymous> (/Users/danielstjules/Desktop/example/test.js:6:9)
  ...
```

In this next example, we'll be extending the [TDD interface](https://github.com/mochajs/mocha/blob/master/lib/interfaces/tdd.js) with a comment function that simply prints the passed text. That is, `comment('This is a comment');` would print the string.

``` javascript
var Mocha    = require('mocha');
    Suite    = require('mocha/lib/suite'),
    Test     = require('mocha/lib/test'),
    escapeRe = require('escape-string-regexp');

/**
 * This example is identical to the TDD interface, but with the addition of a
 * "comment" function:
 * https://github.com/mochajs/mocha/blob/master/lib/interfaces/tdd.js
 */
module.exports = Mocha.interfaces['example-ui'] = function(suite) {
  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha) {
    var common = require('mocha/lib/interfaces/common')(suites, context);

    /**
     * Use all existing hook logic common to UIs. Common logic can be found in
     * https://github.com/mochajs/mocha/blob/master/lib/interfaces/common.js
     */
    context.setup = common.beforeEach;
    context.teardown = common.afterEach;
    context.suiteSetup = common.before;
    context.suiteTeardown = common.after;
    context.run = mocha.options.delay && common.runWithSuite(suite);

    /**
     * Our addition. A comment function that creates a pending test and
     * adds an isComment attribute to the test for identification by a
     * third party, custom reporter. The comment will be printed just like
     * a pending test. But any custom reporter could check for the isComment
     * attribute on a test to modify its presentation.
     */
    context.comment = function(title) {
      var suite, comment;

      suite = suites[0];
      comment = new Test(title, null);

      comment.pending = true;
      comment.isComment = true;
      comment.file = file;
      suite.addTest(comment);

      return comment;
    };

    // Remaining logic is from the tdd interface, but is necessary for a
    // complete example
    // https://github.com/mochajs/mocha/blob/master/lib/interfaces/tdd.js

    /**
     * The default TDD suite functionality. Describes a suite with the
     * given title and callback, fn`, which may contain nested suites
     * and/or tests.
     */
    context.suite = function(title, fn) {
      var suite = Suite.create(suites[0], title);

      suite.file = file;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();

      return suite;
    };

    /**
     * The default TDD pending suite functionality.
     */
    context.suite.skip = function(title, fn) {
      var suite = Suite.create(suites[0], title);

      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Default TDD exclusive test-case logic.
     */
    context.suite.only = function(title, fn) {
      var suite = context.suite(title, fn);
      mocha.grep(suite.fullTitle());
    };

    /**
     * Default TDD test-case logic. Describes a specification or test-case
     * with the given `title` and callback `fn` acting as a thunk.
     */
    context.test = function(title, fn) {
      var suite, test;

      suite = suites[0];
      if (suite.pending) fn = null;
      test = new Test(title, fn);
      test.file = file;
      suite.addTest(test);

      return test;
    };

    /**
     * Exclusive test-case.
     */
    context.test.only = function(title, fn) {
      var test, reString;

      test = context.test(title, fn);
      reString = '^' + escapeRe(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
    };

    /**
     * Defines the skip behavior for a test.
     */
    context.test.skip = common.test.skip;
  });
};
```

``` javascript
suite('Example', function() {
  comment("Here's the addition we made to the UI");

  test('passing test', function() {
    // Pass
  });

  test('failing test', function() {
    throw new Error('it failed!');
  });
});
```

```
$ # install both dependencies
$ npm install mocha escape-string-regexp
$ # Run our example
$ mocha --require ./example-ui.js --ui example-ui test.js


  Example
    - Here's the addition we made to the UI
    ✓ passing test
    1) failing test


  1 passing (5ms)
  1 pending
  1 failing

  1) Example failing test:
     Error: it failed!
      at Context.<anonymous> (/Users/danielstjules/Desktop/example/test.js:11:11)
      at callFn (/Users/danielstjules/Desktop/example/node_modules/mocha/lib/runnable.js:266:21)
      at Test.Runnable.run
....
```
