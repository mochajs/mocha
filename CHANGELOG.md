# 6.1.4 / 2019-04-18

## :lock: Security Fixes

- [#3877](https://github.com/mochajs/mocha/issues/3877): Upgrade [js-yaml](https://npm.im/js-yaml), addressing [code injection vulnerability](https://www.npmjs.com/advisories/813) ([**@bjornstar**](https://github.com/bjornstar))

# 6.1.3 / 2019-04-11

## :bug: Fixes

- [#3863](https://github.com/mochajs/mocha/issues/3863): Fix `yargs`-related global scope pollution ([**@inukshuk**](https://github.com/inukshuk))
- [#3869](https://github.com/mochajs/mocha/issues/3869): Fix failure when installed w/ `pnpm` ([**@boneskull**](https://github.com/boneskull))

# 6.1.2 / 2019-04-08

## :bug: Fixes

- [#3867](https://github.com/mochajs/mocha/issues/3867): Re-publish v6.1.1 from POSIX OS to avoid dropped executable flags ([**@boneskull**](https://github.com/boneskull))

# 6.1.1 / 2019-04-07

## :bug: Fixes

- [#3866](https://github.com/mochajs/mocha/issues/3866): Fix Windows End-of-Line publishing issue ([**@juergba**](https://github.com/juergba) & [**@cspotcode**](https://github.com/cspotcode))

# 6.1.0 / 2019-04-07

## :lock: Security Fixes

- [#3845](https://github.com/mochajs/mocha/issues/3845): Update dependency "js-yaml" to v3.13.0 per npm security advisory ([**@plroebuck**](https://github.com/plroebuck))

## :tada: Enhancements

- [#3766](https://github.com/mochajs/mocha/issues/3766): Make reporter constructor support optional `options` parameter ([**@plroebuck**](https://github.com/plroebuck))
- [#3760](https://github.com/mochajs/mocha/issues/3760): Add support for config files with `.jsonc` extension ([**@sstephant**](https://github.com/sstephant))

## :fax: Deprecations

These are _soft_-deprecated, and will emit a warning upon use. Support will be removed in (likely) the next major version of Mocha:

- [#3719](https://github.com/mochajs/mocha/issues/3719): Deprecate `this.skip()` for "after all" hooks ([**@juergba**](https://github.com/juergba))

## :bug: Fixes

- [#3829](https://github.com/mochajs/mocha/issues/3829): Use cwd-relative pathname to load config file ([**@plroebuck**](https://github.com/plroebuck))
- [#3745](https://github.com/mochajs/mocha/issues/3745): Fix async calls of `this.skip()` in "before each" hooks ([**@juergba**](https://github.com/juergba))
- [#3669](https://github.com/mochajs/mocha/issues/3669): Enable `--allow-uncaught` for uncaught exceptions thrown inside hooks ([**@givanse**](https://github.com/givanse))

and some regressions:

- [#3848](https://github.com/mochajs/mocha/issues/3848): Fix `Suite` cloning by copying `root` property ([**@fatso83**](https://github.com/fatso83))
- [#3816](https://github.com/mochajs/mocha/issues/3816): Guard against undefined timeout option ([**@boneskull**](https://github.com/boneskull))
- [#3814](https://github.com/mochajs/mocha/issues/3814): Update "yargs" in order to avoid deprecation message ([**@boneskull**](https://github.com/boneskull))
- [#3788](https://github.com/mochajs/mocha/issues/3788): Fix support for multiple node flags ([**@aginzberg**](https://github.com/aginzberg))

## :book: Documentation

- [mochajs/mocha-examples](https://github.com/mochajs/mocha-examples): New repository of working examples of common configurations using mocha ([**@craigtaub**](https://github.com/craigtaub))
- [#3850](https://github.com/mochajs/mocha/issues/3850): Remove pound icon showing on header hover on docs ([**@jd2rogers2**](https://github.com/jd2rogers2))
- [#3812](https://github.com/mochajs/mocha/issues/3812): Add autoprefixer to documentation page CSS ([**@Munter**](https://github.com/Munter))
- [#3811](https://github.com/mochajs/mocha/issues/3811): Update doc examples "tests.html" ([**@DavidLi119**](https://github.com/DavidLi119))
- [#3807](https://github.com/mochajs/mocha/issues/3807): Mocha website HTML tweaks ([**@plroebuck**](https://github.com/plroebuck))
- [#3793](https://github.com/mochajs/mocha/issues/3793): Update config file example ".mocharc.yml" ([**@cspotcode**](https://github.com/cspotcode))

## :nut_and_bolt: Other

- [#3830](https://github.com/mochajs/mocha/issues/3830): Replace dependency "findup-sync" with "find-up" for faster startup ([**@cspotcode**](https://github.com/cspotcode))
- [#3799](https://github.com/mochajs/mocha/issues/3799): Update devDependencies to fix many npm vulnerabilities ([**@XhmikosR**](https://github.com/XhmikosR))

# 6.0.2 / 2019-02-25

## :bug: Fixes

Two more regressions fixed:

- [#3768](https://github.com/mochajs/mocha/issues/3768): Test file paths no longer dropped from `mocha.opts` ([**@boneskull**](https://github.com/boneskull))
- [#3767](https://github.com/mochajs/mocha/issues/3767): `--require` does not break on module names that look like certain `node` flags ([**@boneskull**](https://github.com/boneskull))

# 6.0.1 / 2019-02-21

The obligatory round of post-major-release bugfixes.

## :bug: Fixes

These issues were regressions.

- [#3754](https://github.com/mochajs/mocha/issues/3754): Mocha again finds `test.js` when run without arguments ([**@plroebuck**](https://github.com/plroebuck))
- [#3756](https://github.com/mochajs/mocha/issues/3756): Mocha again supports third-party interfaces via `--ui` ([**@boneskull**](https://github.com/boneskull))
- [#3755](https://github.com/mochajs/mocha/issues/3755): Fix broken `--watch` ([**@boneskull**](https://github.com/boneskull))
- [#3759](https://github.com/mochajs/mocha/issues/3759): Fix unwelcome deprecation notice when Mocha run against languages (CoffeeScript) with implicit return statements; _returning a non-`undefined` value from a `describe` callback is no longer considered deprecated_ ([**@boneskull**](https://github.com/boneskull))

## :book: Documentation

- [#3738](https://github.com/mochajs/mocha/issues/3738): Upgrade to `@mocha/docdash@2` ([**@tendonstrength**](https://github.com/tendonstrength))
- [#3751](https://github.com/mochajs/mocha/issues/3751): Use preferred names for example config files ([**@Szauka**](https://github.com/Szauka))

# 6.0.0 / 2019-02-18

## :tada: Enhancements

- [#3726](https://github.com/mochajs/mocha/issues/3726): Add ability to unload files from `require` cache ([**@plroebuck**](https://github.com/plroebuck))

## :bug: Fixes

- [#3737](https://github.com/mochajs/mocha/issues/3737): Fix falsy values from options globals ([**@plroebuck**](https://github.com/plroebuck))
- [#3707](https://github.com/mochajs/mocha/issues/3707): Fix encapsulation issues for `Suite#_onlyTests` and `Suite#_onlySuites` ([**@vkarpov15**](https://github.com/vkarpov15))
- [#3711](https://github.com/mochajs/mocha/issues/3711): Fix diagnostic messages dealing with plurality and markup of output ([**@plroebuck**](https://github.com/plroebuck))
- [#3723](https://github.com/mochajs/mocha/issues/3723): Fix "reporter-option" to allow comma-separated options ([**@boneskull**](https://github.com/boneskull))
- [#3722](https://github.com/mochajs/mocha/issues/3722): Fix code quality and performance of `lookupFiles` and `files` ([**@plroebuck**](https://github.com/plroebuck))
- [#3650](https://github.com/mochajs/mocha/issues/3650), [#3654](https://github.com/mochajs/mocha/issues/3654): Fix noisy error message when no files found ([**@craigtaub**](https://github.com/craigtaub))
- [#3632](https://github.com/mochajs/mocha/issues/3632): Tests having an empty title are no longer confused with the "root" suite ([**@juergba**](https://github.com/juergba))
- [#3666](https://github.com/mochajs/mocha/issues/3666): Fix missing error codes ([**@vkarpov15**](https://github.com/vkarpov15))
- [#3684](https://github.com/mochajs/mocha/issues/3684): Fix exiting problem in Node.js v11.7.0+ ([**@addaleax**](https://github.com/addaleax))
- [#3691](https://github.com/mochajs/mocha/issues/3691): Fix `--delay` (and other boolean options) not working in all cases ([**@boneskull**](https://github.com/boneskull))
- [#3692](https://github.com/mochajs/mocha/issues/3692): Fix invalid command-line argument usage not causing actual errors ([**@boneskull**](https://github.com/boneskull))
- [#3698](https://github.com/mochajs/mocha/issues/3698), [#3699](https://github.com/mochajs/mocha/issues/3699): Fix debug-related Node.js options not working in all cases ([**@boneskull**](https://github.com/boneskull))
- [#3700](https://github.com/mochajs/mocha/issues/3700): Growl notifications now show the correct number of tests run ([**@outsideris**](https://github.com/outsideris))
- [#3686](https://github.com/mochajs/mocha/issues/3686): Avoid potential ReDoS when diffing large objects ([**@cyjake**](https://github.com/cyjake))
- [#3715](https://github.com/mochajs/mocha/issues/3715): Fix incorrect order of emitted events when used programmatically ([**@boneskull**](https://github.com/boneskull))
- [#3706](https://github.com/mochajs/mocha/issues/3706): Fix regression wherein `--reporter-option`/`--reporter-options` did not support comma-separated key/value pairs ([**@boneskull**](https://github.com/boneskull))

## :book: Documentation

- [#3652](https://github.com/mochajs/mocha/issues/3652): Switch from Jekyll to Eleventy ([**@Munter**](https://github.com/Munter))

## :nut_and_bolt: Other

- [#3677](https://github.com/mochajs/mocha/issues/3677): Add error objects for createUnsupportedError and createInvalidExceptionError ([**@boneskull**](https://github.com/boneskull))
- [#3733](https://github.com/mochajs/mocha/issues/3733): Removed unnecessary processing in post-processing hook ([**@wanseob**](https://github.com/wanseob))
- [#3730](https://github.com/mochajs/mocha/issues/3730): Update nyc to latest version ([**@coreyfarrell**](https://github.com/coreyfarrell))
- [#3648](https://github.com/mochajs/mocha/issues/3648), [#3680](https://github.com/mochajs/mocha/issues/3680): Fixes to support latest versions of [unexpected](https://npm.im/unexpected) and [unexpected-sinon](https://npm.im/unexpected-sinon) ([**@sunesimonsen**](https://github.com/sunesimonsen))
- [#3638](https://github.com/mochajs/mocha/issues/3638): Add meta tag to site ([**@MartijnCuppens**](https://github.com/MartijnCuppens))
- [#3653](https://github.com/mochajs/mocha/issues/3653): Fix parts of test suite failing to run on Windows ([**@boneskull**](https://github.com/boneskull))

# 6.0.0-1 / 2019-01-02

## :bug: Fixes

- Fix missing `mocharc.json` in published package ([**@boneskull**](https://github.com/boneskull))

# 6.0.0-0 / 2019-01-01

**Documentation for this release can be found at [next.mochajs.org](https://next.mochajs.org)**!

Welcome [**@plroebuck**](https://github.com/plroebuck), [**@craigtaub**](https://github.com/craigtaub), & [**@markowsiak**](https://github.com/markowsiak) to the team!

## :boom: Breaking Changes

- [#3149](https://github.com/mochajs/mocha/issues/3149): **Drop Node.js v4.x support** ([**@outsideris**](https://github.com/outsideris))
- [#3556](https://github.com/mochajs/mocha/issues/3556): Changes to command-line options ([**@boneskull**](https://github.com/boneskull)):
  - `--grep` and `--fgrep` are now mutually exclusive; attempting to use both will cause Mocha to fail instead of simply ignoring `--grep`
  - `--compilers` is no longer supported; attempting to use will cause Mocha to fail with a link to more information
  - `-d` is no longer an alias for `--debug`; `-d` is currently ignored
  - [#3275](https://github.com/mochajs/mocha/issues/3275): `--watch-extensions` no longer implies `js`; it must be explicitly added ([**@TheDancingCode**](https://github.com/TheDancingCode))
- [#2908](https://github.com/mochajs/mocha/issues/2908): `tap` reporter emits error messages ([**@chrmod**](https://github.com/chrmod))
- [#2819](https://github.com/mochajs/mocha/issues/2819): When conditionally skipping in a `before` hook, subsequent `before` hooks _and_ tests in nested suites are now skipped ([**@bannmoore**](https://github.com/bannmoore))
- [#627](https://github.com/mochajs/mocha/issues/627): Emit filepath in "timeout exceeded" exceptions where applicable ([**@boneskull**](https://github.com/boneskull))
- [#3556](https://github.com/mochajs/mocha/issues/3556): `lib/template.html` has moved to `lib/browser/template.html` ([**@boneskull**](https://github.com/boneskull))
- [#2576](https://github.com/mochajs/mocha/issues/2576): An exception is now thrown if Mocha fails to parse or find a `mocha.opts` at a user-specified path ([**@plroebuck**](https://github.com/plroebuck))
- [#3458](https://github.com/mochajs/mocha/issues/3458): Instantiating a `Base`-extending reporter without a `Runner` parameter will throw an exception ([**@craigtaub**](https://github.com/craigtaub))
- [#3125](https://github.com/mochajs/mocha/issues/3125): For consumers of Mocha's programmatic API, all exceptions thrown from Mocha now have a `code` property (and some will have additional metadata). Some `Error` messages have changed. **Please use the `code` property to check `Error` types instead of the `message` property**; these descriptions will be localized in the future. ([**@craigtaub**](https://github.com/craigtaub))

## :fax: Deprecations

These are _soft_-deprecated, and will emit a warning upon use. Support will be removed in (likely) the next major version of Mocha:

- `-gc` users should use `--gc-global` instead
- Consumers of the function exported by `bin/options` should now use the `loadMochaOpts` or `loadOptions` (preferred) functions exported by the `lib/cli/options` module

Regarding the `Mocha` class constructor (from `lib/mocha`):

- Use property `color: false` instead of `useColors: false`
- Use property `timeout: false` instead of `enableTimeouts: false`

All of the above deprecations were introduced by [#3556](https://github.com/mochajs/mocha/issues/3556).

`mocha.opts` is now considered "legacy"; please prefer RC file or `package.json` over `mocha.opts`.

## :tada: Enhancements

Enhancements introduced in [#3556](https://github.com/mochajs/mocha/issues/3556):

- Mocha now supports "RC" files in JS, JSON, YAML, or `package.json`-based (using `mocha` property) format

  - `.mocharc.js`, `.mocharc.json`, `.mocharc.yaml` or `.mocharc.yml` are valid "rc" file names and will be automatically loaded
  - Use `--config /path/to/rc/file` to specify an explicit path
  - Use `--package /path/to/package.json` to specify an explicit `package.json` to read the `mocha` prop from
  - Use `--no-config` or `--no-package` to completely disable loading of configuration via RC file and `package.json`, respectively
  - Configurations are merged as applicable using the priority list:
    1. Command-line arguments
    1. RC file
    1. `package.json`
    1. `mocha.opts`
    1. Mocha's own defaults
  - Check out these [example config files](https://github.com/mochajs/mocha/tree/master/example/config)

- Node/V8 flag support in `mocha` executable:

  - Support all allowed `node` flags as supported by the running version of `node` (also thanks to [**@demurgos**](https://github.com/demurgos))
  - Support any V8 flag by prepending `--v8-` to the flag name
  - All flags are also supported via config files, `package.json` properties, or `mocha.opts`
  - Debug-related flags (e.g., `--inspect`) now _imply_ `--no-timeouts`
  - Use of e.g., `--debug` will automatically invoke `--inspect` if supported by running version of `node`

- Support negation of any Mocha-specific command-line flag by prepending `--no-` to the flag name

- Interfaces now have descriptions when listed using `--interfaces` flag

- `Mocha` constructor supports all options

- `--extension` is now an alias for `--watch-extensions` and affects _non-watch-mode_ test runs as well. For example, to run _only_ `test/*.coffee` (not `test/*.js`), you can do `mocha --require coffee-script/register --extensions coffee`.

- [#3552](https://github.com/mochajs/mocha/issues/3552): `tap` reporter is now TAP13-capable ([**@plroebuck**](https://github.com/plroebuck) & [**@mollstam**](https://github.com/mollstam))

- [#3535](https://github.com/mochajs/mocha/issues/3535): Mocha's version can now be queried programmatically via public property `Mocha.prototype.version` ([**@plroebuck**](https://github.com/plroebuck))

- [#3428](https://github.com/mochajs/mocha/issues/3428): `xunit` reporter shows diffs ([**@mlucool**](https://github.com/mlucool))

- [#2529](https://github.com/mochajs/mocha/issues/2529): `Runner` now emits a `retry` event when tests are retried (reporters can listen for this) ([**@catdad**](https://github.com/catdad))

- [#2962](https://github.com/mochajs/mocha/issues/2962), [#3111](https://github.com/mochajs/mocha/issues/3111): In-browser notification support; warn about missing prereqs when `--growl` supplied ([**@plroebuck**](https://github.com/plroebuck))

## :bug: Fixes

- [#3356](https://github.com/mochajs/mocha/issues/3356): `--no-timeouts` and `--timeout 0` now does what you'd expect ([**@boneskull**](https://github.com/boneskull))
- [#3475](https://github.com/mochajs/mocha/issues/3475): Restore `--no-exit` option ([**@boneskull**](https://github.com/boneskull))
- [#3570](https://github.com/mochajs/mocha/issues/3570): Long-running tests now respect `SIGINT` ([**@boneskull**](https://github.com/boneskull))
- [#2944](https://github.com/mochajs/mocha/issues/2944): `--forbid-only` and `--forbid-pending` now "fail fast" when encountered on a suite ([**@outsideris**](https://github.com/outsideris))
- [#1652](https://github.com/mochajs/mocha/issues/1652), [#2951](https://github.com/mochajs/mocha/issues/2951): Fix broken clamping of timeout values ([**@plroebuck**](https://github.com/plroebuck))
- [#2095](https://github.com/mochajs/mocha/issues/2095), [#3521](https://github.com/mochajs/mocha/issues/3521): Do not log `stdout:` prefix in browser console ([**@Bamieh**](https://github.com/Bamieh))
- [#3595](https://github.com/mochajs/mocha/issues/3595): Fix mochajs.org deployment problems ([**@papandreou**](https://github.com/papandreou))
- [#3518](https://github.com/mochajs/mocha/issues/3518): Improve `utils.isPromise()` ([**@fabiosantoscode**](https://github.com/fabiosantoscode))
- [#3320](https://github.com/mochajs/mocha/issues/3320): Fail gracefully when non-extensible objects are thrown in async tests ([**@fargies**](https://github.com/fargies))
- [#2475](https://github.com/mochajs/mocha/issues/2475): XUnit does not duplicate test result numbers in "errors" and "failures"; "failures" will **always** be zero ([**@mlucool**](https://github.com/mlucool))
- [#3398](https://github.com/mochajs/mocha/issues/3398), [#3598](https://github.com/mochajs/mocha/issues/3598), [#3457](https://github.com/mochajs/mocha/issues/3457), [#3617](https://github.com/mochajs/mocha/issues/3617): Fix regression wherein `--bail` would not execute "after" nor "after each" hooks ([**@juergba**](https://github.com/juergba))
- [#3580](https://github.com/mochajs/mocha/issues/3580): Fix potential exception when using XUnit reporter programmatically ([**@Lana-Light**](https://github.com/Lana-Light))
- [#1304](https://github.com/mochajs/mocha/issues/1304): Do not output color to `TERM=dumb` ([**@plroebuck**](https://github.com/plroebuck))

## :book: Documentation

- [#3525](https://github.com/mochajs/mocha/issues/3525): Improvements to `.github/CONTRIBUTING.md` ([**@markowsiak**](https://github.com/markowsiak))
- [#3466](https://github.com/mochajs/mocha/issues/3466): Update description of `slow` option ([**@finfin**](https://github.com/finfin))
- [#3405](https://github.com/mochajs/mocha/issues/3405): Remove references to bower installations ([**@goteamtim**](https://github.com/goteamtim))
- [#3361](https://github.com/mochajs/mocha/issues/3361): Improvements to `--watch` docs ([**@benglass**](https://github.com/benglass))
- [#3136](https://github.com/mochajs/mocha/issues/3136): Improve docs around globbing and shell expansion ([**@akrawchyk**](https://github.com/akrawchyk))
- [#2819](https://github.com/mochajs/mocha/issues/2819): Update docs around skips and hooks ([**@bannmoore**](https://github.com/bannmoore))
- Many improvements by [**@outsideris**](https://github.com/outsideris)

## :nut_and_bolt: Other

- [#3557](https://github.com/mochajs/mocha/issues/3557): Use `ms` userland module instead of hand-rolled solution ([**@gizemkeser**](https://github.com/gizemkeser))
- Many CI fixes and other refactors by [**@plroebuck**](https://github.com/plroebuck)
- Test refactors by [**@outsideris**](https://github.com/outsideris)

# 5.2.0 / 2018-05-18

## :tada: Enhancements

- [#3375](https://github.com/mochajs/mocha/pull/3375): Add support for comments in `mocha.opts` ([@plroebuck](https://github.com/plroebuck))

## :bug: Fixes

- [#3346](https://github.com/mochajs/mocha/pull/3346): Exit correctly from `before` hooks when using `--bail` ([@outsideris](https://github.com/outsideris))

## :book: Documentation

- [#3328](https://github.com/mochajs/mocha/pull/3328): Mocha-flavored [API docs](https://mochajs.org/api/)! ([@Munter](https://github.com/munter))

## :nut_and_bolt: Other

- [#3330](https://github.com/mochajs/mocha/pull/3330): Use `Buffer.from()` ([@harrysarson](https://github.com/harrysarson))
- [#3295](https://github.com/mochajs/mocha/pull/3295): Remove redundant folder ([@DavNej](https://github.com/DajNev))
- [#3356](https://github.com/mochajs/mocha/pull/3356): Refactoring ([@plroebuck](https://github.com/plroebuck))

# 5.1.1 / 2018-04-18

## :bug: Fixes

- [#3325](https://github.com/mochajs/mocha/issues/3325): Revert change which broke `--watch` ([@boneskull](https://github.com/boneskull))

# 5.1.0 / 2018-04-12

## :tada: Enhancements

- [#3210](https://github.com/mochajs/mocha/pull/3210): Add `--exclude` option ([@metalex9](https://github.com/metalex9))

## :bug: Fixes

- [#3318](https://github.com/mochajs/mocha/pull/3318): Fix failures in circular objects in JSON reporter ([@jeversmann](https://github.com/jeversmann), [@boneskull](https://github.com/boneskull))

## :book: Documentation

- [#3323](https://github.com/mochajs/mocha/pull/3323): Publish actual [API documentation](https://mochajs.org/api/)! ([@dfberry](https://github.com/dfberry), [@Munter](https://github.com/munter))
- [#3299](https://github.com/mochajs/mocha/pull/3299): Improve docs around exclusive tests ([@nicgirault](https://github.com/nicgirault))

## :nut_and_bolt: Other

- [#3302](https://github.com/mochajs/mocha/pull/3302), [#3308](https://github.com/mochajs/mocha/pull/3308), [#3310](https://github.com/mochajs/mocha/pull/3310), [#3315](https://github.com/mochajs/mocha/pull/3315), [#3316](https://github.com/mochajs/mocha/pull/3316): Build matrix improvements ([more info](https://boneskull.com/mocha-and-travis-ci-build-stages/)) ([@outsideris](https://github.com/outsideris), [@boneskull](https://github.com/boneskull))
- [#3272](https://github.com/mochajs/mocha/pull/3272): Refactor reporter tests ([@jMuzsik](https://github.com/jMuzsik))

# 5.0.5 / 2018-03-22

Welcome [@outsideris](https://github.com/outsideris) to the team!

## :bug: Fixes

- [#3096](https://github.com/mochajs/mocha/issues/3096): Fix `--bail` failing to bail within hooks ([@outsideris](https://github.com/outsideris))
- [#3184](https://github.com/mochajs/mocha/issues/3184): Don't skip too many suites (using `describe.skip()`) ([@outsideris](https://github.com/outsideris))

## :book: Documentation

- [#3133](https://github.com/mochajs/mocha/issues/3133): Improve docs regarding "pending" behavior ([@ematicipo](https://github.com/ematicipo))
- [#3276](https://github.com/mochajs/mocha/pull/3276), [#3274](https://github.com/mochajs/mocha/pull/3274): Fix broken stuff in `CHANGELOG.md` ([@tagoro9](https://github.com/tagoro9), [@honzajavorek](https://github.com/honzajavorek))

## :nut_and_bolt: Other

- [#3208](https://github.com/mochajs/mocha/issues/3208): Improve test coverage for AMD users ([@outsideris](https://github.com/outsideris))
- [#3267](https://github.com/mochajs/mocha/pull/3267): Remove vestiges of PhantomJS from CI ([@anishkny](https://github.com/anishkny))
- [#2952](https://github.com/mochajs/mocha/issues/2952): Fix a debug message ([@boneskull](https://github.com/boneskull))

# 5.0.4 / 2018-03-07

## :bug: Fixes

- [#3265](https://github.com/mochajs/mocha/issues/3265): Fixes regression in "watch" functionality introduced in v5.0.2 ([@outsideris](https://github.com/outsideris))

# 5.0.3 / 2018-03-06

This patch features a fix to address a potential "low severity" [ReDoS vulnerability](https://snyk.io/vuln/npm:diff:20180305) in the [diff](https://npm.im/diff) package (a dependency of Mocha).

## :lock: Security Fixes

- [#3266](https://github.com/mochajs/mocha/pull/3266): Bump `diff` to v3.5.0 ([@anishkny](https://github.com/anishkny))

## :nut_and_bolt: Other

- [#3011](https://github.com/mochajs/mocha/issues/3011): Expose `generateDiff()` in `Base` reporter ([@harrysarson](https://github.com/harrysarson))

# 5.0.2 / 2018-03-05

This release fixes a class of tests which report as _false positives_. **Certain tests will now break**, though they would have previously been reported as passing. Details below. Sorry for the inconvenience!

## :bug: Fixes

- [#3226](https://github.com/mochajs/mocha/issues/3226): Do not swallow errors that are thrown asynchronously from passing tests ([@boneskull](https://github.com/boneskull)). Example:

  \```js
  it('should actually fail, sorry!', function (done) {
  // passing assertion
  assert(true === true);

  // test complete & is marked as passing
  done();

  // ...but something evil lurks within
  setTimeout(() => {
  throw new Error('chaos!');
  }, 100);
  });
  \```

  Previously to this version, Mocha would have _silently swallowed_ the `chaos!` exception, and you wouldn't know. Well, _now you know_. Mocha cannot recover from this gracefully, so it will exit with a nonzero code.

  **Maintainers of external reporters**: _If_ a test of this class is encountered, the `Runner` instance will emit the `end` event _twice_; you _may_ need to change your reporter to use `runner.once('end')` intead of `runner.on('end')`.

- [#3093](https://github.com/mochajs/mocha/issues/3093): Fix stack trace reformatting problem ([@outsideris](https://github.com/outsideris))

## :nut_and_bolt: Other

- [#3248](https://github.com/mochajs/mocha/issues/3248): Update `browser-stdout` to v1.3.1 ([@honzajavorek](https://github.com/honzajavorek))

# 5.0.1 / 2018-02-07

...your garden-variety patch release.

Special thanks to [Wallaby.js](https://wallabyjs.com) for their continued support! :heart:

## :bug: Fixes

- [#1838](https://github.com/mochajs/mocha/issues/1838): `--delay` now works with `.only()` ([@silviom](https://github.com/silviom))
- [#3119](https://github.com/mochajs/mocha/issues/3119): Plug memory leak present in v8 ([@boneskull](https://github.com/boneskull))

## :book: Documentation

- [#3132](https://github.com/mochajs/mocha/issues/3132), [#3098](https://github.com/mochajs/mocha/issues/3098): Update `--glob` docs ([@outsideris](https://github.com/outsideris))
- [#3212](https://github.com/mochajs/mocha/pull/3212): Update [Wallaby.js](https://wallabyjs.com)-related docs ([@ArtemGovorov](https://github.com/ArtemGovorov))
- [#3205](https://github.com/mochajs/mocha/pull/3205): Remove outdated cruft ([@boneskull](https://github.com/boneskull))

## :nut_and_bolt: Other

- [#3224](https://github.com/mochajs/mocha/pull/3224): Add proper Wallaby.js config ([@ArtemGovorov](https://github.com/ArtemGovorov))
- [#3230](https://github.com/mochajs/mocha/pull/3230): Update copyright year ([@josephlin55555](https://github.com/josephlin55555))

# 5.0.0 / 2018-01-17

Mocha starts off 2018 right by again dropping support for _unmaintained rubbish_.

Welcome [@vkarpov15](https://github.com/vkarpov15) to the team!

## :boom: Breaking Changes

- **[#3148](https://github.com/mochajs/mocha/issues/3148): Drop support for IE9 and IE10** ([@Bamieh](https://github.com/Bamieh))
  Practically speaking, only code which consumes (through bundling or otherwise) the userland [buffer](https://npm.im/buffer) module should be affected. However, Mocha will no longer test against these browsers, nor apply fixes for them.

## :tada: Enhancements

- [#3181](https://github.com/mochajs/mocha/issues/3181): Add useful new `--file` command line argument ([documentation](https://mochajs.org/#--file-file)) ([@hswolff](https://github.com/hswolff))

## :bug: Fixes

- [#3187](https://github.com/mochajs/mocha/issues/3187): Fix inaccurate test duration reporting ([@FND](https://github.com/FND))
- [#3202](https://github.com/mochajs/mocha/pull/3202): Fix bad markup in HTML reporter ([@DanielRuf](https://github.com/DanielRuf))

## :sunglasses: Developer Experience

- [#2352](https://github.com/mochajs/mocha/issues/2352): Ditch GNU Make for [nps](https://npm.im/nps) to manage scripts ([@TedYav](https://github.com/TedYav))

## :book: Documentation

- [#3137](https://github.com/mochajs/mocha/issues/3137): Add missing `--no-timeouts` docs ([@dfberry](https://github.com/dfberry))
- [#3134](https://github.com/mochajs/mocha/issues/3134): Improve `done()` callback docs ([@maraisr](https://github.com/maraisr))
- [#3135](https://github.com/mochajs/mocha/issues/3135): Fix cross-references ([@vkarpov15](https://github.com/vkarpov15))
- [#3163](https://github.com/mochajs/mocha/pull/3163): Fix tpyos ([@tbroadley](https://github.com/tbroadley))
- [#3177](https://github.com/mochajs/mocha/pull/3177): Tweak `README.md` organization ([@xxczaki](https://github.com/xxczaki))
- Misc updates ([@boneskull](https://github.com/boneskull))

## :nut_and_bolt: Other

- [#3118](https://github.com/mochajs/mocha/issues/3118): Move TextMate Integration to [its own repo](https://github.com/mochajs/mocha.tmbundle) ([@Bamieh](https://github.com/Bamieh))
- [#3185](https://github.com/mochajs/mocha/issues/3185): Add Node.js v9 to build matrix; remove v7 ([@xxczaki](https://github.com/xxczaki))
- [#3172](https://github.com/mochajs/mocha/issues/3172): Markdown linting ([@boneskull](https://github.com/boneskull))
- Test & Netlify updates ([@Munter](https://github.com/munter), [@boneskull](https://github.com/boneskull))

# 4.1.0 / 2017-12-28

This is mainly a "housekeeping" release.

Welcome [@Bamieh](https://github.com/Bamieh) and [@xxczaki](https://github.com/xxczaki) to the team!

## :bug: Fixes

- [#2661](https://github.com/mochajs/mocha/issues/2661): `progress` reporter now accepts reporter options ([@canoztokmak](https://github.com/canoztokmak))
- [#3142](https://github.com/mochajs/mocha/issues/3142): `xit` in `bdd` interface now properly returns its `Test` object ([@Bamieh](https://github.com/Bamieh))
- [#3075](https://github.com/mochajs/mocha/pull/3075): Diffs now computed eagerly to avoid misinformation when reported ([@abrady0](https://github.com/abrady0))
- [#2745](https://github.com/mochajs/mocha/issues/2745): `--help` will now help you even if you have a `mocha.opts` ([@Zarel](https://github.com/Zarel))

## :tada: Enhancements

- [#2514](https://github.com/mochajs/mocha/issues/2514): The `--no-diff` flag will completely disable diff output ([@CapacitorSet](https://github.com/CapacitorSet))
- [#3058](https://github.com/mochajs/mocha/issues/3058): All "setters" in Mocha's API are now also "getters" if called without arguments ([@makepanic](https://github.com/makepanic))

## :book: Documentation

- [#3170](https://github.com/mochajs/mocha/pull/3170): Optimization and site speed improvements ([@Munter](https://github.com/munter))
- [#2987](https://github.com/mochajs/mocha/issues/2987): Moved the old [site repo](https://github.com/mochajs/mochajs.github.io) into the main repo under `docs/` ([@boneskull](https://github.com/boneskull))
- [#2896](https://github.com/mochajs/mocha/issues/2896): Add [maintainer guide](https://github.com/mochajs/mocha/blob/master/MAINTAINERS.md) ([@boneskull](https://github.com/boneskull))
- Various fixes and updates ([@xxczaki](https://github.com/xxczaki), [@maty21](https://github.com/maty21), [@leedm777](https://github.com/leedm777))

## :nut_and_bolt: Other

- Test improvements and fixes ([@eugenet8k](https://github.com/eugenet8k), [@ngeor](https://github.com/ngeor), [@38elements](https://github.com/38elements), [@Gerhut](https://github.com/Gerhut), [@ScottFreeCode](https://github.com/ScottFreeCode), [@boneskull](https://github.com/boneskull))
- Refactoring and cruft excision ([@38elements](https://github.com/38elements), [@Bamieh](https://github.com/Bamieh), [@finnigantime](https://github.com/finnigantime), [@boneskull](https://github.com/boneskull))

# 4.0.1 / 2017-10-05

## :bug: Fixes

- [#3051](https://github.com/mochajs/mocha/pull/3051): Upgrade Growl to v1.10.3 to fix its [peer dep problems](https://github.com/tj/node-growl/pull/68) ([@dpogue](https://github.com/dpogue))

# 4.0.0 / 2017-10-02

You might want to read this before filing a new bug! :stuck_out_tongue_closed_eyes:

## :boom: Breaking Changes

For more info, please [read this article](https://boneskull.com/mocha-v4-nears-release/).

### Compatibility

- [#3016](https://github.com/mochajs/mocha/issues/3016): Drop support for unmaintained versions of Node.js ([@boneskull](https://github.com/boneskull)):
  - 0.10.x
  - 0.11.x
  - 0.12.x
  - iojs (any)
  - 5.x.x
- [#2979](https://github.com/mochajs/mocha/issues/2979): Drop support for non-ES5-compliant browsers ([@boneskull](https://github.com/boneskull)):
  - IE7
  - IE8
  - PhantomJS 1.x
- [#2615](https://github.com/mochajs/mocha/issues/2615): Drop Bower support; old versions (3.x, etc.) will remain available ([@ScottFreeCode](https://github.com/ScottFreeCode), [@boneskull](https://github.com/boneskull))

### Default Behavior

- [#2879](https://github.com/mochajs/mocha/issues/2879): By default, Mocha will no longer force the process to exit once all tests complete. This means any test code (or code under test) which would normally prevent `node` from exiting will do so when run in Mocha. Supply the `--exit` flag to revert to pre-v4.0.0 behavior ([@ScottFreeCode](https://github.com/ScottFreeCode), [@boneskull](https://github.com/boneskull))

### Reporter Output

- [#2095](https://github.com/mochajs/mocha/issues/2095): Remove `stdout:` prefix from browser reporter logs ([@skeggse](https://github.com/skeggse))
- [#2295](https://github.com/mochajs/mocha/issues/2295): Add separator in "unified diff" output ([@olsonpm](https://github.com/olsonpm))
- [#2686](https://github.com/mochajs/mocha/issues/2686): Print failure message when `--forbid-pending` or `--forbid-only` is specified ([@ScottFreeCode](https://github.com/ScottFreeCode))
- [#2814](https://github.com/mochajs/mocha/pull/2814): Indent contexts for better readability when reporting failures ([@charlierudolph](https://github.com/charlierudolph))

## :-1: Deprecations

- [#2493](https://github.com/mochajs/mocha/issues/2493): The `--compilers` command-line option is now soft-deprecated and will emit a warning on `STDERR`. Read [this](https://github.com/mochajs/mocha/wiki/compilers-deprecation) for more info and workarounds ([@ScottFreeCode](https://github.com/ScottFreeCode), [@boneskull](https://github.com/boneskull))

## :tada: Enhancements

- [#2628](https://github.com/mochajs/mocha/issues/2628): Allow override of default test suite name in XUnit reporter ([@ngeor](https://github.com/ngeor))

## :book: Documentation

- [#3020](https://github.com/mochajs/mocha/pull/3020): Link to CLA in `README.md` and `CONTRIBUTING.md` ([@skeggse](https://github.com/skeggse))

## :nut_and_bolt: Other

- [#2890](https://github.com/mochajs/mocha/issues/2890): Speed up build by (re-)consolidating SauceLabs tests ([@boneskull](https://github.com/boneskull))

# 3.5.3 / 2017-09-11

## :bug: Fixes

- [#3003](https://github.com/mochajs/mocha/pull/3003): Fix invalid entities in xUnit reporter first appearing in v3.5.1 ([@jkrems](https://github.com/jkrems))

# 3.5.2 / 2017-09-10

## :bug: Fixes

- [#3001](https://github.com/mochajs/mocha/pull/3001): Fix AMD-related failures first appearing in v3.5.1 ([@boneskull](https://github.com/boneskull))

# 3.5.1 / 2017-09-09

## :newspaper: News

- :mega: Mocha is now sponsoring [PDXNode](http://pdxnode.org)! If you're in the [Portland](https://wikipedia.org/wiki/Portland,_Oregon) area, come check out the monthly talks and hack nights!

## :bug: Fixes

- [#2997](https://github.com/mochajs/mocha/pull/2997): Fix missing `xit` export for "require" interface ([@solodynamo](https://github.com/solodynamo))
- [#2957](https://github.com/mochajs/mocha/pull/2957): Fix unicode character handling in XUnit reporter failures ([@jkrems](https://github.com/jkrems))

## :nut_and_bolt: Other

- [#2986](https://github.com/mochajs/mocha/pull/2986): Add issue and PR templates ([@kungapal](https://github.com/kungapal))
- [#2918](https://github.com/mochajs/mocha/pull/2918): Drop bash dependency for glob-related tests ([@ScottFreeCode](https://github.com/ScottFreeCode))
- [#2922](https://github.com/mochajs/mocha/pull/2922): Improve `--compilers` coverage ([@ScottFreeCode](https://github.com/ScottFreeCode))
- [#2981](https://github.com/mochajs/mocha/pull/2981): Fix tpyos and spelling errors ([@jsoref](https://github.com/jsoref))

# 3.5.0 / 2017-07-31

## :newspaper: News

- Mocha now has a [code of conduct](https://github.com/mochajs/mocha/blob/master/.github/CODE_OF_CONDUCT.md) (thanks [@kungapal](https://github.com/kungapal)!).
- Old issues and PRs are now being marked "stale" by [Probot's "Stale" plugin](https://github.com/probot/stale). If an issue is marked as such, and you would like to see it remain open, simply add a new comment to the ticket or PR.
- **WARNING**: Support for non-ES5-compliant environments will be dropped starting with version 4.0.0 of Mocha!

## :lock: Security Fixes

- [#2860](https://github.com/mochajs/mocha/pull/2860): Address [CVE-2015-8315](https://nodesecurity.io/advisories/46) via upgrade of [debug](https://npm.im/debug) ([@boneskull](https://github.com/boneskull))

## :tada: Enhancements

- [#2696](https://github.com/mochajs/mocha/pull/2696): Add `--forbid-only` and `--forbid-pending` flags. Use these in CI or hooks to ensure tests aren't accidentally being skipped! ([@charlierudolph](https://github.com/charlierudolph))
- [#2813](https://github.com/mochajs/mocha/pull/2813): Support Node.js 8's `--napi-modules` flag ([@jupp0r](https://github.com/jupp0r))

## :nut_and_bolt: Other

- Various CI-and-test-related fixes and improvements ([@boneskull](https://github.com/boneskull), [@dasilvacontin](https://github.com/dasilvacontin), [@PopradiArpad](https://github.com/PopradiArpad), [@Munter](https://github.com/munter), [@ScottFreeCode](https://github.com/ScottFreeCode))
- "Officially" support Node.js 8 ([@elergy](https://github.com/elergy))

# 3.4.2 / 2017-05-24

## :bug: Fixes

- [#2802](https://github.com/mochajs/mocha/issues/2802): Remove call to deprecated `os.tmpDir` ([@makepanic](https://github.com/makepanic))
- [#2820](https://github.com/mochajs/mocha/pull/2820): Eagerly set `process.exitCode` ([@chrisleck](https://github.com/chrisleck))

## :nut_and_bolt: Other

- [#2807](https://github.com/mochajs/mocha/pull/2807): Move linting into an npm script ([@Munter](https://github.com/munter))

# 3.4.1 / 2017-05-14

Fixed a publishing mishap with git's autocrlf settings.

# 3.4.0 / 2017-05-14

Mocha is now moving to a quicker release schedule: when non-breaking changes are merged, a release should happen that week.

This week's highlights:

- `allowUncaught` added to commandline as `--allow-uncaught` (and bugfixed)
- warning-related Node flags

## :tada: Enhancements

- [#2793](https://github.com/mochajs/mocha/pull/2793), [#2697](https://github.com/mochajs/mocha/pull/2697): add --allowUncaught to Node.js ([@lrowe](https://github.com/lrowe))
- [#2733](https://github.com/mochajs/mocha/pull/2733): Add `--no-warnings` and `--trace-warnings` flags ([@sonicdoe](https://github.com/sonicdoe))

## :bug: Fixes

- [#2793](https://github.com/mochajs/mocha/pull/2793), [#2697](https://github.com/mochajs/mocha/pull/2697): fix broken allowUncaught ([@lrowe](https://github.com/lrowe))

## :nut_and_bolt: Other

- [#2778](https://github.com/mochajs/mocha/pull/2778): Add license report and scan status ([@xizhao](https://github.com/xizhao))
- [#2794](https://github.com/mochajs/mocha/pull/2794): no special case for macOS running Karma locally ([@boneskull](https://github.com/boneskull))
- [#2795](https://github.com/mochajs/mocha/pull/2795): reverts use of semistandard directly ([#2648](https://github.com/mochajs/mocha/pull/2648)) ([@boneskull](https://github.com/boneskull))

# 3.3.0 / 2017-04-24

Thanks to all our contributors, maintainers, sponsors, and users! ❤️

As highlights:

- We've got coverage now!
- Testing is looking less flaky \\o/.
- No more nitpicking about "mocha.js" build on PRs.

## :tada: Enhancements

- [#2659](https://github.com/mochajs/mocha/pull/2659): Adds support for loading reporter from an absolute or relative path ([@sul4bh](https://github.com/sul4bh))
- [#2769](https://github.com/mochajs/mocha/pull/2769): Support `--inspect-brk` on command-line ([@igwejk](https://github.com/igwejk))

## :bug: Fixes

- [#2662](https://github.com/mochajs/mocha/pull/2662): Replace unicode chars w/ hex codes in HTML reporter ([@rotemdan](https://github.com/rotemdan))

## :mag: Coverage

- [#2672](https://github.com/mochajs/mocha/pull/2672): Add coverage for node tests ([@c089](https://github.com/c089), [@Munter](https://github.com/munter))
- [#2680](https://github.com/mochajs/mocha/pull/2680): Increase tests coverage for base reporter ([@epallerols](https://github.com/epallerols))
- [#2690](https://github.com/mochajs/mocha/pull/2690): Increase tests coverage for doc reporter ([@craigtaub](https://github.com/craigtaub))
- [#2701](https://github.com/mochajs/mocha/pull/2701): Increase tests coverage for landing, min, tap and list reporters ([@craigtaub](https://github.com/craigtaub))
- [#2691](https://github.com/mochajs/mocha/pull/2691): Increase tests coverage for spec + dot reporters ([@craigtaub](https://github.com/craigtaub))
- [#2698](https://github.com/mochajs/mocha/pull/2698): Increase tests coverage for xunit reporter ([@craigtaub](https://github.com/craigtaub))
- [#2699](https://github.com/mochajs/mocha/pull/2699): Increase tests coverage for json-stream, markdown and progress reporters ([@craigtaub](https://github.com/craigtaub))
- [#2703](https://github.com/mochajs/mocha/pull/2703): Cover .some() function in utils.js with tests ([@seppevs](https://github.com/seppevs))
- [#2773](https://github.com/mochajs/mocha/pull/2773): Add tests for loading reporters w/ relative/absolute paths ([@sul4bh](https://github.com/sul4bh))

## :nut_and_bolt: Other

- Remove bin/.eslintrc; ensure execs are linted ([@boneskull](https://github.com/boneskull))
- [#2542](https://github.com/mochajs/mocha/issues/2542): Expand CONTRIBUTING.md ([@boneskull](https://github.com/boneskull))
- [#2660](https://github.com/mochajs/mocha/pull/2660): Double timeouts on integration tests ([@Munter](https://github.com/munter))
- [#2653](https://github.com/mochajs/mocha/pull/2653): Update copyright year ([@Scottkao85], [@Munter](https://github.com/munter))
- [#2621](https://github.com/mochajs/mocha/pull/2621): Update dependencies to enable Greenkeeper ([@boneskull](https://github.com/boneskull), [@greenkeeper](https://github.com/greenkeeper))
- [#2625](https://github.com/mochajs/mocha/pull/2625): Use trusty container in travis-ci; use "artifacts" addon ([@boneskull](https://github.com/boneskull))
- [#2670](https://github.com/mochajs/mocha/pull/2670): doc(CONTRIBUTING): fix link to org members ([@coderbyheart](https://github.com/coderbyheart))
- Add Mocha propaganda to README.md ([@boneskull](https://github.com/boneskull))
- [#2470](https://github.com/mochajs/mocha/pull/2470): Avoid test flake in "delay" test ([@boneskull](https://github.com/boneskull))
- [#2675](https://github.com/mochajs/mocha/pull/2675): Limit browser concurrency on sauce ([@boneskull](https://github.com/boneskull))
- [#2669](https://github.com/mochajs/mocha/pull/2669): Use temporary test-only build of mocha.js for browsers tests ([@Munter](https://github.com/munter))
- Fix "projects" link in README.md ([@boneskull](https://github.com/boneskull))
- [#2678](https://github.com/mochajs/mocha/pull/2678): Chore(Saucelabs): test on IE9, IE10 and IE11 ([@coderbyheart](https://github.com/coderbyheart))
- [#2648](https://github.com/mochajs/mocha/pull/2648): Use `semistandard` directly ([@kt3k](https://github.com/kt3k))
- [#2727](https://github.com/mochajs/mocha/pull/2727): Make the build reproducible ([@lamby](https://github.com/lamby))

# 3.2.0 / 2016-11-24

## :newspaper: News

### Mocha is now a JS Foundation Project!

Mocha is proud to have joined the [JS Foundation](https://js.foundation). For more information, [read the announcement](https://js.foundation/announcements/2016/10/17/Linux-Foundation-Unites-JavaScript-Community-Open-Web-Development/).

### Contributor License Agreement

Under the foundation, all contributors to Mocha must sign the [JS Foundation CLA](https://js.foundation/CLA/) before their code can be merged. When sending a PR--if you have not already signed the CLA--a friendly bot will ask you to do so.

Mocha remains licensed under the [MIT license](https://github.com/mochajs/mocha/blob/master/LICENSE).

## :bug: Bug Fix

- [#2535](https://github.com/mochajs/mocha/issues/2535): Fix crash when `--watch` encounters broken symlinks ([@villesau](https://github.com/villesau))
- [#2593](https://github.com/mochajs/mocha/pull/2593): Fix (old) regression; incorrect symbol shown in `list` reporter ([@Aldaviva](https://github.com/Aldaviva))
- [#2584](https://github.com/mochajs/mocha/issues/2584): Fix potential error when running XUnit reporter ([@vobujs](https://github.com/vobujs))

## :tada: Enhancement

- [#2294](https://github.com/mochajs/mocha/issues/2294): Improve timeout error messaging ([@jeversmann](https://github.com/jeversmann), [@boneskull](https://github.com/boneskull))
- [#2520](https://github.com/mochajs/mocha/pull/2520): Add info about `--inspect` flag to CLI help ([@ughitsaaron](https://github.com/ughitsaaron))

## :nut_and_bolt: Other

- [#2570](https://github.com/mochajs/mocha/issues/2570): Use [karma-mocha](https://npmjs.com/package/karma-mocha) proper ([@boneskull](https://github.com/boneskull))
- Licenses updated to reflect new copyright, add link to license and browser matrix to `README.md` ([@boneskull](https://github.com/boneskull), [@ScottFreeCode](https://github.com/ScottFreeCode), [@dasilvacontin](https://github.com/dasilvacontin))

Thanks to all our contributors, sponsors and backers! Keep on the lookout for a public roadmap and new contribution guide coming soon.

# 3.1.2 / 2016-10-10

## :bug: Bug Fix

- [#2528](https://github.com/mochajs/mocha/issues/2528): Recovery gracefully if an `Error`'s `stack` property isn't writable ([@boneskull](https://github.com/boneskull))

# 3.1.1 / 2016-10-09

## :bug: Bug Fix

- [#1417](https://github.com/mochajs/mocha/issues/1417): Don't report `done()` was called multiple times when it wasn't ([@frankleonrose](https://github.com/frankleonrose))

## :nut_and_bolt: Other

- [#2490](https://github.com/mochajs/mocha/issues/2490): Lint with [semistandard](https://npmjs.com/package/semistandard) config ([@makepanic](https://github.com/makepanic))
- [#2525](https://github.com/mochajs/mocha/issues/2525): Lint all `.js` files ([@boneskull](https://github.com/boneskull))
- [#2524](https://github.com/mochajs/mocha/issues/2524): Provide workaround for developers unable to run browser tests on macOS Sierra ([@boneskull](https://github.com/boneskull))

# 3.1.0 / 2016-09-27

## :tada: Enhancement

- [#2357](https://github.com/mochajs/mocha/issues/2357): Support `--inspect` on command-line ([@simov](https://github.com/simov))
- [#2194](https://github.com/mochajs/mocha/issues/2194): Human-friendly error if no files are matched on command-line ([@Munter](https://github.com/munter))
- [#1744](https://github.com/mochajs/mocha/issues/1744): Human-friendly error if a Suite has no callback (BDD/TDD only) ([@anton](https://github.com/anton))

## :bug: Bug Fix

- [#2488](https://github.com/mochajs/mocha/issues/2488): Fix case in which _variables beginning with lowercase "D"_ may not have been reported properly as global leaks ([@JustATrick](https://github.com/JustATrick)) :laughing:
- [#2465](https://github.com/mochajs/mocha/issues/2465): Always halt execution in async function when `this.skip()` is called ([@boneskull](https://github.com/boneskull))
- [#2445](https://github.com/mochajs/mocha/pull/2445): Exits with expected code 130 when `SIGINT` encountered; exit code can no longer rollover at 256 ([@Munter](https://github.com/munter))
- [#2315](https://github.com/mochajs/mocha/issues/2315): Fix uncaught TypeError thrown from callback stack ([@1999](https://github.com/1999))
- Fix broken `only()`/`skip()` in IE7/IE8 ([@boneskull](https://github.com/boneskull))
- [#2502](https://github.com/mochajs/mocha/issues/2502): Fix broken stack trace filter on Node.js under Windows ([@boneskull](https://github.com/boneskull))
- [#2496](https://github.com/mochajs/mocha/issues/2496): Fix diff output for objects instantiated with `String` constructor ([more](https://youtrack.jetbrains.com/issue/WEB-23383)) ([@boneskull](https://github.com/boneskull))

# 3.0.2 / 2016-08-08

## :bug: Bug Fix

- [#2424](https://github.com/mochajs/mocha/issues/2424): Fix error loading Mocha via Require.js ([@boneskull](https://github.com/boneskull))
- [#2417](https://github.com/mochajs/mocha/issues/2417): Fix execution of _deeply_ nested `describe.only()` suites ([@not-an-aardvark](https://github.com/not-an-aardvark))
- Remove references to `json-cov` and `html-cov` reporters in CLI ([@boneskull](https://github.com/boneskull))

# 3.0.1 / 2016-08-03

## :bug: Bug Fix

- [#2406](https://github.com/mochajs/mocha/issues/2406): Restore execution of nested `describe.only()` suites ([@not-an-aardvark](https://github.com/not-an-aardvark))

# 3.0.0 / 2016-07-31

## :boom: Breaking Changes

- :warning: Due to the increasing difficulty of applying security patches made within its dependency tree, as well as looming incompatibilities with Node.js v7.0, **Mocha no longer supports Node.js v0.8**.

- :warning: **Mocha may no longer be installed by versions of `npm` less than `1.4.0`.** Previously, this requirement only affected Mocha's development dependencies. In short, this allows Mocha to depend on packages which have dependencies fixed to major versions (`^`).

- `.only()` is no longer "fuzzy", can be used multiple times, and generally just works like you think it should. :joy:

- To avoid common bugs, when a test injects a callback function (suggesting asynchronous execution), calls it, _and_ returns a `Promise`, Mocha will now throw an exception:

  \```js
  const assert = require('assert');

  it('should complete this test', function (done) {
  return new Promise(function (resolve) {
  assert.ok(true);
  resolve();
  })
  .then(done);
  });
  \```

  The above test will fail with `Error: Resolution method is overspecified. Specify a callback *or* return a Promise; not both.`.

- When a test timeout value _greater than_ `2147483648` is specified in any context (`--timeout`, `mocha.setup()`, per-suite, per-test, etc.), the timeout will be _disabled_ and the test(s) will be allowed to run indefinitely. This is equivalent to specifying a timeout value of `0`. See [MDN](https://developer.mozilla.org/docs/Web/API/WindowTimers/setTimeout#Maximum_delay_value) for reasoning.

- The `dot` reporter now uses more visually distinctive characters when indicating "pending" and "failed" tests.

- Mocha no longer supports [component](https://www.npmjs.com/package/component).

- The long-forsaken `HTMLCov` and `JSONCov` reporters--and any relationship to the "node-jscoverage" project--have been removed.

- `spec` reporter now omits leading carriage returns (`\r`) in non-TTY environment.

## :tada: Enhancements

- [#808](https://github.com/mochajs/mocha/issues/808): Allow regular-expression-like strings in `--grep` and browser's `grep` querystring; enables flags such as `i` for case-insensitive matches and `u` for unicode. ([@a8m](https://github.com/a8m))
- [#2000](https://github.com/mochajs/mocha/pull/2000): Use distinctive characters in `dot` reporter; `,` will denote a "pending" test and `!` will denote a "failing" test. ([@elliottcable](https://github.com/elliottcable))
- [#1632](https://github.com/mochajs/mocha/issues/1632): Throw a useful exception when a suite or test lacks a title. ([@a8m](https://github.com/a8m))
- [#1481](https://github.com/mochajs/mocha/issues/1481): Better `.only()` behavior. ([@a8m](https://github.com/a8m))
- [#2334](https://github.com/mochajs/mocha/issues/2334): Allow `this.skip()` in async tests and hooks. ([@boneskull](https://github.com/boneskull))
- [#1320](https://github.com/mochajs/mocha/pull/1320): Throw a useful exception when test resolution method is overspecified. ([@jugglinmike](https://github.com/jugglinmike))
- [#2364](https://github.com/mochajs/mocha/pull/2364): Support `--preserve-symlinks`. ([@rosswarren](https://github.com/rosswarren))

## :bug: Bug Fixes

- [#2259](https://github.com/mochajs/mocha/pull/2259): Restore ES3 compatibility. Specifically, support an environment lacking `Date.prototype.toISOString()`, `JSON`, or has a non-standard implementation of `JSON`. ([@ndhoule](https://github.com/ndhoule), [@boneskull](https://github.com/boneskull))
- [#2286](https://github.com/mochajs/mocha/issues/2286): Fix `after()` failing to execute if test skipped using `this.skip()` in `beforeEach()`; no longer marks the entire suite as "pending". ([@dasilvacontin](https://github.com/dasilvacontin), [@boneskull](https://github.com/boneskull))
- [#2208](https://github.com/mochajs/mocha/pull/2208): Fix function name display in `markdown` and `html` (browser) reporters. ([@ScottFreeCode](https://github.com/ScottFreeCode))
- [#2299](https://github.com/mochajs/mocha/pull/2299): Fix progress bar in `html` (browser) reporter. ([@AviVahl](https://github.com/avivahl))
- [#2307](https://github.com/mochajs/mocha/pull/2307): Fix `doc` reporter crashing when test fails. ([@jleyba](https://github.com/jleyba))
- [#2323](https://github.com/mochajs/mocha/issues/2323): Ensure browser entry point (`browser-entry.js`) is published to npm (for use with bundlers). ([@boneskull](https://github.com/boneskull))
- [#2310](https://github.com/mochajs/mocha/issues/2310): Ensure custom reporter with an absolute path works in Windows. ([@silentcloud](https://github.com/silentcloud))
- [#2311](https://github.com/mochajs/mocha/issues/2311): Fix problem wherein calling `this.slow()` without a value would blast any previously set value. ([@boneskull](https://github.com/boneskull))
- [#1813](https://github.com/mochajs/mocha/issues/1813): Ensure Mocha's own test suite will run in Windows. ([@tswaters](https://github.com/tswaters), [@TimothyGu](https://github.com/timothygu), [@boneskull](https://github.com/boneskull))
- [#2317](https://github.com/mochajs/mocha/issues/2317): Ensure all interfaces are displayed in `--help` on CLI. ([@ScottFreeCode](https://github.com/ScottFreeCode))
- [#1644](https://github.com/mochajs/mocha/issues/1644): Don't exhibit undefined behavior when calling `this.timeout()` with very large values ([@callumacrae](https://github.com/callumacrae), [@boneskull](https://github.com/boneskull))
- [#2361](https://github.com/mochajs/mocha/pull/2361): Don't truncate name of thrown anonymous exception. ([@boneskull](https://github.com/boneskull))
- [#2367](https://github.com/mochajs/mocha/pull/2367): Fix invalid CSS. ([@bensontrent](https://github.com/bensontrent))
- [#2401](https://github.com/mochajs/mocha/pull/2401): Remove carriage return before each test line in spec reporter. ([@Munter](https://github.com/munter))

## :nut_and_bolt: Other

- Upgrade production dependencies to address security advisories (and because now we can): `glob`, `commander`, `escape-string-regexp`, and `supports-color`. ([@boneskull](https://github.com/boneskull), [@RobLoach](https://github.com/robloach))
- Add Windows to CI. ([@boneskull](https://github.com/boneskull), [@TimothyGu](https://github.com/timothygu))
- Ensure appropriate `engines` field in `package.json`. ([@shinnn](https://github.com/shinnn), [@boneskull](https://github.com/boneskull))
- [#2348](https://github.com/mochajs/mocha/issues/2348): Upgrade ESLint to v2 ([@anthony-redfox](https://github.com/anthony-redfox))

We :heart: our [backers and sponsors](https://opencollective.com/mochajs)!

:shipit:

# 2.5.3 / 2016-05-25

- [#2112](https://github.com/mochajs/mocha/pull/2112) - Fix HTML reporter regression causing duplicate error output ([@danielstjules](https://github.com/danielstjules) via [`6d24063`](https://github.com/mochajs/mocha/commit/6d24063))
- [#2119](https://github.com/mochajs/mocha/pull/2119) - Make HTML reporter failure/passed links preventDefault to avoid SPA's hash navigation ([@jimenglish81](https://github.com/jimenglish81) via [`9e93efc`](https://github.com/mochajs/mocha/commit/9e93efc))

# 2.5.2 / 2016-05-24

- [#2178](https://github.com/mochajs/mocha/pull/2178) - Avoid double and triple xUnit XML escaping ([@graingert](https://github.com/graingert) via [`49b5ff1`](https://github.com/mochajs/mocha/commit/49b5ff1))

# 2.5.1 / 2016-05-23

- Fix [to-iso-string](https://npmjs.com/package/to-iso-string) dependency ([@boneskull](https://github.com/boneskull) via [`bd9450b`](https://github.com/mochajs/mocha/commit/bd9450b))

Thanks [**@entertainyou**](https://github.com/entertainyou), [**@SimenB**](https://github.com/SimenB), [**@just-paja**](https://github.com/just-paja) for the heads-up.

# 2.5.0 / 2016-05-23

This has been awhile coming! We needed to feel confident that the next release wouldn't break browser compatibility (e.g. the last few patch releases).

## Browser Tests in CI

We now run unit tests against PhantomJS v1.x and an assortment of browsers on [SauceLabs](https://saucelabs.com), including:

- Internet Explorer v8.0
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Microsoft Edge (latest)

To accomplish this, we now run Mocha's unit tests (and a handful of integration tests) via [Karma](https://npmjs.com/package/karma) and a modified [karma-mocha](https://npmjs.com/package/karma-mocha). Along the way, we had to solve issue [#880](https://github.com/mochajs/mocha/issues/880) (apologies to [**@mderijcke**](https://github.com/mderijcke) and [**@sukima**](https://github.com/sukima) who had PRs addressing this), as well as replace most usages of [should](https://npmjs.com/package/should) with [expect.js](https://npmjs.com/package/expect.js) for IE8.

Going forward, when sending PRs, your code will _only_ run against PhantomJS v1.x (and not hit SauceLabs) [because security](https://docs.travis-ci.com/user/pull-requests/#Security-Restrictions-when-testing-Pull-Requests).

## Node.js 6.x

Node.js 6.x "just worked" before, but now it's in the CI matrix, so it's "officially" supported. Mocha _still retains support_ for Node.js 0.8.x.

## "Minor" Release

You'll see mostly bug fixes below, but also a couple features--as such, it's a "minor" release.

## TYVM

Thanks to everyone who contributed, and our fabulous [sponsors and backers](https://opencollective.com/mochajs)!

- [#2079](https://github.com/mochajs/mocha/issues/2079) - Add browser checks to CI; update [browserify](https://npmjs.com/package/browserify) to v13.0.0 ([@dasilvacontin](https://github.com/dasilvacontin), [@ScottFreeCode](https://github.com/ScottFreeCode), [@boneskull](https://github.com/boneskull) via [`c04c1d7`](https://github.com/mochajs/mocha/commit/c04c1d7), [`0b1e9b3`](https://github.com/mochajs/mocha/commit/0b1e9b3), [`0dde0fa`](https://github.com/mochajs/mocha/commit/0dde0fa), [`f8a3d86`](https://github.com/mochajs/mocha/commit/f8a3d86), [`9e8cbaa`](https://github.com/mochajs/mocha/commit/9e8cbaa))
- [#880](https://github.com/mochajs/mocha/issues/880) - Make Mocha browserifyable ([@boneskull](https://github.com/boneskull) via [`524862b`](https://github.com/mochajs/mocha/commit/524862b))
- [#2121](https://github.com/mochajs/mocha/issues/2121) - Update [glob](https://npmjs.com/package/glob) to v3.2.11 ([@astorije](https://github.com/astorije) via [`7920fc4`](https://github.com/mochajs/mocha/commit/7920fc4))
- [#2126](https://github.com/mochajs/mocha/issues/2126) - Fix dupe error messages in stack trace filter ([@Turbo87](https://github.com/Turbo87) via [`4301caa`](https://github.com/mochajs/mocha/commit/4301caa))
- [#2109](https://github.com/mochajs/mocha/issues/2109) - Fix certain diffs when objects cannot be coerced into primitives ([@joshlory](https://github.com/joshlory) via [`61fbb7f`](https://github.com/mochajs/mocha/commit/61fbb7f))
- [#1827](https://github.com/mochajs/mocha/pull/1827) - Fix TWBS/`mocha.css` collisions ([@irnc](https://github.com/irnc) via [`0543798`](https://github.com/mochajs/mocha/commit/0543798))
- [#1760](https://github.com/mochajs/mocha/issues/1760), [#1936](https://github.com/mochajs/mocha/issues/1936) - Fix `this.skip()` in HTML reporter ([@mislav](https://github.com/mislav) via [`cb4248b`](https://github.com/mochajs/mocha/commit/cb4248b))
- [#2115](https://github.com/mochajs/mocha/pull/2115) - Fix exceptions thrown from hooks in HTML reporter ([@danielstjules](https://github.com/danielstjules) via [`e290bc0`](https://github.com/mochajs/mocha/commit/e290bc0))
- [#2089](https://github.com/mochajs/mocha/issues/2089) - Handle Symbol values in `util.stringify()` ([@ryym](https://github.com/ryym) via [`ea61d05`](https://github.com/mochajs/mocha/commit/ea61d05))
- [#2097](https://github.com/mochajs/mocha/pull/2097) - Fix diff for objects overriding `Object.prototype.hasOwnProperty` ([@mantoni](https://github.com/mantoni) via [`b20fdfe`](https://github.com/mochajs/mocha/commit/b20fdfe))
- [#2101](https://github.com/mochajs/mocha/pull/2101) - Properly handle non-string "messages" thrown from assertion libraries ([@jkimbo](https://github.com/jkimbo) via [`9c41051`](https://github.com/mochajs/mocha/commit/9c41051))
- [#2124](https://github.com/mochajs/mocha/pull/2124) - Update [growl](https://npmjs.com/package/growl) ([@benjamine](https://github.com/benjamine) via [`9ae6a85`](https://github.com/mochajs/mocha/commit/9ae6a85))
- [#2162](https://github.com/mochajs/mocha/pull/2162), [#2205](https://github.com/mochajs/mocha/pull/2205) - JSDoc fixes ([@OlegTsyba](https://github.com/OlegTsyba) via [`8031f20`](https://github.com/mochajs/mocha/commit/8031f20), [@ScottFreeCode](https://github.com/ScottFreeCode) via [`f83b1d9`](https://github.com/mochajs/mocha/commit/f83b1d9))
- [#2132](https://github.com/mochajs/mocha/issues/2132) - Remove Growl-related cruft ([@julienw](https://github.com/julienw) via [`00d6469`](https://github.com/mochajs/mocha/commit/00d6469))
- [#2172](https://github.com/mochajs/mocha/pull/2172) - Add [OpenCollective](https://opencollective.com) badge, sponsors & backers ([@xdamman](https://github.com/xdamman), [@boneskull](https://github.com/boneskull) via [`caee94f`](https://github.com/mochajs/mocha/commit/caee94f))
- [#1841](https://github.com/mochajs/mocha/pull/1841) - Add new logo, banner assets ([@dasilvacontin](https://github.com/dasilvacontin) via [`00fd0e1`](https://github.com/mochajs/mocha/commit/00fd0e1))
- [#2214](https://github.com/mochajs/mocha/pull/2214) - Update `README.md` header ([@dasilvacontin](https://github.com/dasilvacontin) via [`c0f9be2`](https://github.com/mochajs/mocha/commit/c0f9be2))
- [#2236](https://github.com/mochajs/mocha/pull/2236) - Better checks for Node.js v0.8 compatibility in CI ([@dasilvacontin](https://github.com/dasilvacontin) via [`ba5637d`](https://github.com/mochajs/mocha/commit/ba5637d))
- [#2239](https://github.com/mochajs/mocha/issues/2239) - Add Node.js v6.x to CI matrix ([@boneskull](https://github.com/boneskull) via [`3904da4`](https://github.com/mochajs/mocha/commit/3904da4))

# 2.4.5 / 2016-01-28

- [#2080](https://github.com/mochajs/mocha/issues/2080), [#2078](https://github.com/mochajs/mocha/issues/2078), [#2072](https://github.com/mochajs/mocha/pull/2072), [#2073](https://github.com/mochajs/mocha/pull/2073), [#1200](https://github.com/mochajs/mocha/issues/1200) - Revert changes to console colors in changeset [1192914](https://github.com/mochajs/mocha/commit/119291449cd03a11cdeda9e37cf718a69a012896) and subsequent related changes thereafter. Restores compatibility with IE8 & PhantomJS. See also [mantoni/mochify.js#129](https://github.com/mantoni/mochify.js/issues/129) and [openlayers/ol3#4746](https://github.com/openlayers/ol3/pull/4746) ([@boneskull](https://github.com/boneskull))
- [#2082](https://github.com/mochajs/mocha/pull/2082) - Fix several test assertions ([@mislav](https://github.com/mislav))

# 2.4.4 / 2016-01-27

- [#2080](https://github.com/mochajs/mocha/issues/2080) - Fix broken RequireJS compatibility ([@boneskull](https://github.com/boneskull))

# 2.4.3 / 2016-01-27

- [#2078](https://github.com/mochajs/mocha/issues/2078) - Fix broken IE8 ([@boneskull](https://github.com/boneskull))

# 2.4.2 / 2016-01-26

- [#2053](https://github.com/mochajs/mocha/pull/2053) - Fix web worker compatibility ([@mislav](https://github.com/mislav))
- [#2072](https://github.com/mochajs/mocha/pull/2072) - Fix Windows color output ([@thedark1337](https://github.com/thedark1337))
- [#2073](https://github.com/mochajs/mocha/pull/2073) - Fix colors in `progress` and `landing` reporters ([@gyandeeps](https://github.com/gyandeeps))

# 2.4.1 / 2016-01-26

- [#2067](https://github.com/mochajs/mocha/pull/2067) - Fix HTML/doc reporter regressions ([@danielstjules](https://github.com/danielstjules))

# 2.4.0 / 2016-01-25

- [#1945](https://github.com/mochajs/mocha/pull/1945) - Correctly skip tests when skipping in suite's before() ([@ryanshawty](https://github.com/ryanshawty))
- [#2056](https://github.com/mochajs/mocha/pull/2056) - chore(license): update license year to 2016 ([@pra85](https://github.com/pra85))
- [#2048](https://github.com/mochajs/mocha/pull/2048) - Fix `this.skip` from spec with HTML reporter ([@mislav](https://github.com/mislav))
- [#2033](https://github.com/mochajs/mocha/pull/2033) - Update tests for newer versions of should.js ([@tomhughes](https://github.com/tomhughes))
- [#2037](https://github.com/mochajs/mocha/pull/2037) - Fix for memory leak caused by referenced to deferred test ([@bd82](https://github.com/bd82))
- [#2038](https://github.com/mochajs/mocha/pull/2038) - Also run Travis-CI on node.js 4 & 5 ([@bd82](https://github.com/bd82))
- [#2028](https://github.com/mochajs/mocha/pull/2028) - Remove reference to test before afterAll hook runs ([@stonelgh](https://github.com/stonelgh))
- Bump mkdirp to 0.5.1 to support strict mode ([@danielstjules](https://github.com/danielstjules))
- [#1977](https://github.com/mochajs/mocha/pull/1977) - safely stringify PhantomJS undefined value ([@ahamid](https://github.com/ahamid))
- Add the ability to retry tests ([@@longlho])
- [#1982](https://github.com/mochajs/mocha/pull/1982) - Enable --log-timer-events option [@Alaneor](https://github.com/Alaneor)
- Fix [#1980](https://github.com/mochajs/mocha/issues/1980): Load mocha.opts from bin/mocha and bin/\_mocha ([@danielstjules](https://github.com/danielstjules))
- [#1976](https://github.com/mochajs/mocha/pull/1976) - Simplify function call ([@iclanzan](https://github.com/iclanzan))
- [#1963](https://github.com/mochajs/mocha/pull/1963) - Add support --perf-basic-prof ([@robraux](https://github.com/robraux))
- [#1981](https://github.com/mochajs/mocha/pull/1981) - Fix HTML reporter handling of done and exceptions ([@Standard8](https://github.com/Standard8))
- [#1993](https://github.com/mochajs/mocha/pull/1993) - propagate "file" property for "exports" interface ([@segrey](https://github.com/segrey))
- [#1999](https://github.com/mochajs/mocha/pull/1999) - Add support for strict mode ([@tmont](https://github.com/tmont))
- [#2005](https://github.com/mochajs/mocha/pull/2005) - XUnit Reporter Writes to stdout, falls back to console.log ([@jonnyreeves](https://github.com/jonnyreeves))
- [#2021](https://github.com/mochajs/mocha/pull/2021) - Fix non ES5 compliant regexp ([@zetaben](https://github.com/zetaben))
- [#1965] - Don't double install BDD UI ([@cowboyd](https://github.com/cowboyd))
- [#1995](https://github.com/mochajs/mocha/pull/1995) - Make sure the xunit output dir exists before writing to it ([@ianwremmel](https://github.com/ianwremmel))
- Use chalk for the base reporter colors; closes [#1200](https://github.com/mochajs/mocha/issues/1200) ([@boneskull](https://github.com/boneskull))
- Fix requiring custom interfaces ([@jgkim](https://github.com/jgkim))
- [#1967](https://github.com/mochajs/mocha/pull/1967) Silence Bluebird js warnings ([@krisr](https://github.com/krisr))

# 2.3.4 / 2015-11-15

- Update debug dependency to 2.2.0
- remove duplication of mocha.opts on process.argv
- Fix typo in test/reporters/nyan.js

# 2.3.3 / 2015-09-19

- [#1875](https://github.com/mochajs/mocha/issues/1875) - Fix Markdown reporter exceeds maximum call stack size ([@danielstjules](https://github.com/danielstjules))
- [#1864](https://github.com/mochajs/mocha/issues/1864) - Fix xunit missing output with --reporter-options output ([@danielstjules](https://github.com/danielstjules))
- [#1846](https://github.com/mochajs/mocha/issues/1846) - Support all harmony flags ([@danielstjules](https://github.com/danielstjules))
- Fix fragile xunit reporter spec ([@danielstjules](https://github.com/danielstjules))
- [#1669](https://github.com/mochajs/mocha/issues/1669) - Fix catch uncaught errors outside test suite execution ([@danielstjules](https://github.com/danielstjules))
- [#1868](https://github.com/mochajs/mocha/issues/1868) - Revert jade to support npm &lt; v1.3.7 ([@danielstjules](https://github.com/danielstjules))
- [#1766](https://github.com/mochajs/mocha/issues/1766) - Don't remove modules/components from stack trace in the browser ([@danielstjules](https://github.com/danielstjules))
- [#1798](https://github.com/mochajs/mocha/issues/1798) - Fix correctly attribute mutiple done err with hooks ([@danielstjules](https://github.com/danielstjules))
- Fix use utils.reduce for IE8 compatibility ([@wsw0108](https://github.com/wsw0108))
- Some linting errors fixed by [@danielstjules](https://github.com/danielstjules)
- Call the inspect() function if message is not set ([@kevinburke](https://github.com/kevinburke))

# 2.3.2 / 2015-09-07

- [#1868](https://github.com/mochajs/mocha/issues/1868) - Fix compatibility with older versions of NPM ([@boneskull](https://github.com/boneskull))

# 2.3.1 / 2015-09-06

- [#1812](https://github.com/mochajs/mocha/issues/1812) - Fix: Bail flag causes before() hooks to be run even after a failure ([@aaroncrows])

# 2.3.0 / 2015-08-30

- [#553](https://github.com/mochajs/mocha/issues/553) - added --allowUncaught option ([@amsul](https://github.com/amsul))
- [#1490](https://github.com/mochajs/mocha/issues/1490) - Allow --async-only to be satisfied by returning a promise ([@jlai](https://github.com/jlai))
- [#1829](https://github.com/mochajs/mocha/issues/1829) - support --max-old-space-size ([@gigadude](https://github.com/gigadude))
- [#1811](https://github.com/mochajs/mocha/issues/1811) - upgrade Jade dependency ([@outsideris](https://github.com/outsideris))
- [#1769](https://github.com/mochajs/mocha/issues/1769) - Fix async hook error handling ([@ajaykodali](https://github.com/ajaykodali))
- [#1230](https://github.com/mochajs/mocha/issues/1230) - More descriptive beforeEach/afterEach messages ([@duncanbeevers](https://github.com/duncanbeevers))
- [#1787](https://github.com/mochajs/mocha/issues/1787) - Scope loading behaviour instead of using early return ([@aryeguy](https://github.com/aryeguy))
- [#1789](https://github.com/mochajs/mocha/issues/1789) - Fix: html-runner crashing ([@sunesimonsen](https://github.com/sunesimonsen))
- [#1749](https://github.com/mochajs/mocha/issues/1749) - Fix maximum call stack error on large amount of tests ([@tinganho](https://github.com/tinganho))
- [#1230](https://github.com/mochajs/mocha/issues/1230) - Decorate failed hook titles with test title ([@duncanbeevers](https://github.com/duncanbeevers))
- [#1260](https://github.com/mochajs/mocha/issues/1260) - Build using Browserify ([@ndhoule](https://github.com/ndhoule))
- [#1728](https://github.com/mochajs/mocha/issues/1728) - Don't use `__proto__` ([@ndhoule](https://github.com/ndhoule))
- [#1781](https://github.com/mochajs/mocha/issues/1781) - Fix hook error tests ([@glenjamin](https://github.com/glenjamin))
- [#1754](https://github.com/mochajs/mocha/issues/1754) - Allow boolean --reporter-options ([@papandreou](https://github.com/papandreou))
- [#1766](https://github.com/mochajs/mocha/issues/1766) - Fix overly aggressive stack suppression ([@moll](https://github.com/moll))
- [#1752](https://github.com/mochajs/mocha/issues/1752) - Avoid potential infinite loop ([@gsilk](https://github.com/gsilk))
- [#1761](https://github.com/mochajs/mocha/issues/1761) - Fix problems running under PhantomJS ([@chromakode](https://github.com/chromakode))
- [#1700](https://github.com/mochajs/mocha/issues/1700) - Fix more problems running under PhantomJS ([@jbnicolai](https://github.com/jbnicolai))
- [#1774](https://github.com/mochajs/mocha/issues/1774) - Support escaped spaces in CLI options ([@adamgruber](https://github.com/adamgruber))
- [#1687](https://github.com/mochajs/mocha/issues/1687) - Fix HTML reporter links with special chars ([@benvinegar](https://github.com/benvinegar))
- [#1359](https://github.com/mochajs/mocha/issues/1359) - Adopt code style and enforce it using ESLint ([@ndhoule](https://github.com/ndhoule) w/ assist from [@jbnicolai](https://github.com/jbnicolai) & [@boneskull](https://github.com/boneskull))
- various refactors ([@jbnicolai](https://github.com/jbnicolai))
- [#1758](https://github.com/mochajs/mocha/issues/1758) - Add cross-frame compatible Error checking ([@outdooricon](https://github.com/outdooricon))
- [#1741](https://github.com/mochajs/mocha/issues/1741) - Remove moot `version` property from bower.json ([@kkirsche](https://github.com/kkirsche))
- [#1739](https://github.com/mochajs/mocha/issues/1739) - Improve `HISTORY.md` ([@rstacruz](https://github.com/rstacruz))
- [#1730](https://github.com/mochajs/mocha/issues/1730) - Support more io.js flags ([@ryedog](https://github.com/ryedog))
- [#1349](https://github.com/mochajs/mocha/issues/1349) - Allow HTML in HTML reporter errors ([@papandreou](https://github.com/papandreou) / [@sunesimonsen](https://github.com/sunesimonsen))
- [#1572](https://github.com/mochajs/mocha/issues/1572) - Prevent default browser behavior for failure/pass links ([@jschilli](https://github.com/jschilli))
- [#1630](https://github.com/mochajs/mocha/issues/1630) - Support underscored harmony flags ([@dominicbarnes](https://github.com/dominicbarnes))
- [#1718](https://github.com/mochajs/mocha/issues/1718) - Support more harmony flags ([@slyg](https://github.com/slyg))
- [#1689](https://github.com/mochajs/mocha/issues/1689) - Add stack to JSON-stream reporter ([@jonathandelgado](https://github.com/jonathandelgado))
- [#1654](https://github.com/mochajs/mocha/issues/1654) - Fix `ReferenceError` "location is not defined" ([@jakemmarsh](https://github.com/jakemmarsh))

# 2.2.5 / 2015-05-14

- [#1699](https://github.com/mochajs/mocha/issues/1699) - Upgrade jsdiff to v1.4.0 ([@nylen](https://github.com/nylen))
- [#1648](https://github.com/mochajs/mocha/issues/1648) - fix diff background colors in the console ([@nylen](https://github.com/nylen))
- [#1327](https://github.com/mochajs/mocha/issues/1327) - fix tests running twice, a regression issue. ([#1686](https://github.com/mochajs/mocha/issues/1686), [@danielstjules](https://github.com/danielstjules))
- [#1675](https://github.com/mochajs/mocha/issues/1675) - add integration tests ([@danielstjules](https://github.com/danielstjules))
- [#1682](https://github.com/mochajs/mocha/issues/1682) - use a valid SPDX license identifier in package.json ([@kemitchell](https://github.com/kemitchell))
- [#1660](https://github.com/mochajs/mocha/issues/1660) - fix assertion of invalid dates ([#1661](https://github.com/mochajs/mocha/issues/1661), [@a8m](https://github.com/a8m))
- [#1241](https://github.com/mochajs/mocha/issues/1241) - fix issue with multiline diffs appearing as single line ([#1655](https://github.com/mochajs/mocha/issues/1655), [@a8m](https://github.com/a8m))

# 2.2.4 / 2015-04-08

- Load mocha.opts in \_mocha for now (close [#1645](https://github.com/mochajs/mocha/issues/1645))

# 2.2.3 / 2015-04-07

- fix(reporter/base): string diff - issue [#1241](https://github.com/mochajs/mocha/issues/1241)
- fix(reporter/base): string diff - issue [#1241](https://github.com/mochajs/mocha/issues/1241)
- fix(reporter/base): don't show diffs for errors without expectation
- fix(reporter/base): don't assume error message is first line of stack
- improve: dry up reporter/base test
- fix(reporter/base): explicitly ignore showDiff [#1614](https://github.com/mochajs/mocha/issues/1614)
- Add iojs to travis build
- Pass `--allow-natives-syntax` flag to node.
- Support --harmony_classes flag for io.js
- Fix 1556: Update utils.clean to handle newlines in func declarations
- Fix 1606: fix err handling in IE &lt;= 8 and non-ES5 browsers
- Fix 1585: make \_mocha executable again
- chore(package.json): add a8m as a contributor
- Fixed broken link on html-cov reporter
- support --es_staging flag
- fix issue where menu overlaps content.
- update contributors in package.json
- Remove trailing whitespace from reporter output
- Remove contributors list from readme
- log third-party reporter errors
- [Fix] Exclude not own properties when looping on options
- fix: support node args in mocha.opts (close [#1573](https://github.com/mochajs/mocha/issues/1573))
- fix(reporter/base): string diff - issue [#1241](https://github.com/mochajs/mocha/issues/1241)

# 2.2.1 / 2015-03-09

- Fix passing of args intended for node/iojs.

# 2.2.0 / 2015-03-06

- Update mocha.js
- Add --fgrep. Use grep for RegExp, fgrep for str
- Ignore async global errors after spec resolution
- Fixing errors that prevent mocha.js from loading in the browser - fixes [#1558](https://github.com/mochajs/mocha/issues/1558)
- fix(utils): issue [#1558](https://github.com/mochajs/mocha/issues/1558) + make
- add ability to delay root suite; closes [#362](https://github.com/mochajs/mocha/issues/362), closes [#1124](https://github.com/mochajs/mocha/issues/1124)
- fix insanity in http tests
- update travis: add node 0.12, add gitter, remove slack
- building
- resolve [#1548](https://github.com/mochajs/mocha/issues/1548): ensure the environment's "node" executable is used
- reporters/base: use supports-color to detect colorable term
- travis: use docker containers
- small fix: commander option for --expose-gc
- Ignore asynchronous errors after global failure
- Improve error output when a test fails with a non-error
- updated travis badge, uses svg instead of img
- Allow skip from test context for [#332](https://github.com/mochajs/mocha/issues/332)
- [JSHINT] Unnecessary semicolon fixed in bin/\_mocha
- Added a reminder about the done() callback to test timeout error messages
- fixes [#1496](https://github.com/mochajs/mocha/issues/1496), in Mocha.run(fn), check if fn exists before executing it, added tests too
- Add Harmony Proxy flag for iojs
- test(utils|ms|\*): test existing units
- add support for some iojs flags
- fix(utils.stringify): issue [#1229](https://github.com/mochajs/mocha/issues/1229), diff viewer
- Remove slack link
- Prevent multiple 'grep=' querystring params in html reporter
- Use grep as regexp (close [#1381](https://github.com/mochajs/mocha/issues/1381))
- utils.stringify should handle objects without an Object prototype
- in runnable test, comparing to undefined error's message rather than a literal
- Fix test running output truncation on async STDIO
- amended for deprecated customFds option in child_process

# 2.1.0 / 2014-12-23

- showDiff: don’t stringify strings
- Clean up unused module dependencies.
- Filter zero-length strings from mocha.opts
- only write to stdout in reporters
- Revert "only write to stdout in reporters"
- Print colored output only to a tty
- update summary in README.md
- rename Readme.md/History.md to README.md/HISTORY.md because neurotic
- add .mailmap to fix "git shortlog" or "git summary" output
- fixes [#1461](https://github.com/mochajs/mocha/issues/1461): nyan-reporter now respects Base.useColors, fixed bug where Base.color would not return a string when str wasn't a string.
- Use existing test URL builder in failed replay links
- modify .travis.yml: use travis_retry; closes [#1449](https://github.com/mochajs/mocha/issues/1449)
- fix -t 0 behavior; closes [#1446](https://github.com/mochajs/mocha/issues/1446)
- fix tests (whoops)
- improve diff behavior
- Preserve pathname when linking to individual tests
- Fix test
- Tiny typo in comments fixed
- after hooks now being called on failed tests when using bail, fixes [#1093](https://github.com/mochajs/mocha/issues/1093)
- fix throwing undefined/null now makes tests fail, fixes [#1395](https://github.com/mochajs/mocha/issues/1395)
- compiler extensions are added as watched extensions, removed non-standard extensions from watch regex, resolves [#1221](https://github.com/mochajs/mocha/issues/1221)
- prefix/namespace for suite titles in markdown reporter, fixes [#554](https://github.com/mochajs/mocha/issues/554)
- fix more bad markdown in CONTRIBUTING.md
- fix bad markdown in CONTRIBUTING.md
- add setImmediate/clearImmediate to globals; closes [#1435](https://github.com/mochajs/mocha/issues/1435)
- Fix buffer diffs (closes [#1132](https://github.com/mochajs/mocha/issues/1132), closes [#1433](https://github.com/mochajs/mocha/issues/1433))
- add a CONTRIBUTING.md. closes [#882](https://github.com/mochajs/mocha/issues/882)
- fix intermittent build failures (maybe). closes [#1407](https://github.com/mochajs/mocha/issues/1407)
- add Slack notification to .travis.yml
- Fix slack link
- Add slack room to readme
- Update maintainers
- update maintainers and contributors
- resolves [#1393](https://github.com/mochajs/mocha/issues/1393): kill children with more effort on SIGINT
- xunit reporter support for optionally writing to a file
- if a reporter has a .done method, call it before exiting
- add support for reporter options
- only write to stdout in reporters

# 2.0.0 / 2014-10-21

- remove: support for node 0.6.x, 0.4.x
- fix: landing reporter with non ansi characters ([#211](https://github.com/mochajs/mocha/issues/211))
- fix: html reporter - preserve query params when navigating to suites/tests ([#1358](https://github.com/mochajs/mocha/issues/1358))
- fix: json stream reporter add error message to failed test
- fix: fixes for visionmedia -> mochajs
- fix: use stdio, fixes node deprecation warnings ([#1391](https://github.com/mochajs/mocha/issues/1391))

# 1.21.5 / 2014-10-11

- fix: build for NodeJS v0.6.x
- fix: do not attempt to highlight syntax when non-HTML reporter is used
- update: escape-string-regexp to 1.0.2.
- fix: botched indentation in canonicalize()
- fix: .gitignore: ignore .patch and .diff files
- fix: changed 'Catched' to 'Caught' in uncaught exception error handler messages
- add: `pending` field for json reporter
- fix: Runner.prototype.uncaught: don't double-end runnables that already have a state.
- fix: --recursive, broken by [`f0facd2`](https://github.com/mochajs/mocha/commit/f0facd2e)
- update: replaces escapeRegexp with the escape-string-regexp package.
- update: commander to 2.3.0.
- update: diff to 1.0.8.
- fix: ability to disable syntax highlighting ([#1329](https://github.com/mochajs/mocha/issues/1329))
- fix: added empty object to errorJSON() call to catch when no error is present
- fix: never time out after calling enableTimeouts(false)
- fix: timeout(0) will work at suite level ([#1300](https://github.com/mochajs/mocha/issues/1300))
- Fix for --watch+only() issue ([#888](https://github.com/mochajs/mocha/issues/888) )
- fix: respect err.showDiff, add Base reporter test ([#810](https://github.com/mochajs/mocha/issues/810))

# 1.22.1-3 / 2014-07-27

- fix: disabling timeouts with this.timeout(0) ([#1301](https://github.com/mochajs/mocha/issues/1301))

# 1.22.1-3 / 2014-07-27

- fix: local uis and reporters ([#1288](https://github.com/mochajs/mocha/issues/1288))
- fix: building 1.21.0's changes in the browser ([#1284](https://github.com/mochajs/mocha/issues/1284))

# 1.21.0 / 2014-07-23

- add: --no-timeouts option ([#1262](https://github.com/mochajs/mocha/issues/1262), [#1268](https://github.com/mochajs/mocha/issues/1268))
- add: --\*- deprecation node flags ([#1217](https://github.com/mochajs/mocha/issues/1217))
- add: --watch-extensions argument ([#1247](https://github.com/mochajs/mocha/issues/1247))
- change: spec reporter is default ([#1228](https://github.com/mochajs/mocha/issues/1228))
- fix: diff output showing incorrect +/- ([#1182](https://github.com/mochajs/mocha/issues/1182))
- fix: diffs of circular structures ([#1179](https://github.com/mochajs/mocha/issues/1179))
- fix: re-render the progress bar when progress has changed only ([#1151](https://github.com/mochajs/mocha/issues/1151))
- fix support for environments with global and window ([#1159](https://github.com/mochajs/mocha/issues/1159))
- fix: reverting to previously defined onerror handler ([#1178](https://github.com/mochajs/mocha/issues/1178))
- fix: stringify non error objects passed to done() ([#1270](https://github.com/mochajs/mocha/issues/1270))
- fix: using local ui, reporters ([#1267](https://github.com/mochajs/mocha/issues/1267))
- fix: cleaning es6 arrows ([#1176](https://github.com/mochajs/mocha/issues/1176))
- fix: don't include attrs in failure tag for xunit ([#1244](https://github.com/mochajs/mocha/issues/1244))
- fix: fail tests that return a promise if promise is rejected w/o a reason ([#1224](https://github.com/mochajs/mocha/issues/1224))
- fix: showing failed tests in doc reporter ([#1117](https://github.com/mochajs/mocha/issues/1117))
- fix: dot reporter dots being off ([#1204](https://github.com/mochajs/mocha/issues/1204))
- fix: catch empty throws ([#1219](https://github.com/mochajs/mocha/issues/1219))
- fix: honoring timeout for sync operations ([#1242](https://github.com/mochajs/mocha/issues/1242))
- update: growl to 1.8.0

# 1.20.1 / 2014-06-03

- update: should dev dependency to ~4.0.0 ([#1231](https://github.com/mochajs/mocha/issues/1231))

# 1.20.0 / 2014-05-28

- add: filenames to suite objects ([#1222](https://github.com/mochajs/mocha/issues/1222))

# 1.19.0 / 2014-05-17

- add: browser script option to package.json
- add: export file in Mocha.Test objects ([#1174](https://github.com/mochajs/mocha/issues/1174))
- add: add docs for wrapped node flags
- fix: mocha.run() to return error status in browser ([#1216](https://github.com/mochajs/mocha/issues/1216))
- fix: clean() to show failure details ([#1205](https://github.com/mochajs/mocha/issues/1205))
- fix: regex that generates html for new keyword ([#1201](https://github.com/mochajs/mocha/issues/1201))
- fix: sibling suites have inherited but separate contexts ([#1164](https://github.com/mochajs/mocha/issues/1164))

# 1.18.2 / 2014-03-18

- fix: html runner was prevented from using #mocha as the default root el ([#1162](https://github.com/mochajs/mocha/issues/1162))

# 1.18.1 / 2014-03-18

- fix: named before/after hooks in bdd, tdd, qunit interfaces ([#1161](https://github.com/mochajs/mocha/issues/1161))

# 1.18.0 / 2014-03-13

- add: promise support ([#329](https://github.com/mochajs/mocha/issues/329))
- add: named before/after hooks ([#966](https://github.com/mochajs/mocha/issues/966))

# 1.17.1 / 2014-01-22

- fix: expected messages in should.js (should.js#168)
- fix: expect errno global in node versions &lt; v0.9.11 ([#1111](https://github.com/mochajs/mocha/issues/1111))
- fix: unreliable checkGlobals optimization ([#1110](https://github.com/mochajs/mocha/issues/1110))

# 1.17.0 / 2014-01-09

- add: able to require globals (describe, it, etc.) through mocha ([#1077](https://github.com/mochajs/mocha/issues/1077))
- fix: abort previous run on --watch change ([#1100](https://github.com/mochajs/mocha/issues/1100))
- fix: reset context for each --watch triggered run ([#1099](https://github.com/mochajs/mocha/issues/1099))
- fix: error when cli can't resolve path or pattern ([#799](https://github.com/mochajs/mocha/issues/799))
- fix: canonicalize objects before stringifying and diffing them ([#1079](https://github.com/mochajs/mocha/issues/1079))
- fix: make CR call behave like carriage return for non tty ([#1087](https://github.com/mochajs/mocha/issues/1087))

# 1.16.2 / 2013-12-23

- fix: couple issues with ie 8 ([#1082](https://github.com/mochajs/mocha/issues/1082), [#1081](https://github.com/mochajs/mocha/issues/1081))
- fix: issue running the xunit reporter in browsers ([#1068](https://github.com/mochajs/mocha/issues/1068))
- fix: issue with firefox &lt; 3.5 ([#725](https://github.com/mochajs/mocha/issues/725))

# 1.16.1 / 2013-12-19

- fix: recompiled for missed changes from the last release

# 1.16.0 / 2013-12-19

- add: Runnable.globals(arr) for per test global whitelist ([#1046](https://github.com/mochajs/mocha/issues/1046))
- add: mocha.throwError(err) for assertion libs to call ([#985](https://github.com/mochajs/mocha/issues/985))
- remove: --watch's spinner ([#806](https://github.com/mochajs/mocha/issues/806))
- fix: duplicate test output for multi-line specs in spec reporter ([#1006](https://github.com/mochajs/mocha/issues/1006))
- fix: gracefully exit on SIGINT ([#1063](https://github.com/mochajs/mocha/issues/1063))
- fix expose the specified ui only in the browser ([#984](https://github.com/mochajs/mocha/issues/984))
- fix: ensure process exit code is preserved when using --no-exit ([#1059](https://github.com/mochajs/mocha/issues/1059))
- fix: return true from window.onerror handler ([#868](https://github.com/mochajs/mocha/issues/868))
- fix: xunit reporter to use process.stdout.write ([#1068](https://github.com/mochajs/mocha/issues/1068))
- fix: utils.clean(str) indentation ([#761](https://github.com/mochajs/mocha/issues/761))
- fix: xunit reporter returning test duration a NaN ([#1039](https://github.com/mochajs/mocha/issues/1039))

# 1.15.1 / 2013-12-03

- fix: recompiled for missed changes from the last release

# 1.15.0 / 2013-12-02

- add: `--no-exit` to prevent `process.exit()` ([#1018](https://github.com/mochajs/mocha/issues/1018))
- fix: using inline diffs ([#1044](https://github.com/mochajs/mocha/issues/1044))
- fix: show pending test details in xunit reporter ([#1051](https://github.com/mochajs/mocha/issues/1051))
- fix: faster global leak detection ([#1024](https://github.com/mochajs/mocha/issues/1024))
- fix: yui compression ([#1035](https://github.com/mochajs/mocha/issues/1035))
- fix: wrapping long lines in test results ([#1030](https://github.com/mochajs/mocha/issues/1030), [#1031](https://github.com/mochajs/mocha/issues/1031))
- fix: handle errors in hooks ([#1043](https://github.com/mochajs/mocha/issues/1043))

# 1.14.0 / 2013-11-02

- add: unified diff ([#862](https://github.com/mochajs/mocha/issues/862))
- add: set MOCHA_COLORS env var to use colors ([#965](https://github.com/mochajs/mocha/issues/965))
- add: able to override tests links in html reporters ([#776](https://github.com/mochajs/mocha/issues/776))
- remove: teamcity reporter ([#954](https://github.com/mochajs/mocha/issues/954))
- update: commander dependency to 2.0.0 ([#1010](https://github.com/mochajs/mocha/issues/1010))
- fix: mocha --ui will try to require the ui if not built in, as --reporter does ([#1022](https://github.com/mochajs/mocha/issues/1022))
- fix: send cursor commands only if isatty ([#184](https://github.com/mochajs/mocha/issues/184), [#1003](https://github.com/mochajs/mocha/issues/1003))
- fix: include assertion message in base reporter ([#993](https://github.com/mochajs/mocha/issues/993), [#991](https://github.com/mochajs/mocha/issues/991))
- fix: consistent return of it, it.only, and describe, describe.only ([#840](https://github.com/mochajs/mocha/issues/840))

# 1.13.0 / 2013-09-15

- add: sort test files with --sort ([#813](https://github.com/mochajs/mocha/issues/813))
- update: diff dependency to 1.0.7
- update: glob dependency to 3.2.3 ([#927](https://github.com/mochajs/mocha/issues/927))
- fix: diffs show whitespace differences ([#976](https://github.com/mochajs/mocha/issues/976))
- fix: improve global leaks ([#783](https://github.com/mochajs/mocha/issues/783))
- fix: firefox window.getInterface leak
- fix: accessing iframe via window[iframeIndex] leak
- fix: faster global leak checking
- fix: reporter pending css selector ([#970](https://github.com/mochajs/mocha/issues/970))

# 1.12.1 / 2013-08-29

- remove test.js from .gitignore
- update included version of ms.js

# 1.12.0 / 2013-07-01

- add: prevent diffs for differing types. Closes [#900](https://github.com/mochajs/mocha/issues/900)
- add `Mocha.process` hack for phantomjs
- fix: use compilers with requires
- fix regexps in diffs. Closes [#890](https://github.com/mochajs/mocha/issues/890)
- fix xunit NaN on failure. Closes [#894](https://github.com/mochajs/mocha/issues/894)
- fix: strip tab indentation in `clean` utility method
- fix: textmate bundle installation

# 1.11.0 / 2013-06-12

- add --prof support
- add --harmony support
- add --harmony-generators support
- add "Uncaught " prefix to uncaught exceptions
- add web workers support
- add `suite.skip()`
- change to output # of pending / passing even on failures. Closes [#872](https://github.com/mochajs/mocha/issues/872)
- fix: prevent hooks from being called if we are bailing
- fix `this.timeout(0)`

# 1.10.0 / 2013-05-21

- add add better globbing support for windows via `glob` module
- add support to pass through flags such as --debug-brk=1234. Closes [#852](https://github.com/mochajs/mocha/issues/852)
- add test.only, test.skip to qunit interface
- change to always use word-based diffs for now. Closes [#733](https://github.com/mochajs/mocha/issues/733)
- change `mocha init` tests.html to index.html
- fix `process` global leak in the browser
- fix: use resolve() instead of join() for --require
- fix: filterLeaks() condition to not consider indices in global object as leaks
- fix: restrict mocha.css styling to #mocha id
- fix: save timer references to avoid Sinon interfering in the browser build.

# 1.9.0 / 2013-04-03

- add improved setImmediate implementation
- replace --ignore-leaks with --check-leaks
- change default of ignoreLeaks to true. Closes [#791](https://github.com/mochajs/mocha/issues/791)
- remove scrolling for HTML reporter
- fix retina support
- fix tmbundle, restrict to js scope

# 1.8.2 / 2013-03-11

- add `setImmediate` support for 0.10.x
- fix mocha -w spinner on windows

# 1.8.1 / 2013-01-09

- fix .bail() arity check causing it to default to true

# 1.8.0 / 2013-01-08

- add Mocha() options bail support
- add `Mocha#bail()` method
- add instanceof check back for inheriting from Error
- add component.json
- add diff.js to browser build
- update growl
- fix TAP reporter failures comment :D

# 1.7.4 / 2012-12-06

- add total number of passes and failures to TAP
- remove .bind() calls. re [#680](https://github.com/mochajs/mocha/issues/680)
- fix indexOf. Closes [#680](https://github.com/mochajs/mocha/issues/680)

# 1.7.3 / 2012-11-30

- fix uncaught error support for the browser
- revert uncaught "fix" which breaks node

# 1.7.2 / 2012-11-28

- fix uncaught errors to expose the original error message

# 1.7.0 / 2012-11-07

- add `--async-only` support to prevent false positives for missing `done()`
- add sorting by filename in code coverage
- add HTML 5 doctype to browser template.
- add play button to html reporter to rerun a single test
- add `this.timeout(ms)` as Suite#timeout(ms). Closes [#599](https://github.com/mochajs/mocha/issues/599)
- update growl dependency to 1.6.x
- fix encoding of test-case ?grep. Closes [#637](https://github.com/mochajs/mocha/issues/637)
- fix unicode chars on windows
- fix dom globals in Opera/IE. Closes [#243](https://github.com/mochajs/mocha/issues/243)
- fix markdown reporter a tags
- fix `this.timeout("5s")` support

# 1.6.0 / 2012-10-02

- add object diffs when `err.showDiff` is present
- add hiding of empty suites when pass/failures are toggled
- add faster `.length` checks to `checkGlobals()` before performing the filter

# 1.5.0 / 2012-09-21

- add `ms()` to `.slow()` and `.timeout()`
- add `Mocha#checkLeaks()` to re-enable global leak checks
- add `this.slow()` option [aheckmann]
- add tab, CR, LF to error diffs for now
- add faster `.checkGlobals()` solution [guille]
- remove `fn.call()` from reduce util
- remove `fn.call()` from filter util
- fix forEach. Closes [#582](https://github.com/mochajs/mocha/issues/582)
- fix relaying of signals [TooTallNate]
- fix TAP reporter grep number

# 1.4.2 / 2012-09-01

- add support to multiple `Mocha#globals()` calls, and strings
- add `mocha.reporter()` constructor support [jfirebaugh]
- add `mocha.timeout()`
- move query-string parser to utils.js
- move highlight code to utils.js
- fix third-party reporter support [exogen]
- fix client-side API to match node-side [jfirebaugh]
- fix mocha in iframe [joliss]

# 1.4.1 / 2012-08-28

- add missing `Markdown` export
- fix `Mocha#grep()`, escape regexp strings
- fix reference error when `devicePixelRatio` is not defined. Closes [#549](https://github.com/mochajs/mocha/issues/549)

# 1.4.0 / 2012-08-22

- add mkdir -p to `mocha init`. Closes [#539](https://github.com/mochajs/mocha/issues/539)
- add `.only()`. Closes [#524](https://github.com/mochajs/mocha/issues/524)
- add `.skip()`. Closes [#524](https://github.com/mochajs/mocha/issues/524)
- change str.trim() to use utils.trim(). Closes [#533](https://github.com/mochajs/mocha/issues/533)
- fix HTML progress indicator retina display
- fix url-encoding of click-to-grep HTML functionality

# 1.3.2 / 2012-08-01

- fix exports double-execution regression. Closes [#531](https://github.com/mochajs/mocha/issues/531)

# 1.3.1 / 2012-08-01

- add passes/failures toggling to HTML reporter
- add pending state to `xit()` and `xdescribe()` [Brian Moore]
- add the [**@charset**](https://github.com/charset) "UTF-8"; to fix [#522](https://github.com/mochajs/mocha/issues/522) with FireFox. [Jonathan Creamer]
- add border-bottom to #stats links
- add check for runnable in `Runner#uncaught()`. Closes [#494](https://github.com/mochajs/mocha/issues/494)
- add 0.4 and 0.6 back to travis.yml
- add `-E, --growl-errors` to growl on failures only
- add prefixes to debug() names. Closes [#497](https://github.com/mochajs/mocha/issues/497)
- add `Mocha#invert()` to js api
- change dot reporter to use sexy unicode dots
- fix error when clicking pending test in HTML reporter
- fix `make tm`

# 1.3.0 / 2012-07-05

- add window scrolling to `HTML` reporter
- add v8 `--trace-*` option support
- add support for custom reports via `--reporter MODULE`
- add `--invert` switch to invert `--grep` matches
- fix export of `Nyan` reporter. Closes [#495](https://github.com/mochajs/mocha/issues/495)
- fix escaping of `HTML` suite titles. Closes [#486](https://github.com/mochajs/mocha/issues/486)
- fix `done()` called multiple times with an error test
- change `--grep` - regexp escape the input

# 1.2.2 / 2012-06-28

- Added 0.8.0 support

# 1.2.1 / 2012-06-25

- Added `this.test.error(err)` support to after each hooks. Closes [#287](https://github.com/mochajs/mocha/issues/287)
- Added: export top-level suite on global mocha object (mocha.suite). Closes [#448](https://github.com/mochajs/mocha/issues/448)
- Fixed `js` code block format error in markdown reporter
- Fixed deprecation warning when using `path.existsSync`
- Fixed --globals with wildcard
- Fixed chars in nyan when his head moves back
- Remove `--growl` from test/mocha.opts. Closes [#289](https://github.com/mochajs/mocha/issues/289)

# 1.2.0 / 2012-06-17

- Added `nyan` reporter [Atsuya Takagi]
- Added `mocha init <path>` to copy client files
- Added "specify" synonym for "it" [domenic]
- Added global leak wildcard support [nathanbowser]
- Fixed runner emitter leak. closes [#432](https://github.com/mochajs/mocha/issues/432)
- Fixed omission of .js extension. Closes [#454](https://github.com/mochajs/mocha/issues/454)

# 1.1.0 / 2012-05-30

- Added: check each `mocha(1)` arg for directories to walk
- Added `--recursive` [tricknotes]
- Added `context` for BDD [hokaccha]
- Added styling for new clickable titles
- Added clickable suite titles to HTML reporter
- Added warning when strings are thrown as errors
- Changed: green arrows again in HTML reporter styling
- Changed ul/li elements instead of divs for better copy-and-pasting [joliss]
- Fixed issue [#325](https://github.com/mochajs/mocha/issues/325) - add better grep support to js api
- Fixed: save timer references to avoid Sinon interfering.

# 1.0.3 / 2012-04-30

- Fixed string diff newlines
- Fixed: removed mocha.css target. Closes [#401](https://github.com/mochajs/mocha/issues/401)

# 1.0.2 / 2012-04-25

- Added HTML reporter duration. Closes [#47](https://github.com/mochajs/mocha/issues/47)
- Fixed: one postMessage event listener [exogen]
- Fixed: allow --globals to be used multiple times. Closes [#100](https://github.com/mochajs/mocha/issues/100) [brendannee]
- Fixed [#158](https://github.com/mochajs/mocha/issues/158): removes jquery include from browser tests
- Fixed grep. Closes [#372](https://github.com/mochajs/mocha/issues/372) [brendannee]
- Fixed [#166](https://github.com/mochajs/mocha/issues/166) - When grepping don't display the empty suites
- Removed test/browser/style.css. Closes [#385](https://github.com/mochajs/mocha/issues/385)

# 1.0.1 / 2012-04-04

- Fixed `.timeout()` in hooks
- Fixed: allow callback for `mocha.run()` in client version
- Fixed browser hook error display. Closes [#361](https://github.com/mochajs/mocha/issues/361)

# 1.0.0 / 2012-03-24

- Added js API. Closes [#265](https://github.com/mochajs/mocha/issues/265)
- Added: initial run of tests with `--watch`. Closes [#345](https://github.com/mochajs/mocha/issues/345)
- Added: mark `location` as a global on the CS. Closes [#311](https://github.com/mochajs/mocha/issues/311)
- Added `markdown` reporter (github flavour)
- Added: scrolling menu to coverage.html. Closes [#335](https://github.com/mochajs/mocha/issues/335)
- Added source line to html report for Safari [Tyson Tate]
- Added "min" reporter, useful for `--watch` [Jakub Nešetřil]
- Added support for arbitrary compilers via . Closes [#338](https://github.com/mochajs/mocha/issues/338) [Ian Young]
- Added Teamcity export to lib/reporters/index [Michael Riley]
- Fixed chopping of first char in error reporting. Closes [#334](https://github.com/mochajs/mocha/issues/334) [reported by topfunky]
- Fixed terrible FF / Opera stack traces

# 0.14.1 / 2012-03-06

- Added lib-cov to _.npmignore_
- Added reporter to `mocha.run([reporter])` as argument
- Added some margin-top to the HTML reporter
- Removed jQuery dependency
- Fixed `--watch`: purge require cache. Closes [#266](https://github.com/mochajs/mocha/issues/266)

# 0.14.0 / 2012-03-01

- Added string diff support for terminal reporters

# 0.13.0 / 2012-02-23

- Added preliminary test coverage support. Closes [#5](https://github.com/mochajs/mocha/issues/5)
- Added `HTMLCov` reporter
- Added `JSONCov` reporter [kunklejr]
- Added `xdescribe()` and `xit()` to the BDD interface. Closes [#263](https://github.com/mochajs/mocha/issues/263) (docs \* Changed: make json reporter output pretty json
- Fixed node-inspector support, swapped `--debug` for `debug` to match node. Closes [#247](https://github.com/mochajs/mocha/issues/247)

# 0.12.1 / 2012-02-14

- Added `npm docs mocha` support [TooTallNate]
- Added a `Context` object used for hook and test-case this. Closes [#253](https://github.com/mochajs/mocha/issues/253)
- Fixed `Suite#clone()` `.ctx` reference. Closes [#262](https://github.com/mochajs/mocha/issues/262)

# 0.12.0 / 2012-02-02

- Added .coffee `--watch` support. Closes [#242](https://github.com/mochajs/mocha/issues/242)
- Added support to `--require` files relative to the CWD. Closes [#241](https://github.com/mochajs/mocha/issues/241)
- Added quick n dirty syntax highlighting. Closes [#248](https://github.com/mochajs/mocha/issues/248)
- Changed: made HTML progress indicator smaller
- Fixed xunit errors attribute [dhendo]

# 0.10.2 / 2012-01-21

- Fixed suite count in reporter stats. Closes [#222](https://github.com/mochajs/mocha/issues/222)
- Fixed `done()` after timeout error reporting [Phil Sung]
- Changed the 0-based errors to 1

# 0.10.1 / 2012-01-17

- Added support for node 0.7.x
- Fixed absolute path support. Closes [#215](https://github.com/mochajs/mocha/issues/215) [kompiro]
- Fixed `--no-colors` option [Jussi Virtanen]
- Fixed Arial CSS typo in the correct file

# 0.10.0 / 2012-01-13

- Added `-b, --bail` to exit on first exception [guillermo]
- Added support for `-gc` / `--expose-gc` [TooTallNate]
- Added `qunit`-inspired interface
- Added MIT LICENSE. Closes [#194](https://github.com/mochajs/mocha/issues/194)
- Added: `--watch` all .js in the CWD. Closes [#139](https://github.com/mochajs/mocha/issues/139)
- Fixed `self.test` reference in runner. Closes [#189](https://github.com/mochajs/mocha/issues/189)
- Fixed double reporting of uncaught exceptions after timeout. Closes [#195](https://github.com/mochajs/mocha/issues/195)

# 0.8.2 / 2012-01-05

- Added test-case context support. Closes [#113](https://github.com/mochajs/mocha/issues/113)
- Fixed exit status. Closes [#187](https://github.com/mochajs/mocha/issues/187)
- Update commander. Closes [#190](https://github.com/mochajs/mocha/issues/190)

# 0.8.1 / 2011-12-30

- Fixed reporting of uncaught exceptions. Closes [#183](https://github.com/mochajs/mocha/issues/183)
- Fixed error message defaulting [indutny]
- Changed mocha(1) from bash to node for windows [Nathan Rajlich]

# 0.8.0 / 2011-12-28

- Added `XUnit` reporter [FeeFighters/visionmedia]
- Added `say(1)` notification support [Maciej Małecki]
- Changed: fail when done() is invoked with a non-Error. Closes [#171](https://github.com/mochajs/mocha/issues/171)
- Fixed `err.stack`, defaulting to message. Closes [#180](https://github.com/mochajs/mocha/issues/180)
- Fixed: `make tm` mkdir -p the dest. Closes [#137](https://github.com/mochajs/mocha/issues/137)
- Fixed mocha(1) --help bin name
- Fixed `-d` for `--debug` support

# 0.7.1 / 2011-12-22

- Removed `mocha-debug(1)`, use `mocha --debug`
- Fixed CWD relative requires
- Fixed growl issue on windows [Raynos]
- Fixed: platform specific line endings [TooTallNate]
- Fixed: escape strings in HTML reporter. Closes [#164](https://github.com/mochajs/mocha/issues/164)

# 0.7.0 / 2011-12-18

- Added support for IE{7,8} [guille]
- Changed: better browser nextTick implementation [guille]

# 0.6.0 / 2011-12-18

- Added setZeroTimeout timeout for browser (nicer stack traces). Closes [#153](https://github.com/mochajs/mocha/issues/153)
- Added "view source" on hover for HTML reporter to make it obvious
- Changed: replace custom growl with growl lib
- Fixed duplicate reporting for HTML reporter. Closes [#154](https://github.com/mochajs/mocha/issues/154)
- Fixed silent hook errors in the HTML reporter. Closes [#150](https://github.com/mochajs/mocha/issues/150)

# 0.5.0 / 2011-12-14

- Added: push node_modules directory onto module.paths for relative require Closes [#93](https://github.com/mochajs/mocha/issues/93)
- Added teamcity reporter [blindsey]
- Fixed: recover from uncaught exceptions for tests. Closes [#94](https://github.com/mochajs/mocha/issues/94)
- Fixed: only emit "test end" for uncaught within test, not hook

# 0.4.0 / 2011-12-14

- Added support for test-specific timeouts via `this.timeout(0)`. Closes [#134](https://github.com/mochajs/mocha/issues/134)
- Added guillermo's client-side EventEmitter. Closes [#132](https://github.com/mochajs/mocha/issues/132)
- Added progress indicator to the HTML reporter
- Fixed slow browser tests. Closes [#135](https://github.com/mochajs/mocha/issues/135)
- Fixed "suite" color for light terminals
- Fixed `require()` leak spotted by [guillermo]

# 0.3.6 / 2011-12-09

- Removed suite merging (for now)

# 0.3.5 / 2011-12-08

- Added support for `window.onerror` [guillermo]
- Fixed: clear timeout on uncaught exceptions. Closes [#131](https://github.com/mochajs/mocha/issues/131) [guillermo]
- Added `mocha.css` to PHONY list.
- Added `mocha.js` to PHONY list.

# 0.3.4 / 2011-12-08

- Added: allow `done()` to be called with non-Error
- Added: return Runner from `mocha.run()`. Closes [#126](https://github.com/mochajs/mocha/issues/126)
- Fixed: run afterEach even on failures. Closes [#125](https://github.com/mochajs/mocha/issues/125)
- Fixed clobbering of current runnable. Closes [#121](https://github.com/mochajs/mocha/issues/121)

# 0.3.3 / 2011-12-08

- Fixed hook timeouts. Closes [#120](https://github.com/mochajs/mocha/issues/120)
- Fixed uncaught exceptions in hooks

# 0.3.2 / 2011-12-05

- Fixed weird reporting when `err.message` is not present

# 0.3.1 / 2011-12-04

- Fixed hook event emitter leak. Closes [#117](https://github.com/mochajs/mocha/issues/117)
- Fixed: export `Spec` constructor. Closes [#116](https://github.com/mochajs/mocha/issues/116)

# 0.3.0 / 2011-12-04

- Added `-w, --watch`. Closes [#72](https://github.com/mochajs/mocha/issues/72)
- Added `--ignore-leaks` to ignore global leak checking
- Added browser `?grep=pattern` support
- Added `--globals <names>` to specify accepted globals. Closes [#99](https://github.com/mochajs/mocha/issues/99)
- Fixed `mocha-debug(1)` on some systems. Closes [#232](https://github.com/mochajs/mocha/issues/232)
- Fixed growl total, use `runner.total`

# 0.2.0 / 2011-11-30

- Added `--globals <names>` to specify accepted globals. Closes [#99](https://github.com/mochajs/mocha/issues/99)
- Fixed funky highlighting of messages. Closes [#97](https://github.com/mochajs/mocha/issues/97)
- Fixed `mocha-debug(1)`. Closes [#232](https://github.com/mochajs/mocha/issues/232)
- Fixed growl total, use runner.total

# 0.1.0 / 2011-11-29

- Added `suiteSetup` and `suiteTeardown` to TDD interface [David Henderson]
- Added growl icons. Closes [#84](https://github.com/mochajs/mocha/issues/84)
- Fixed coffee-script support

# 0.0.8 / 2011-11-25

- Fixed: use `Runner#total` for accurate reporting

# 0.0.7 / 2011-11-25

- Added `Hook`
- Added `Runnable`
- Changed: `Test` is `Runnable`
- Fixed global leak reporting in hooks
- Fixed: > 2 calls to done() only report the error once
- Fixed: clear timer on failure. Closes [#80](https://github.com/mochajs/mocha/issues/80)

# 0.0.6 / 2011-11-25

- Fixed return on immediate async error. Closes [#80](https://github.com/mochajs/mocha/issues/80)

# 0.0.5 / 2011-11-24

- Fixed: make mocha.opts whitespace less picky [kkaefer]

# 0.0.4 / 2011-11-24

- Added `--interfaces`
- Added `--reporters`
- Added `-c, --colors`. Closes [#69](https://github.com/mochajs/mocha/issues/69)
- Fixed hook timeouts

# 0.0.3 / 2011-11-23

- Added `-C, --no-colors` to explicitly disable
- Added coffee-script support

# 0.0.2 / 2011-11-22

- Fixed global leak detection due to Safari bind() change
- Fixed: escape html entities in Doc reporter
- Fixed: escape html entities in HTML reporter
- Fixed pending test support for HTML reporter. Closes [#66](https://github.com/mochajs/mocha/issues/66)

# 0.0.1 / 2011-11-22

- Added `--timeout` second shorthand support, ex `--timeout 3s`.
- Fixed "test end" event for uncaughtExceptions. Closes [#61](https://github.com/mochajs/mocha/issues/61)

# 0.0.1-alpha6 / 2011-11-19

- Added travis CI support (needs enabling when public)
- Added preliminary browser support
- Added `make mocha.css` target. Closes [#45](https://github.com/mochajs/mocha/issues/45)
- Added stack trace to TAP errors. Closes [#52](https://github.com/mochajs/mocha/issues/52)
- Renamed tearDown to teardown. Closes [#49](https://github.com/mochajs/mocha/issues/49)
- Fixed: cascading hooksc. Closes [#30](https://github.com/mochajs/mocha/issues/30)
- Fixed some colors for non-tty
- Fixed errors thrown in sync test-cases due to nextTick
- Fixed Base.window.width... again give precedence to 0.6.x

# 0.0.1-alpha5 / 2011-11-17

- Added `doc` reporter. Closes [#33](https://github.com/mochajs/mocha/issues/33)
- Added suite merging. Closes [#28](https://github.com/mochajs/mocha/issues/28)
- Added TextMate bundle and `make tm`. Closes [#20](https://github.com/mochajs/mocha/issues/20)

# 0.0.1-alpha4 / 2011-11-15

- Fixed getWindowSize() for 0.4.x

# 0.0.1-alpha3 / 2011-11-15

- Added `-s, --slow <ms>` to specify "slow" test threshold
- Added `mocha-debug(1)`
- Added `mocha.opts` support. Closes [#31](https://github.com/mochajs/mocha/issues/31)
- Added: default [files] to _test/\*.js_
- Added protection against multiple calls to `done()`. Closes [#35](https://github.com/mochajs/mocha/issues/35)
- Changed: bright yellow for slow Dot reporter tests

# 0.0.1-alpha2 / 2011-11-08

- Missed this one :)

# 0.0.1-alpha1 / 2011-11-08

- Initial release
