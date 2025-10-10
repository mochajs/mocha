import {register} from 'node:module';
// import {pathToFileURL} from 'node:url';
// paths are relative to root
console.log('ello world');
register(
  './test/integration/fixtures/esm/loader-with-module-not-found/loader-that-recognizes-ts.mjs'
);
