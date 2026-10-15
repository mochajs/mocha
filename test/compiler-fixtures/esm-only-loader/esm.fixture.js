import Module from "node:module";

Module.register(new URL("./esm-loader.fixture.js", import.meta.url));
