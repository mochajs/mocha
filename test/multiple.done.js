
describe('multiple calls to done()', function(){
  it('should fail in a test-case', function(done){
    process.nextTick(function(){
      done();
      // uncomment
      // done();
    });
  })
})