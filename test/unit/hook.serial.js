
describe('serial', function(){
  var calls = [];

  beforeEach(function(test){
    // not hit
    calls.push('parent before ' + test.title);
  });

  afterEach(function(test){
    // not hit
    calls.push('parent after ' + test.title);
  });

  describe('beforeEach()', function(){
    beforeEach(function(test){
      calls.push('before ' + test.title);
    });

    it('one', function(){
      calls.should.eql(['before one']);
    });

    it('two', function(){
      calls.should.eql([
          'before one'
        , 'after one'
        , 'before two']);
    });

    it('three', function(){
      calls.should.eql([
          'before one'
        , 'after one'
        , 'before two'
        , 'after two'
        , 'before three']);
    });

    afterEach(function(test){
      calls.push('after ' + test.title);
    });
  });
});