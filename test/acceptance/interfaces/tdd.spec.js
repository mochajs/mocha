suite('integer primitives', function(){
  suite('arithmetic', function(){
    var initialValue = 41;

    suiteSetup(function(done){
      expect(initialValue).to.eql(41);
      initialValue += 1;
      done();
    });

    test('should add', function(){
      expect(initialValue).to.eql(42);
      expect(1 + 1).to.equal(2);
      expect(2 + 2).to.equal(4);
    });

    test('should subtract', function(){
      expect(initialValue).to.eql(42);
      expect(1 - 1).to.equal(0);
      expect(2 - 1).to.equal(1);
    });

    test.skip('should skip this test', function(){
      var zero = 0;
      expect(zero).to.equal(1, 'this test should have been skipped');
    });

    suite.skip('should skip this suite', function(){
      test('should skip this test', function(){
        var zero = 0;
        expect(zero).to.equal(1, 'this test should have been skipped');
      });
    });

    suiteTeardown(function(done){
      expect(initialValue).to.eql(42);
      done();
    });
  });
});
