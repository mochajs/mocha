Test package used to cover a loader package that is only defined with `exports.imports` in the `package.json`.

This must be linked to `node_modules` and be `require`/`import`-ed with a bare specifier, as
defined in algorithm [`ESM_RESOLVE`][] step 5.2:

```
ESM_RESOLVE(specifier, parentURL)
  ...
  5. Otherwise,
    1. Note: specifier is now a bare specifier.
    2. Set resolved the result of PACKAGE_RESOLVE(specifier, parentURL).
```

[`ESM_RESOLVE`]: https://nodejs.org/api/esm.html?fts_query=algorithm#resolution-algorithm-specification
