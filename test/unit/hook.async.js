
describe('async', function(){
  var calls = [];

  process.on('exit', function(){
    calls.should.have.length(6);
  });

  beforeEach(function(test, done){
    // not hit
    calls.push('parent before ' + test.title);
  });

  afterEach(function(test, done){
    // not hit
    calls.push('parent after ' + test.title);
  });

  describe('beforeEach()', function(){
    beforeEach(function(test, done){
      setTimeout(function(){
        calls.push('before ' + test.title);
        done();
      }, 20);
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

    afterEach(function(test, done){
      setTimeout(function(){
        calls.push('after ' + test.title);
        done();
      }, 20);
    });
  });
});