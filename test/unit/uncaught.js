
describe('uncaught', function(){
  it('should report properly', function(test, done){
    // if you uncomment this :)
    process.nextTick(function(){
      throw new Error("I'm uncaught!");
    });
  });
});