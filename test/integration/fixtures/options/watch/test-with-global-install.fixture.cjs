const assert = require("node:assert");

require("./lib/global-install");

it("still sees the global from the first run", function () {
  assert.strictEqual(globalThis.installedOnce, 1);
});
