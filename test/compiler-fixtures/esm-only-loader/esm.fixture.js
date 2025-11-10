import Module from "node:module";

Module.register(new URL("./esm-loader.fixture.mjs", import.meta.url));
