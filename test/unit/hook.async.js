
describe('async', function(){
  var calls = [];

  before(function(){
    calls.push('root before all');
  })
  
  after(function(){
    calls.push('root after all');
    calls.should.eql([
        'root before all'
      , 'before all'
      , 'before'
      , 'one'
      , 'after'
      , 'before'
      , 'two'
      , 'after'
      , 'before'
      , 'three'
      , 'after'
      , 'after all'
      , 'root after all']);
  })

  beforeEach(function(){
    // should not be invoked
    calls.push('parent before');
  })
  
  afterEach(function(){
    // should not be invoked
    calls.push('parent after' );
  })
  
  describe('hooks', function(){
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
          'root before all'
        , 'before all'
        , 'before']);
      calls.push('one');
      process.nextTick(done);
    })
    
    it('two', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'before'
        , 'one'
        , 'after'
        , 'before']);
      calls.push('two');
    })
    
    it('three', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
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
