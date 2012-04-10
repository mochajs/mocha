describe('grep', function() {
  it('should add regex to mocha options', function() {
    var re = new RegExp('grep');

    function reEqual(r1, r2){
      return r1.source === r2.source
             && r1.global === r2.global
             && r1.ignoreCase === r2.ignoreCase
             && r1.multiline === r2.multiline;
    }

    assert(reEqual(runner._grep, re));

  });
});
