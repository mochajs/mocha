"use strict";

let count = 0;
process.on("unhandledRejection", function () {
  count++;
  console.error("USER_LISTENER_CALLED " + count);
});

it("should emit an unhandled rejection", function (done) {
  setTimeout(function () {
    Promise.resolve().then(function () {
      throw new Error("yikes");
    });
    setTimeout(done, 50);
  });
});
