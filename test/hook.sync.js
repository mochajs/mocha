
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
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test two'
        , 'two'
        , 'after'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test three']);
      calls.push('three');
    })

    afterEach(function(){
      calls.push('after');
    })

    after(function(){
      calls.should.eql([
          'parent before'
        , 'before'
        , 'before test one'
        , 'one'
        , 'after'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test two'
        , 'two'
        , 'after'
        , 'parent after'
        , 'parent before'
        , 'before'
        , 'before test three'
        , 'three'
        , 'after'
        , 'parent after']);
    })
  })
})