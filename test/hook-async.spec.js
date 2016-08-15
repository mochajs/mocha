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
      , 'before test one'
      , 'one'
      , 'after'
      , 'after test one passed'
      , 'parent after'
      , 'parent before'
      , 'before'
      , 'before test two'
      , 'two'
      , 'after'
      , 'after test two passed'
      , 'parent after'
      , 'parent before'
      , 'before'
      , 'before test three'
      , 'three'
      , 'after'
      , 'after test three passed'
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
      var ctx = this;
      process.nextTick(function(){
        calls.push('before');
        if (ctx.currentTest) {
          calls.push('before test ' + ctx.currentTest.title);
        }
        done();
      })
    })

    it('one', function(done){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'parent before'
        , 'before'
        , 'before test one']);
      calls.push('one');
      process.nextTick(done);
    })

    it('two', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'parent before'
        , 'before'
        , 'before test one'
        , 'one'
        , 'after'
        , 'after test one passed'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test two']);
      calls.push('two');
    })

    it('three', function(){
      calls.should.eql([
          'root before all'
        , 'before all'
        , 'parent before'
        , 'before'
        , 'before test one'
        , 'one'
        , 'after'
        , 'after test one passed'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test two'
        , 'two'
        , 'after'
        , 'after test two passed'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test three']);
      calls.push('three');
    })

    afterEach(function(done){
      var ctx = this;
      process.nextTick(function(){
        calls.push('after');
        if (ctx.currentTest) {
          calls.push('after test ' + ctx.currentTest.title + ' ' + ctx.currentTest.state);
        }
        done();
      })
    })
  })
})
