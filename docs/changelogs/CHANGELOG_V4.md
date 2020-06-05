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
