'use strict';

describe("should fail due to suite-level timeout lower than elapsed time of inner test", function() {
  it("inner test", async function () {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });
  }).timeout(110);
}).timeout(50);
