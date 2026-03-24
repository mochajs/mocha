// Fixture: a TypeScript file with top-level await and a runtime error in an ESM package.
// require() fails with ERR_REQUIRE_ASYNC_MODULE, import() throws the runtime error.
// See: https://github.com/mochajs/mocha/issues/5494
await Promise.resolve(1);
throw new Error("runtime-error-from-ts-fixture");
