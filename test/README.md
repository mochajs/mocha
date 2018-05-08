# About Mocha's Tests

- **All assertions should be made using [unexpected](http://unexpected.js.org)**, unless there's a good reason not to.  Exceptions include:
  - Testing diff output.  Mocha generates diff output unless the assertion library decides to do this itself.  Since `unexpected` generates its *own* diff output, we need to use an assertion library that does not; we use the built-in `assert` module.
  - `test/unit/runnable.spec.js` must avoid 3rd-party code; read source for more info
  - Tests asserting interop with other specific assertion libraries.
- All tests have extension `.spec.js`.
- All test fixtures have extension `.fixture.js`.
- All test fixtures are *ignored* by ESLint.
- `mocha.opts` will require `test/setup.js`, which is the main harness.
- `test/assertions.js` contains Mocha-specific types and assertions for `unexpected`
- `test/node-unit/` only runs in Node.js; `test/browser-specific/` only runs in the browser.
  - See `../karma.conf.js` for more information on which tests run in the browser.
- We can't run all of the Node.js tests in one `mocha` command, because we need to use different command-line options to test the various reporters and interfaces.
  - See `../package-scripts.js` for more info about how things are split up.
