var assert = require('assert');

describe("Setup", function(){
  var x = 0;
  before(function(){
    x = 1;
  });
  it("should have executed before", function(){
    assert.equal(x, 1);
  })
  
});

