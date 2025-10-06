## Summary

Tests pass in CI because, when Mocha is wrapped by `nyc`, the Node loader defaults to module mode and allows `import` statements.
Tests will pass locally when run via `npx nyc node bin/mocha.js ...` for the same reason.
Tests are failing when run directly (e.g. `npx mocha ...` or `node bin/mocha.js ...`) because Mocha does not have `type: module` in its package.json (by design) so Node's default module loader does not allow `import` statements.
Tests were passing locally before [#5408](https://github.com/mochajs/mocha/pull/5408/files#r2240266621) because Mocha was

## Control flow

- Through `nyc` (before and after):

  1. nyc spawns its process with its own loaders, Node is in module mode
  1. Mocha calls `requireModule(test-that-imports-non-existing-module.fixture.ts)`
  1. Node reads the file with that exact name (not going through our `loader-that-recognizes-ts.mjs` file)
  1. Node sees `import non-existent-package` within that TS file
  1. Node looks for the package, fails to find it, and throws `[ERR_MODULE_NOT_FOUND] Cannot find package 'non-existent-package' ...`
  1. Mocha catches this as `requireErr` and falls back to our `loader-that-recognizes-ts.mjs`
  1. Our loader resolves the test as `test-that...-module.fixture.mjs` (same name except for the `mjs` extension)
  1. Node looks for `test-that...-module.fixture.mjs`, finds it, and loads it
  1. Node sees `import non-existent-package` again within that MJS file
  1. Node throws `[ERR_MODULE_NOT_FOUND] Cannot find package 'non-existent-package' ...` again!
  1. Mocha catches this as `importErr` and throws one of the errs (but they have the same code, so the test passes regardless)
     - In old code, throws `importErr`
     - In new code, sees that `file` has a `ts` extension and throws `requireErr`

- Directly (`npx mocha`):
  1. Node sees that Mocha is not an ESM package, sticks to non-module mode
  1. (same) Mocha calls `requireModule(test-that-imports-non-existing-module.fixture.ts)`
  1. (same) Node reads the file with that exact name (not going through our `loader-that-recognizes-ts.mjs` file)
  1. (same) Node sees `import non-existent-package` within that TS file
  1. Node is not in module mode, so it throws `'Cannot use import statement outside a module'`
  1. (same) Mocha catches this as `requireErr` and falls back to our `loader-that-recognizes-ts.mjs`
  1. (same) Our loader resolves the test as `test-that...-module.fixture.mjs` (same name except for the `mjs` extension)
  1. (same) Node looks for `test-that...-module.fixture.mjs`, finds it, and loads it
     - Because the file it found ends with `mjs`, Node enters module mode
  1. (same) Node sees `import non-existent-package` again within that MJS file
  1. (same) Node throws `[ERR_MODULE_NOT_FOUND] Cannot find package 'non-existent-package' ...` again!
  1. (same) Mocha catches this as `importErr`
  1. (diff) In new code, Mocha sees that the original file name ends in `ts` and throws the `requireErr` (Cannot use import statement)

So we finally know why the tests fail

---

## Notes

This branch adds debug logs to child runs of Mocha for debugging--those changes (and this file!) should **not** be merged to main!

This command passes:

```
DEBUG=* npx nyc node bin/mocha.js --grep "module with a loader" --timeout 3000 "test/integration/esm.spec.js"
```

with this output:

```log
...

  mocha:test:integration:helpers spawning: DEBUG=mocha:esm-utils /home/markw/.local/share/fnm/node-versions/v22.20.0/installation/bin/node /home/markw/my-stuff/mocha-stuff/mocha/bin/mocha.js --unhandled-rejections=warn --loader=./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts --no-color --no-bail --no-parallel +0ms
internal secret log:  /home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/register-env.js:/home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/wrap.js
2025-10-05T02:35:21.733Z mocha:esm-utils assigning requireOrImport, require_module === true
internal secret log:  /home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/register-env.js:/home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/wrap.js
(node:155036) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
internal secret log:  /home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/register-env.js:/home/markw/my-stuff/mocha-stuff/mocha/node_modules/nyc/lib/wrap.js
2025-10-05T02:35:22.137Z mocha:esm-utils assigning requireOrImport, require_module === true
2025-10-05T02:35:22.232Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/setup)
2025-10-05T02:35:22.518Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts)
2025-10-05T02:35:22.522Z mocha:esm-utils requireModule caught err: "Cannot find package 'non-existent-package' imported from /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts"
Loading from loader that recognizes TS
Specifier:  file:///home/markw/my-stuff/mocha-stuff/mocha/lib/cli/cli.js
Loading from loader that recognizes TS

 Exception during run: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'non-existent-package' imported from /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts
...
```

This command:

```
DEBUG=* npx mocha --grep "module with a loader" --timeout 3000 "test/integration/esm.spec.js"
```

gives this output:

```log
...
  mocha:test:integration:helpers spawning: DEBUG=mocha:esm-utils /home/markw/.local/share/fnm/node-versions/v22.20.0/installation/bin/node /home/markw/my-stuff/mocha-stuff/mocha/bin/mocha.js --unhandled-rejections=warn --loader=./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts --no-color --no-bail --no-parallel +0ms
2025-10-05T03:08:09.615Z mocha:esm-utils assigning requireOrImport, require_module === true
(node:162207) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
Loading from loader that recognizes TS
Specifier:  file:///home/markw/my-stuff/mocha-stuff/mocha/lib/cli/cli.js
2025-10-05T03:08:09.771Z mocha:esm-utils assigning requireOrImport, require_module === true
2025-10-05T03:08:09.814Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/setup)
2025-10-05T03:08:09.815Z mocha:esm-utils requireModule trying require(file)
2025-10-05T03:08:09.914Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts)
2025-10-05T03:08:09.914Z mocha:esm-utils requireModule trying require(file)
(node:162207) Warning: Failed to load the ES module: /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
2025-10-05T03:08:09.955Z mocha:esm-utils requireModule caught requireErr: 'Cannot use import statement outside a module'
2025-10-05T03:08:09.955Z mocha:esm-utils requireModule falling back
Loading from loader that recognizes TS
Specifier:  file:///home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts
Loading from loader that recognizes TS
2025-10-05T03:08:09.966Z mocha:esm-utils requireModule caught importErr: [ERR_MODULE_NOT_FOUND]: "Cannot find package 'non-existent-package' imported from /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.mjs"
requireModule(file), file is *ts or importErr code === ERR_UNKNOWN_FILE_EXTENSION, throwing importErr

 Exception during run: /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts:2
import 'non-existent-package';
^^^^^^

SyntaxError: Cannot use import statement outside a module
...
```
