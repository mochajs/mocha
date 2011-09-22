
describe('async', function(){
  var calls = [];
  
  process.on('exit', function(){
    calls.should.eql([
        'before all'
      , 'before'
      , 'one'
      , 'after'
      , 'before'
      , 'two'
      , 'after'
      , 'before'
      , 'three'
      , 'after'
      , 'after all']);
  })
  
  beforeEach(function(){
    // not hit
    calls.push('parent before');
  })
  
  afterEach(function(){
    // not hit
    calls.push('parent after' );
  })
  
  describe('beforeEach()', function(){
    before(function(){
      calls.push('before all');
    });
  
    after(function(){
      calls.push('after all');
    });
  
    beforeEach(function(done){
      process.nextTick(function(){
        calls.push('before');
        done();
      })
    })
  
    it('one', function(done){
      calls.should.eql([
          'before all'
        , 'before']);
      calls.push('one');
      process.nextTick(done);
    })
    
    it('two', function(){
      calls.should.eql([
          'before all'
        , 'before'
        , 'one'
        , 'after'
        , 'before']);
      calls.push('two');
    })
    
    it('three', function(){
      calls.should.eql([
          'before all'
        , 'before'
        , 'one'
        , 'after'
        , 'before'
        , 'two'
        , 'after'
        , 'before']);
      calls.push('three');
    })
  
    afterEach(function(done){
      process.nextTick(function(){
        calls.push('after');
        done();
      })
    })
  })
})
