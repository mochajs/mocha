describe('serial', function(){
  var calls = [];

  beforeEach(function(){
    calls.push('parent before');
  })

  afterEach(function(){
    calls.push('parent after');
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
        , 'before'
        , 'before test one']);
      calls.push('one');
    })

    it('two', function(){
      calls.should.eql([
          'parent before'
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
          'parent before'
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

    afterEach(function(){
      calls.push('after');
      if (this.currentTest) {
        calls.push('after test ' + this.currentTest.title + ' ' + this.currentTest.state);
      }
    })

    after(function(){
      calls.should.eql([
          'parent before'
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
        , 'parent after']);
    })
  })
})
