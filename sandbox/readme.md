# Issue 5411: Bug: Unhelpful error message when a default import is made from a module without a default export

https://github.com/mochajs/mocha/issues/5411

1. `fnm use && npm i && npm test`

Expected: helpful error message

Actual:

```
✖ ERROR: Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'test' imported from C:\...\sandbox\node_modules\mocha\lib\nodejs\esm-utils.js
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:256:9)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:854:18)
    at defaultResolve (node:internal/modules/esm/resolve:984:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:780:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:704:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:687:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:305:38)
    at onImport.tracePromise.__proto__ (node:internal/modules/esm/loader:643:36)
    at TracingChannel.tracePromise (node:diagnostics_channel:344:14)
    at ModuleLoader.import (node:internal/modules/esm/loader:642:21)
    at defaultImportModuleDynamicallyForScript (node:internal/modules/esm/utils:234:31)
    at importModuleDynamicallyCallback (node:internal/modules/esm/utils:256:12)
    at exports.doImport (C:\...\sandbox\node_modules\mocha\lib\nodejs\esm-utils.js:35:34)
    at formattedImport (C:\...\sandbox\node_modules\mocha\lib\nodejs\esm-utils.js:32:18)
    at requireModule (C:\...\sandbox\node_modules\mocha\lib\nodejs\esm-utils.js:97:34)
    at exports.handleRequires (C:\...\sandbox\node_modules\mocha\lib\cli\run-helpers.js:97:34)
    at async C:\...\sandbox\node_modules\mocha\lib\cli\run.js:358:25 {
  code: 'ERR_MODULE_NOT_FOUND'
}
```