
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
