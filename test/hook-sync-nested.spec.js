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
      if (this.currentTest) {
        calls.push('parent after test ' + this.currentTest.title + ' ' + this.currentTest.state);
      }
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
        , 'parent after test foo passed'
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
          , 'parent after test foo passed'
          , 'parent before'
          , 'parent before test bar'
          , 'parent after'
          , 'parent after test bar passed'
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
          , 'parent after test foo passed'
          , 'parent before'
          , 'parent before test bar'
          , 'parent after'
          , 'parent after test bar passed'
          , 'parent before'
          , 'parent before test one'
          , 'before'
          , 'before test one'
          , 'one'
          , 'after'
          , 'after test one passed'
          , 'parent after'
          , 'parent after test one passed'
          , 'parent before'
          , 'parent before test two'
          , 'before'
          , 'before test two']);
        calls.push('two');
      });

      afterEach(function(){
        calls.push('after');
        if (this.currentTest) {
          calls.push('after test ' + this.currentTest.title + ' ' + this.currentTest.state);
        }
      })
    })
  })
})
