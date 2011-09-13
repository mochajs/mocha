
describe('serial', function(){
  describe('beforeEach()', function(){
    var calls = [];

    beforeEach(function(test){
      calls.push(test.fullTitle());
    });

    it('one', function(){
      calls.should.eql(['serial beforeEach() one']);
    });

    it('two', function(){
      calls.should.eql([
          'serial beforeEach() one'
        , 'serial beforeEach() two']);
    });

    it('three', function(){
      calls.should.eql([
          'serial beforeEach() one'
        , 'serial beforeEach() two'
        , 'serial beforeEach() three']);
    });
  });
});