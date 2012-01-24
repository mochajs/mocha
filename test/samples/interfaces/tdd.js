
suite('Array', function(){
  suite('#indexOf()', function(){
    var initialValue = 32;

    suiteSetup(function(done){
      initialValue.should.eql(32);
      initialValue = 42;
      done();
    });

    test('should return -1 when the value is not present', function(){
      initialValue.should.eql(42);
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    })
    
    test('should return the correct index when the value is present', function(){
      initialValue.should.eql(42);      
      [1,2,3].indexOf(1).should.equal(0);
      [1,2,3].indexOf(2).should.equal(1);
      [1,2,3].indexOf(3).should.equal(2);
    })
    suiteTeardown(function(done){
      initialValue.should.eql(42);
      done();
    });
  })
})
