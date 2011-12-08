
0.3.3 / 2011-12-08 
==================

  * Fixed hook timeouts. Closes #120
  * Fixed uncaught exceptions in hooks

0.3.2 / 2011-12-05 
==================

  * Fixed weird reporting when `err.message` is not present

0.3.1 / 2011-12-04 
==================

  * Fixed hook event emitter leak. Closes #117
  * Fixed: export `Spec` constructor. Closes #116

0.3.0 / 2011-12-04 
==================

  * Added `-w, --watch`. Closes #72
  * Added `--ignore-leaks` to ignore global leak checking
  * Added browser `?grep=pattern` support
  * Added `--globals <names>` to specify accepted globals. Closes #99
  * Fixed `mocha-debug(1)` on some systems. Closes #232
  * Fixed growl total, use `runner.total`

0.2.0 / 2011-11-30 
==================

  * Added `--globals <names>` to specify accepted globals. Closes #99
  * Fixed funky highlighting of messages. Closes #97
  * Fixed `mocha-debug(1)`. Closes #232
  * Fixed growl total, use runner.total

0.1.0 / 2011-11-29 
==================

  * Added `suiteSetup` and `suiteTeardown` to TDD interface [David Henderson]
  * Added growl icons. Closes #84
  * Fixed coffee-script support

0.0.8 / 2011-11-25 
==================

  * Fixed: use `Runner#total` for accurate reporting

0.0.7 / 2011-11-25 
==================

  * Added `Hook`
  * Added `Runnable`
  * Changed: `Test` is `Runnable`
  * Fixed global leak reporting in hooks
  * Fixed: > 2 calls to done() only report the error once
  * Fixed: clear timer on failure. Closes #80

0.0.6 / 2011-11-25 
==================

  * Fixed return on immediate async error. Closes #80

0.0.5 / 2011-11-24 
==================

  * Fixed: make mocha.opts whitespace less picky [kkaefer]

0.0.4 / 2011-11-24 
==================

  * Added `--interfaces`
  * Added `--reporters`
  * Added `-c, --colors`. Closes #69
  * Fixed hook timeouts

0.0.3 / 2011-11-23 
==================

  * Added `-C, --no-colors` to explicitly disable
  * Added coffee-script support

0.0.2 / 2011-11-22 
==================

  * Fixed global leak detection due to Safari bind() change
  * Fixed: escape html entities in Doc reporter
  * Fixed: escape html entities in HTML reporter
  * Fixed pending test support for HTML reporter. Closes #66

0.0.1 / 2011-11-22 
==================

  * Added `--timeout` second shorthand support, ex `--timeout 3s`.
  * Fixed "test end" event for uncaughtExceptions. Closes #61

0.0.1-alpha6 / 2011-11-19 
==================

  * Added travis CI support (needs enabling when public)
  * Added preliminary browser support
  * Added `make mocha.css` target. Closes #45
  * Added stack trace to TAP errors. Closes #52
  * Renamed tearDown to teardown. Closes #49
  * Fixed: cascading hooksc. Closes #30
  * Fixed some colors for non-tty
  * Fixed errors thrown in sync test-cases due to nextTick
  * Fixed Base.window.width... again give precedence to 0.6.x

0.0.1-alpha5 / 2011-11-17 
==================

  * Added `doc` reporter. Closes #33
  * Added suite merging. Closes #28
  * Added TextMate bundle and `make tm`. Closes #20

0.0.1-alpha4 / 2011-11-15
==================

  * Fixed getWindowSize() for 0.4.x

0.0.1-alpha3 / 2011-11-15
==================

  * Added `-s, --slow <ms>` to specify "slow" test threshold
  * Added `mocha-debug(1)`
  * Added `mocha.opts` support. Closes #31
  * Added: default [files] to _test/*.js_
  * Added protection against multiple calls to `done()`. Closes #35
  * Changed: bright yellow for slow Dot reporter tests

0.0.1-alpha1 / 2011-11-08 
==================

  * Missed this one :)

0.0.1-alpha1 / 2011-11-08 
==================

  * Initial release
