# Minimal `find-up` / `tsx` export regression reproduction

This directory is a reduced reproduction for the `ERR_PACKAGE_PATH_NOT_EXPORTED` failure reported against Mocha 12.0.1.

It is intentionally a standalone example and not a fix for the underlying bug. The goal is to make the issue easy to isolate without bringing in a large project like Ruffle.

## Reproduce

Run the following from this directory:

```sh
npm install
npm test
```

Expected on affected versions: Node exits with `ERR_PACKAGE_PATH_NOT_EXPORTED` before tests are executed.

The setup intentionally combines:

- Mocha 12.0.1
- `tsx` (to load TypeScript test files)
- `unicorn-magic` (a package with an incomplete `exports` map, which triggers the failure when `find-up` reaches it while resolving config files)

## Why this exists

This issue was difficult to isolate in a large app because there are several unrelated packages involved. This minimal project keeps the reproduction as small as possible while still exercising the same dependency chain.
