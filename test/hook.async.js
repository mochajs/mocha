
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
      , 'parent before'
      , 'before'
      , 'one'
      , 'after'
      , 'parent after'
      , 'parent before'
      , 'before'
      , 'two'
      , 'after'
      , 'parent after'
      , 'parent before'
      , 'before'
      , 'three'
      , 'after'
      , 'parent after'
      , 'after all'
      , 'root after all']);
  })

  beforeEach(function(){
    calls.push('parent before');
  })
  
  afterEach(function(){
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
        , 'parent before'
        , 'before']);
      calls.push('one');
      process.nextTick(done);
    })
    
    it('two', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'parent before'
        , 'before'
        , 'one'
        , 'after'
        , 'parent after'
        , 'parent before'
        , 'before']);
      calls.push('two');
    })
    
    it('three', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'parent before'
        , 'before'
        , 'one'
        , 'after'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'two'
        , 'after'
        , 'parent after'
        , 'parent before'
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
