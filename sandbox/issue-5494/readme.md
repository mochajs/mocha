# Issue 5494: 🐛 Bug: Mocha v11.7.3 and v11.7.4 fails with error ERR_REQUIRE_ESM

https://github.com/mochajs/mocha/issues/5494

```bash
fnm use # Node v24.3.0
npm i # Mocha 11.7.4 and ts-node/esm

# should give ERR_REQUIRE_ESM according to bug report
# on Linux Mint, giving ERR_REQUIRE_ASYNC_MODULE
# but changing `||` to `&&` as described does fix the issue
# ref `fix-5494` branch (maybe renamed to `v12-fix-5494`)
# https://github.com/mochajs/mocha/compare/fix-5494
npm test 
```