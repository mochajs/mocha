
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
    
    describe('beforeEach()', function(){
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
          , 'before'
          , 'one'
          , 'after'
          , 'before']);
        calls.push('two');
      });
    
      afterEach(function(){
        calls.push('after');
      })
    })
  })
})