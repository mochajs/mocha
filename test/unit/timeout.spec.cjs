"use strict";

describe("timeouts", function () {
  beforeEach(function (done) {
    // uncomment
    // setTimeout(done, 3000);
    done();
  });

  it("should error on timeout", function (done) {
    // uncomment
    // setTimeout(done, 3000);
    done();
  });

  it("should allow overriding per-test", function (done) {
    this.timeout(1500);
    setTimeout(function () {
      done();
    }, 50);
  });

  describe("chaining calls", function () {
    describe("suite-level", function () {
      describe("should override for inner test cases and deeply nested suites", function () {
        it("inner test", async function () {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
        });
        describe("nested suite", function () {
          it("nested test", async function () {
            await new Promise((resolve) => {
              setTimeout(resolve, 2200); // This waiting time is higher than the default timeout value, 2 seconds.
            });
          });
        }).timeout(70);
      }).timeout(2500); // This chained `timeout` config will override `timeout` for nested suites and cases
    });
  });

  describe("disabling", function () {
    it("should work with timeout(0)", function (done) {
      this.timeout(0);
      setTimeout(done, 1);
    });

    describe("using beforeEach", function () {
      beforeEach(function () {
        this.timeout(0);
      });

      it("should work with timeout(0)", function (done) {
        setTimeout(done, 1);
      });
    });

    describe("using before", function () {
      before(function () {
        this.timeout(0);
      });

      it("should work with timeout(0)", function (done) {
        setTimeout(done, 1);
      });
    });

    describe("using timeout(0)", function () {
      this.timeout(4);

      it("should suppress timeout(4)", function (done) {
        this.slow(100);
        // The test is in the before() call.
        this.timeout(0);
        setTimeout(done, 50);
      });
    });

    describe("suite-level", function () {
      this.timeout(0);

      it("should work with timeout(0)", function (done) {
        setTimeout(done, 1);
      });

      describe("nested suite", function () {
        it("should work with timeout(0)", function (done) {
          setTimeout(done, 1);
        });
      });
    });

    describe("chaining calls", function () {
      before(function (done) {
        setTimeout(function () {
          done();
        }, 50);
      }).timeout(1500);

      it("should allow overriding via chaining", function (done) {
        setTimeout(function () {
          done();
        }, 50);
      }).timeout(1500);

      describe("suite-level", function () {
        it("should work with timeout(0)", function (done) {
          setTimeout(done, 1);
        });

        describe("nested suite", function () {
          it("should work with timeout(0)", function (done) {
            setTimeout(done, 1);
          });
        });
      }).timeout(1000);
    });
  });
});
