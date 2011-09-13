
describe('serial', function(){
  describe('nested', function(){
    var calls = [];

    beforeEach(function(test){
      calls.push('parent before ' + test.title);
    });

    afterEach(function(test){
      calls.push('parent after ' + test.title);
    });

    it('foo', function(){
      calls.should.eql([
          'before one'
        , 'after one'
        , 'before two'
        , 'after two'
        , 'before three'
        , 'after three'
        , 'parent before foo']);
    });

    it('bar', function(){
      calls.should.eql([
          'before one'
        , 'after one'
        , 'before two'
        , 'after two'
        , 'before three'
        , 'after three'
        , 'parent before foo'
        , 'parent after foo'
        , 'parent before bar']);
    });

    describe('beforeEach()', function(){
      beforeEach(function(test){
        calls.push('before ' + test.title);
      });

      it('one', function(){
        calls.should.eql(['before one']);
      });

      it('two', function(){
        calls.should.eql([
            'before one'
          , 'after one'
          , 'before two']);
      });

      it('three', function(){
        calls.should.eql([
            'before one'
          , 'after one'
          , 'before two'
          , 'after two'
          , 'before three']);
      });

      afterEach(function(test){
        calls.push('after ' + test.title);
      });
    });
  });
});