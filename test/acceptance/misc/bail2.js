describe("Granular bail tests: ", function () {

  var runs = 0;

  this.bail(false); // override any previous bail setting

  describe("bailing suite: ", function () {
    this.bail(true);
    it("should fail", function () {
      throw new Error("this is ok");
    });

    it("should not get here", function () {
      throw new Error("we should have bailed");
    });
  });

  describe("second bailing suite: ", function () {
    this.bail(true);

    it("should have run no successful tests by now", function () {
      runs += 1;
      runs.should.eql(1);
    });

    it("should fail", function () {
      throw new Error("this is ok");
    });

    it("should not get here", function () {
      throw new Error("we should have bailed");
    });

  });

  describe("non-bailing suite: ", function () {
    var bail = this.bail();
    it("should run this test, the second successful test", function () {
      runs += 1;
      runs.should.eql(2);
    });

    it("this suite should not bail", function () {
      bail.should.equal(false);
    });

    it("should run this and fail", function () {
      throw new Error("this is ok");
    });

    it("should run this test, the third test", function () {
      runs += 1;
      runs.should.eql(3);
    });

  });

  describe("third bailing suite: ", function () {
    this.bail(true);

    after(function () {
      runs += 1;
      runs.should.eql(6);
    });

    before(function () {
      runs += 1;
    });

    it("should have run 4 successful tests by now", function () {
      runs += 1;
      runs.should.eql(5);
    });

    it("should fail", function () {
      throw new Error("this is ok");
    });

    it("should not get here", function () {
      throw new Error("we should have bailed");
    });

    describe("child suite: ", function () {

      after(function () {
        throw new Error("we should have bailed");
      });

      before(function () {
        throw new Error("we should have bailed");
      });

      it("should fail", function () {
        throw new Error("we should have bailed");
      });
    });

  });

});
