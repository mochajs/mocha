
describe('multiple calls to done()', function(){
  beforeEach(function(done){
    done()
    // uncomment
    // done()
  })

  it('should fail in a test-case', function(done){
    process.nextTick(function(){
      done();
      // uncomment
      // done();
    });
  })
})