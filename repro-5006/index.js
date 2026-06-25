const Mocha = require("../lib/mocha");

const mocha = new Mocha({
  require: ["./repro-5006/root-hook.js"]
});

mocha.addFile("./repro-5006/test.js");

mocha.run(failures => {
  process.exitCode = failures ? 1 : 0;
});