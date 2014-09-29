// Useful for testing SIGINT handler
// use env.big_number to tune iterations so that you have time to ctrl+c

describe('a load of tests', function(){
  it('should fail the first test', function(){
    throw new Error('this should appear in the summary');
  })

  var iterations = (process.env.big_number || 1e7);
  function work() {
    var a = 0;
    for(var i=0; i<iterations; ++i) {
      a += i;
    }
  }

  function addTest() {
    it('should pass test ' + i, function(){
      work();
    })
  }

  for(var i=0; i<500; ++i) {
    addTest();
  }

})
