# mochajs.org

_So you wanna build the site?_

[mochajs.org](https://mochajs.org) is built using [Eleventy](https://www.11ty.io/), a simple static site generator.

## Prerequisites

- Node.js v10.12.0 or greater

## Development

1. Run `npm install` from working copy root to get Node.js deps.
1. To serve the site and rebuild as changes are made, execute `npm start docs.watch`.
1. To rebuild the site _once_, execute `npm start docs`.

### Notes

- The content lives in `docs/index.md`; everything else is markup, scripts, assets, etc.
- This file (`docs/README.md`) should _not_ be included in the build.
- `docs/_dist` is where the deployed site lives. `docs/_site` is essentially a build step. These directories are _not_ under version control.
- If you get the error message below when running `npm start docs`, follow [this guide](https://www.npmjs.com/package/gm) to install GraphicsMagick or ImageMagick.

```console
⚠ WARN: docs/_site/images/matomo-logo.png: Error executing Stream: The gm stream ended without emitting any data
(node:45255) UnhandledPromiseRejectionWarning: Error: docs/_site/images/matomo-logo.png: Error executing Stream: The gm stream ended without emitting any data
    at Socket.stdout.on.once (/Users/username/mocha/node_modules/express-processimage/lib/getFilterInfosAndTargetContentTypeFromQueryString.js:821:31)
    at Object.onceWrapper (events.js:286:20)
    at Socket.emit (events.js:203:15)
    at endReadableNT (_stream_readable.js:1145:12)
    at process._tickCallback (internal/process/next_tick.js:63:19)
(node:45255) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 2)
(node:45255) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
cp: docs/_dist/_headers: No such file or directory
```

- See `package-scripts.js` for details on what the builds are actually doing.

## License

:copyright: 2016-2018 [JS Foundation](https://js.foundation) and contributors.

Content licensed [CC-BY-4.0](https://raw.githubusercontent.com/mochajs/mocha/main/docs/LICENSE-CC-BY-4.0).

Code licensed [MIT](https://raw.githubusercontent.com/mochajs/mocha/main/LICENSE-MIT).
