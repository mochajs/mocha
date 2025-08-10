# Mocha Docs vNext: Built on Astro Starlight

## Preview the new site on its own

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
