
describe('serial', function(){
  describe('nested', function(){
    var calls = [];

    beforeEach(function(){
      calls.push('parent before');
    })

    afterEach(function(){
      calls.push('parent after');
    });

    it('foo', function(){
      calls.should.eql(['parent before']);
      calls.push('foo');
    })

    it('bar', function(){
      calls.should.eql([
          'parent before'
        , 'foo'
        , 'parent after'
        , 'parent before']);
    })
    
    describe('hooks', function(){
      beforeEach(function(){
        calls.push('before');
      })
    
      it('one', function(){
        calls.should.eql([
            'parent before'
          , 'foo'
          , 'parent after'
          , 'parent before'
          , 'parent after'
          , 'parent before'
          , 'before']);
        calls.push('one');
      })
    
      it('two', function(){
        calls.should.eql([
            'parent before'
          , 'foo'
          , 'parent after'
          , 'parent before'
          , 'parent after'
          , 'parent before'
          , 'before'
          , 'one'
          , 'after'
          , 'parent after'
          , 'parent before'
          , 'before']);
        calls.push('two');
      });
    
      afterEach(function(){
        calls.push('after');
      })
    })
  })
})