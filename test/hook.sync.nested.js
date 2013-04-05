
describe('serial', function(){
  describe('nested', function(){
    var calls = [];

    beforeEach(function(){
      calls.push('parent before');
      if (this.currentTest) {
        calls.push('parent before test ' + this.currentTest.title);
      }
    })

    afterEach(function(){
      calls.push('parent after');
    });

    it('foo', function(){
      calls.should.eql([
          'parent before'
        , 'parent before test foo']);
      calls.push('foo');
    })

    it('bar', function(){
      calls.should.eql([
          'parent before'
        , 'parent before test foo'
        , 'foo'
        , 'parent after'
        , 'parent before'
        , 'parent before test bar']);
    })

    describe('hooks', function(){
      beforeEach(function(){
        calls.push('before');
        if (this.currentTest) {
          calls.push('before test ' + this.currentTest.title);
        }
      })

      it('one', function(){
        calls.should.eql([
            'parent before'
          , 'parent before test foo'
          , 'foo'
          , 'parent after'
          , 'parent before'
          , 'parent before test bar'
          , 'parent after'
          , 'parent before'
          , 'parent before test one'
          , 'before'
          , 'before test one']);
        calls.push('one');
      })

      it('two', function(){
        calls.should.eql([
            'parent before'
          , 'parent before test foo'
          , 'foo'
          , 'parent after'
          , 'parent before'
          , 'parent before test bar'
          , 'parent after'
          , 'parent before'
          , 'parent before test one'
          , 'before'
          , 'before test one'
          , 'one'
          , 'after'
          , 'parent after'
          , 'parent before'
          , 'parent before test two'
          , 'before'
          , 'before test two']);
        calls.push('two');
      });

      afterEach(function(){
        calls.push('after');
      })
    })
  })
})
