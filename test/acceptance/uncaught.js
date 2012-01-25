
describe('uncaught', function(){
  beforeEach(function(done){
    process.nextTick(function(){
      // throw new Error('oh noes');
      done();
    });
  })

  it('should report properly', function(done){
    process.nextTick(function(){
      // if you uncomment this :)
      // throw new Error("I'm uncaught!");
      done();
    })
  })
})