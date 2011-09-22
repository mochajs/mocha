
describe('uncaught', function(){
  it('should report properly', function(done){
    process.nextTick(function(){
      // if you uncomment this :)
      // throw new Error("I'm uncaught!");
      done();
    })
  })
})