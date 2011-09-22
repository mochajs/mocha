
describe('serial', function(){
  var calls = [];

  beforeEach(function(){
    // not hit
    calls.push('parent before');
  })

  afterEach(function(){
    // not hit
    calls.push('parent after');
  })

  describe('beforeEach()', function(){
    beforeEach(function(){
      calls.push('before');
    })

    it('one', function(){
      calls.should.eql(['before']);
      calls.push('one');
    })

    it('two', function(){
      calls.should.eql([
          'before'
        , 'one'
        , 'after'
        , 'before']);
      calls.push('two');
    })

    it('three', function(){
      calls.should.eql([
          'before'
        , 'one'
        , 'after'
        , 'before'
        , 'two'
        , 'after'
        , 'before']);
      calls.push('three');
    })

    afterEach(function(){
      calls.push('after');
    })

    after(function(){
      calls.should.eql([
          'before'
        , 'one'
        , 'after'
        , 'before'
        , 'two'
        , 'after'
        , 'before'
        , 'three'
        , 'after']);
    })
  })
})