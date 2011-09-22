
describe('uncaught', function(){
  it('should report properly', function(done){
    // if you uncomment this :)
    process.nextTick(function(){
      throw new Error("I'm uncaught!");
    });
  });
});