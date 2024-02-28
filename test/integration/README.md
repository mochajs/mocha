# Mocha Integration Tests

The tests in this directory are integration or end-to-end tests. Most of them spawn a `mocha` process and inspect the result of `STDOUT` and/or `STDERR`.

## Directories

- `cli`: Related to general CLI behavior; not necessarily command-line-flag specific
- `fixtures`: Test file fixtures intended to be run via these tests. Usually have `.fixture.js` extension
- `plugins`: Tests related to plugins (e.g., root hook plugins, global fixtures, etc.)
- `options`: Tests for specific command-line flags

## Helpers

The `helpers.js` module contains many functions to handle the common cases of spawning a Mocha process and other utilities. The important ones:

- `runMocha` / `runMochaAsync`: spawns Mocha to run a fixture with the default reporter. Returns a parsed `SummarizedResult` object containing information parsed from the reporter's epilogue
- `runMochaJSON` / `runMochaJSONAsync`: spawns Mocha to run a fixture with a `json` reporter and parses the output; good for assertions about specific numbers and types of test results. Returns a `JSONResult` object
- `invokeMocha` / `invokeMochaAsync`: spawns Mocha with the default reporter but does not parse its output; good for testing errors of the non-test-failure variety. Does not expect a fixture file path, but one can manually be provided. Preferred to test Mocha's output to `STDERR`. Returns a `RawSummarizedResultObject` with the raw output and exit code, etc.
- `resolveFixurePath`: a handy way to get the path to a fixture file. Required when using `invokeMocha*`
- `runMochaWatch*`: similar to `runMocha*`, but runs Mocha in "watch" mode. Accepts a function which should trigger a rerun; the function should touch a file or perform some other filesystem operation. Forks instead of spawns on Windows
- `invokeNode`: spawns `node` instead of `mocha`; good for testing programmatic usage of Mocha by running a script which does this

### Return Types

- `RawResult`: an object containing props `args`, `code`, `output` and `command`
- `SummarizedResult`: a `RawResult` + props `passing`, `failing` and `pending`
- `JSONResult`: a `RawResult` + parsed output of `json` reporter

### Default Arguments

By default, all of these helpers run with the following options:

- `--no-color`: it's easier to make assertions about output w/o having to deal w/ ANSI escape codes
- `--no-bail`: overrides a configuration file w/ `bail: true`; providing `--bail` to the arguments list will supress this (useful when testing `--bail`!)
- `--no-parallel`: overrides a configuration file w/ `parallel: true`; providing `--parallel` to the arguments list will suppress this

## Environment Variables Which Do Stuff

- `DEBUG=mocha:test*`: will show debug output from tests & helpers, if any
- `MOCHA_TEST_KEEP_TEMP_DIRS=1`: does not automatically remove any temporary directories and files created by the `createTempDir` helper. Use to manually debug problems when running fixtures in temp directories
