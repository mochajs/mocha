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

This command fails:

```

```

with this output:

```log
...
  mocha:test:integration:helpers spawning: DEBUG=mocha:esm-utils /home/markw/.local/share/fnm/node-versions/v22.20.0/installation/bin/node /home/markw/my-stuff/mocha-stuff/mocha/bin/mocha.js --unhandled-rejections=warn --loader=./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts --no-color --no-bail --no-parallel +0ms
2025-10-05T02:33:23.090Z mocha:esm-utils assigning requireOrImport, require_module === true
(node:154767) ExperimentalWarning: `--experimental-loader` may be removed in the future; instead use `register()`:
--import 'data:text/javascript,import { register } from "node:module"; import { pathToFileURL } from "node:url"; register("./test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs", pathToFileURL("./"));'
(Use `node --trace-warnings ...` to show where the warning was created)
Loading from loader that recognizes TS
Specifier:  file:///home/markw/my-stuff/mocha-stuff/mocha/lib/cli/cli.js
2025-10-05T02:33:23.247Z mocha:esm-utils assigning requireOrImport, require_module === true
2025-10-05T02:33:23.289Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/setup)
2025-10-05T02:33:23.384Z mocha:esm-utils requireModule(/home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts)
(node:154767) Warning: Failed to load the ES module: /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts. Make sure to set "type": "module" in the nearest package.json file or use the .mjs extension.
2025-10-05T02:33:23.424Z mocha:esm-utils requireModule caught err: 'Cannot use import statement outside a module'
Loading from loader that recognizes TS
Specifier:  file:///home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts

 Exception during run: /home/markw/my-stuff/mocha-stuff/mocha/test/integration/fixtures/esm/loader-with-module-not-found/test-that-imports-non-existing-module.fixture.ts:2
import 'non-existent-package';
^^^^^^

SyntaxError: Cannot use import statement outside a module
...
```
