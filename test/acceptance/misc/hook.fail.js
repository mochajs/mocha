
describe("fail during hook", function(){
  beforeEach(function () {
    fail;
  });

  it("should not run this test", function(){
  });
});

describe("afterwards", function () {
  it("should pass this test", function () {
  });
});
