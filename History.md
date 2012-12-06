
1.7.4 / 2012-12-06 
==================

  * add total number of passes and failures to TAP
  * remove .bind() calls. re #680
  * fix indexOf. Closes #680

1.7.3 / 2012-11-30 
==================

  * fix uncaught error support for the browser
  * revert uncaught "fix" which breaks node

1.7.2 / 2012-11-28 
==================

  * fix uncaught errors to expose the original error message  

1.7.0 / 2012-11-07 
==================

  * add `--async-only` support to prevent false positives for missing `done()`
  * add sorting by filename in code coverage
  * add HTML 5 doctype to browser template.
  * add play button to html reporter to rerun a single test
  * add `this.timeout(ms)` as Suite#timeout(ms). Closes #599
  * update growl dependency to 1.6.x
  * fix encoding of test-case ?grep. Closes #637
  * fix unicode chars on windows
  * fix dom globals in Opera/IE. Closes #243
  * fix markdown reporter a tags
  * fix `this.timeout("5s")` support

1.6.0 / 2012-10-02 
==================

  * add object diffs when `err.showDiff` is present
  * add hiding of empty suites when pass/failures are toggled
  * add faster `.length` checks to `checkGlobals()` before performing the filter

1.5.0 / 2012-09-21 
==================

  * add `ms()` to `.slow()` and `.timeout()`
  * add `Mocha#checkLeaks()` to re-enable global leak checks
  * add `this.slow()` option [aheckmann]
  * add tab, CR, LF to error diffs for now
  * add faster `.checkGlobals()` solution [guille]
  * remove `fn.call()` from reduce util
  * remove `fn.call()` from filter util
  * fix forEach. Closes #582
  * fix relaying of signals [TooTallNate]
  * fix TAP reporter grep number

1.4.2 / 2012-09-01 
==================

  * add support to multiple `Mocha#globals()` calls, and strings
  * add `mocha.reporter()` constructor support [jfirebaugh]
  * add `mocha.timeout()`
  * move query-string parser to utils.js
  * move highlight code to utils.js
  * fix third-party reporter support [exogen]
  * fix client-side API to match node-side [jfirebaugh]
  * fix mocha in iframe [joliss]

1.4.1 / 2012-08-28 
==================

  * add missing `Markdown` export
  * fix `Mocha#grep()`, escape regexp strings
  * fix reference error when `devicePixelRatio` is not defined. Closes #549

1.4.0 / 2012-08-22 
==================

  * add mkdir -p to `mocha init`. Closes #539
  * add `.only()`. Closes #524
  * add `.skip()`. Closes #524
  * change str.trim() to use utils.trim(). Closes #533
  * fix HTML progress indicator retina display
  * fix url-encoding of click-to-grep HTML functionality

1.3.2 / 2012-08-01 
==================

  * fix exports double-execution regression. Closes #531

1.3.1 / 2012-08-01 
==================

  * add passes/failures toggling to HTML reporter
  * add pending state to `xit()` and `xdescribe()` [Brian Moore]
  * add the @charset "UTF-8"; to fix #522 with FireFox. [Jonathan Creamer]
  * add border-bottom to #stats links
  * add check for runnable in `Runner#uncaught()`. Closes #494
  * add 0.4 and 0.6 back to travis.yml
  * add `-E, --growl-errors` to growl on failures only
  * add prefixes to debug() names. Closes #497
  * add `Mocha#invert()` to js api
  * change dot reporter to use sexy unicode dots
  * fix error when clicking pending test in HTML reporter
  * fix `make tm`

1.3.0 / 2012-07-05 
==================

  * add window scrolling to `HTML` reporter
  * add v8 `--trace-*` option support
  * add support for custom reports via `--reporter MODULE`
  * add `--invert` switch to invert `--grep` matches
  * fix export of `Nyan` reporter. Closes #495
  * fix escaping of `HTML` suite titles. Closes #486
  * fix `done()` called multiple times with an error test
  * change `--grep` - regexp escape the input

1.2.2 / 2012-06-28 
==================

  * Added 0.8.0 support

1.2.1 / 2012-06-25 
==================

  * Added `this.test.error(err)` support to after each hooks. Closes #287
  * Added: export top-level suite on global mocha object (mocha.suite). Closes #448
  * Fixed `js` code block format error in markdown reporter
  * Fixed deprecation warning when using `path.existsSync`
  * Fixed --globals with wildcard
  * Fixed chars in nyan when his head moves back
  * Remove `--growl` from test/mocha.opts. Closes #289

1.2.0 / 2012-06-17 
==================

  * Added `nyan` reporter [Atsuya Takagi]
  * Added `mocha init <path>` to copy client files
  * Added "specify" synonym for "it" [domenic]
  * Added global leak wildcard support [nathanbowser]
  * Fixed runner emitter leak. closes #432
  * Fixed omission of .js extension. Closes #454

1.1.0 / 2012-05-30 
==================

  * Added: check each `mocha(1)` arg for directories to walk
  * Added `--recursive` [tricknotes]
  * Added `context` for BDD [hokaccha]
  * Added styling for new clickable titles
  * Added clickable suite titles to HTML reporter
  * Added warning when strings are thrown as errors
  * Changed: green arrows again in HTML reporter styling
  * Changed ul/li elements instead of divs for better copy-and-pasting [joliss]
  * Fixed issue #325 - add better grep support to js api
  * Fixed: save timer references to avoid Sinon interfering.

1.0.3 / 2012-04-30 
==================

  * Fixed string diff newlines
  * Fixed: removed mocha.css target. Closes #401

1.0.2 / 2012-04-25 
==================

  * Added HTML reporter duration. Closes #47
  * Fixed: one postMessage event listener [exogen]
  * Fixed: allow --globals to be used multiple times. Closes #100 [brendannee]
  * Fixed #158: removes jquery include from browser tests
  * Fixed grep. Closes #372 [brendannee]
  * Fixed #166 - When grepping don't display the empty suites
  * Removed test/browser/style.css. Closes #385

1.0.1 / 2012-04-04 
==================

  * Fixed `.timeout()` in hooks
  * Fixed: allow callback for `mocha.run()` in client version
  * Fixed browser hook error display. Closes #361

1.0.0 / 2012-03-24 
==================

  * Added js API. Closes #265
  * Added: initial run of tests with `--watch`. Closes #345
  * Added: mark `location` as a global on the CS. Closes #311
  * Added `markdown` reporter (github flavour)
  * Added: scrolling menu to coverage.html. Closes #335
  * Added source line to html report for Safari [Tyson Tate]
  * Added "min" reporter, useful for `--watch` [Jakub Nešetřil]
  * Added support for arbitrary compilers via . Closes #338 [Ian Young]
  * Added Teamcity export to lib/reporters/index [Michael Riley]
  * Fixed chopping of first char in error reporting. Closes #334 [reported by topfunky]
  * Fixed terrible FF / Opera stack traces

0.14.1 / 2012-03-06 
==================

  * Added lib-cov to _.npmignore_
  * Added reporter to `mocha.run([reporter])` as argument
  * Added some margin-top to the HTML reporter
  * Removed jQuery dependency
  * Fixed `--watch`: purge require cache. Closes #266

0.14.0 / 2012-03-01 
==================

  * Added string diff support for terminal reporters

0.13.0 / 2012-02-23 
==================

  * Added preliminary test coverage support. Closes #5
  * Added `HTMLCov` reporter
  * Added `JSONCov` reporter [kunklejr]
  * Added `xdescribe()` and `xit()` to the BDD interface. Closes #263 (docs   * Changed: make json reporter output pretty json
  * Fixed node-inspector support, swapped `--debug` for `debug` to match node. 
needed)
Closes #247

0.12.1 / 2012-02-14 
==================

  * Added `npm docs mocha` support [TooTallNate]
  * Added a `Context` object used for hook and test-case this. Closes #253
  * Fixed `Suite#clone()` `.ctx` reference. Closes #262

0.12.0 / 2012-02-02 
==================

  * Added .coffee `--watch` support. Closes #242
  * Added support to `--require` files relative to the CWD. Closes #241
  * Added quick n dirty syntax highlighting. Closes #248
  * Changed: made HTML progress indicator smaller
  * Fixed xunit errors attribute [dhendo]

0.10.2 / 2012-01-21 
==================

  * Fixed suite count in reporter stats. Closes #222
  * Fixed `done()` after timeout error reporting [Phil Sung]
  * Changed the 0-based errors to 1

0.10.1 / 2012-01-17 
==================

  * Added support for node 0.7.x
  * Fixed absolute path support. Closes #215 [kompiro]
  * Fixed `--no-colors` option [Jussi Virtanen]
  * Fixed Arial CSS typo in the correct file

0.10.0 / 2012-01-13 
==================

  * Added `-b, --bail` to exit on first exception [guillermo]
  * Added support for `-gc` / `--expose-gc` [TooTallNate]
  * Added `qunit`-inspired interface
  * Added MIT LICENSE. Closes #194
  * Added: `--watch` all .js in the CWD. Closes #139
  * Fixed `self.test` reference in runner. Closes #189
  * Fixed double reporting of uncaught exceptions after timeout. Closes #195

0.8.2 / 2012-01-05 
==================

  * Added test-case context support. Closes #113
  * Fixed exit status. Closes #187
  * Update commander. Closes #190

0.8.1 / 2011-12-30 
==================

  * Fixed reporting of uncaught exceptions. Closes #183
  * Fixed error message defaulting [indutny]
  * Changed mocha(1) from bash to node for windows [Nathan Rajlich]

0.8.0 / 2011-12-28 
==================

  * Added `XUnit` reporter [FeeFighters/visionmedia]
  * Added `say(1)` notification support [Maciej Małecki]
  * Changed: fail when done() is invoked with a non-Error. Closes #171
  * Fixed `err.stack`, defaulting to message. Closes #180
  * Fixed: `make tm` mkdir -p the dest. Closes #137
  * Fixed mocha(1) --help bin name
  * Fixed `-d` for `--debug` support

0.7.1 / 2011-12-22 
==================

  * Removed `mocha-debug(1)`, use `mocha --debug`
  * Fixed CWD relative requires
  * Fixed growl issue on windows [Raynos]
  * Fixed: platform specific line endings [TooTallNate]
  * Fixed: escape strings in HTML reporter. Closes #164

0.7.0 / 2011-12-18 
==================

  * Added support for IE{7,8} [guille]
  * Changed: better browser nextTick implementation [guille]

0.6.0 / 2011-12-18 
==================

  * Added setZeroTimeout timeout for browser (nicer stack traces). Closes #153
  * Added "view source" on hover for HTML reporter to make it obvious
  * Changed: replace custom growl with growl lib
  * Fixed duplicate reporting for HTML reporter. Closes #154
  * Fixed silent hook errors in the HTML reporter. Closes #150

0.5.0 / 2011-12-14 
==================

  * Added: push node_modules directory onto module.paths for relative require Closes #93
  * Added teamcity reporter [blindsey]
  * Fixed: recover from uncaught exceptions for tests. Closes #94
  * Fixed: only emit "test end" for uncaught within test, not hook

0.4.0 / 2011-12-14 
==================

  * Added support for test-specific timeouts via `this.timeout(0)`. Closes #134
  * Added guillermo's client-side EventEmitter. Closes #132
  * Added progress indicator to the HTML reporter
  * Fixed slow browser tests. Closes #135
  * Fixed "suite" color for light terminals
  * Fixed `require()` leak spotted by [guillermo]

0.3.6 / 2011-12-09 
==================

  * Removed suite merging (for now)

0.3.5 / 2011-12-08 
==================

  * Added support for `window.onerror` [guillermo]
  * Fixed: clear timeout on uncaught exceptions. Closes #131 [guillermo]
  * Added `mocha.css` to PHONY list.
  * Added `mocha.js` to PHONY list.

0.3.4 / 2011-12-08 
==================

  * Added: allow `done()` to be called with non-Error
  * Added: return Runner from `mocha.run()`. Closes #126
  * Fixed: run afterEach even on failures. Closes #125
  * Fixed clobbering of current runnable. Closes #121

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
