import Mocha from "../../index.js";

var mocha = new Mocha({
  ui: "bdd",
  globals: ["okGlobalA", "okGlobalB", "okGlobalC", "callback*"],
  growl: true,
});

import "../setup.cjs";

mocha.addFile("test/unit/suite.spec.cjs");
mocha.addFile("test/unit/runner.spec.cjs");
mocha.addFile("test/unit/runnable.spec.cjs");
mocha.addFile("test/unit/hook-sync.spec.js");
mocha.addFile("test/unit/hook-sync-nested.spec.js");
mocha.addFile("test/unit/hook-async.spec.js");
mocha.addFile("test/unit/duration.spec.js");
mocha.addFile("test/unit/globals.spec.js");
mocha.addFile("test/unit/timeout.spec.js");

mocha.run(function () {
  console.log("done");
});
