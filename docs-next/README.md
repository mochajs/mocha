# Mocha Docs: Built on Astro Starlight

This is the new site, hosted at https://mochajs.org/next and built with [Astro Starlight](https://starlight.astro.build). For details on how to build alongside the old site, see the `docs` directory.

## Preview the new site on its own

To run this site alone:

```shell
cd docs-next
npm i
npm run generate
npm run dev
```

## Build the new site into a folder with the old site

```shell
cd docs-next
npm i
npm run build-with-old
```

## Preview the old and new site together

First, build the new site into a folder with the old site above.

```shell
cd .. # back to root dir
npm run docs:preview
```

The new site will be at `http://localhost:8080/next`

However, note that relative links may resolve with `dev` but fail with `build` and `preview` (see https://github.com/mochajs/mocha/issues/5415).
