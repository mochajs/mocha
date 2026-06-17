# About Mocha's Tests

- **All assertions should be made using [unexpected](http://unexpected.js.org)**, unless there's a good reason not to. Exceptions include:
  - Testing diff output. Mocha generates diff output unless the assertion library decides to do this itself. Since `unexpected` generates its _own_ diff output, we need to use an assertion library that does not; we use the built-in `assert` module.
  - `test/unit/runnable.spec.cjs` must avoid 3rd-party code; read source for more info
  - Tests asserting interop with other specific assertion libraries.
- All tests have extension `.spec.js`.
- All test fixtures have extension `.fixture.js`.
- All test fixtures are _ignored_ by ESLint.
- `mocha.opts` will require `test/setup.cjs`, which is the main harness.
- `test/assertions.cjs` contains Mocha-specific types and assertions for `unexpected`
- `test/node-unit/` only runs in Node.js; `test/browser-specific/` only runs in the browser.
  - See `./browser/config.mjs` for the list of suites that run in the browser via Playwright.
- We can't run all of the Node.js tests in one `mocha` command, because we need to use different command-line options to test the various reporters and interfaces.
  - See `../package-scripts.js` for more info about how things are split up.
