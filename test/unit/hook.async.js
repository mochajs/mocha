
describe('async', function(){
  var calls = [];

  process.on('exit', function(){
    calls.should.eql([
        'before all'
      , 'before one'
      , 'after one'
      , 'before two'
      , 'after two'
      , 'before three'
      , 'after three'
      , 'after all']);
  })

  beforeEach(function(test, done){
    // not hit
    calls.push('parent before ' + test.title);
  })

  afterEach(function(test, done){
    // not hit
    calls.push('parent after ' + test.title);
  })

  describe('beforeEach()', function(){
    before(function(){
      calls.push('before all');
    });

    after(function(){
      calls.push('after all');
    });

    beforeEach(function(test, done){
      process.nextTick(function(){
        calls.push('before ' + test.title);
        done();
      })
    })

    it('one', function(done){
      calls.should.eql([
          'before all'
        , 'before one']);
      process.nextTick(done);
    })
    
    it('two', function(){
      calls.should.eql([
          'before all'
        , 'before one'
        , 'after one'
        , 'before two']);
    })
    
    it('three', function(){
      calls.should.eql([
          'before all'
        , 'before one'
        , 'after one'
        , 'before two'
        , 'after two'
        , 'before three']);
    })

    afterEach(function(test, done){
      process.nextTick(function(){
        calls.push('after ' + test.title);
        done();
      })
    })
  })
})
