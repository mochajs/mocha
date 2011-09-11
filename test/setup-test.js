var assert = require('assert');

describe("Setup", function(){

  it("should have executed before", function(){
    assert.equal([1,2,3].indexOf(4), -1);
  })
  
});

