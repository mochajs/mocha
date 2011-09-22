
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

    afterEach(function(done){
      process.nextTick(function(){
        calls.push('after ' + test.title);
        done();
      })
    })
  })
})
