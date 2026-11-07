// A top-level await that never settles: nothing is left on the event loop,
// so Node exits while Mocha is still waiting for this file to load.
await new Promise(() => {});

describe("never registered", function () {
  it("never runs", function () {});
});
