
describe('serial', function(){
  describe('before', function(){
    var calls = [];

    before(function(test){
      calls.push(test.fullTitle());
    });

    it('one', function(){
      console.log(calls);
    });

  });
});