
describe("fail during hook", function(){

  describe("before", function(){
    before(function(){
        fail;
    });

    it("should not run this test", function(){
        console.log("I ran, but shouldn't have.");
    });

    it("should not run this test either", function(){
        console.log("I ran, but shouldn't have.");
    });
  });

  describe("after before", function () {
    it("should pass this test", function () {
        console.log("I ran, as I should have.");
    });
  });

  describe("beforeEach", function(){
    beforeEach(function () {
      fail;
    });

    it("should not run this test", function(){
        console.log("I ran, but shouldn't have.");
    });

    it("should not run this test either", function(){
        console.log("I ran, but shouldn't have.");
    });
  });

  describe("after beforeEach", function () {
    it("should pass this test", function () {
        console.log("I ran, as I should have.");
    });
  });

});
