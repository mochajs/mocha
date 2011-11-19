
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
    })

    it('one', function(){
      calls.should.eql(['parent before', 'before']);
      calls.push('one');
    })

    it('two', function(){
      calls.should.eql([
          'parent before'
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
          'parent before'
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

    afterEach(function(){
      calls.push('after');
    })

    after(function(){
      calls.should.eql([
          'parent before'
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
        , 'parent after']);
    })
  })
})