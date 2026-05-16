Test package that registers an async Node.js [customization hook][hooks] exposing both
`resolve` and `load`. The `resolve` hook redirects bare specifiers prefixed with `virtual:`
to a synthetic URL, and the `load` hook returns generated source for that URL.

This exercises the `import()` fallback path in [`lib/nodejs/esm-utils.js`](../../../lib/nodejs/esm-utils.js)
when `require()` cannot resolve a specifier on its own (regression coverage for the
asynchronous-hook scenario described in
[#5382](https://github.com/mochajs/mocha/issues/5382)).

[hooks]: https://nodejs.org/docs/latest/api/module.html#customization-hooks
