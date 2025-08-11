# Mocha Docs: Built on Astro Starlight

This is the new site, hosted at https://mochajs.org/next. For details on how to build alongside the old site, see the `docs` directory.

To run this site alone:

```shell
cd docs-next
npm i
npm run generate
npm run dev
```

However, note that relative links my resolve with `dev` but fail with `build` and `preview` (see https://github.com/mochajs/mocha/issues/5415).
