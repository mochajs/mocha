
describe('timeouts', function(){
  it('should fail on timeout', function(done){
    setTimeout(done, 3000);
  })

  it('should pass test A after timeout', function(done){
    setTimeout(done, 1000);
  })
  it('should pass run test B after timeout', function(done){
    setTimeout(done, 1000);
  })

  it('should fail on timeout again', function(done){
    setTimeout(done, 3000);
  })
})

describe('timeouts', function(){

  describe('timeouts', function(){
    it('should fail on timeout', function(done){
      setTimeout(done, 3000);
    })

    it('should pass run test A after timeout', function(done){
      setTimeout(done, 1000);
    })
  })

  describe('timeouts', function(){
    it('should fail on timeout', function(done){
      setTimeout(done, 3000);
    })

    it('should pass test A after timeout', function(done){
      setTimeout(done, 1000);
    })
  })


})


// Known issue: #270
// This will currently fail and stop further execution of mocha entirely.
// describe('timeouts-beforeEach', function(){
//   var waitTime = 2500;
//   beforeEach(function(done){
//     setTimeout(done, waitTime);
//     waitTime -= 1000;
//   })
//
//   it('should error on timeout during before each', function(done){
//
//   })
//
//   it('should pass without on timeout during before each', function(done){
//
//   })
// })