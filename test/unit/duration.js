
describe('durations', function(){
  describe('when slow', function(){
    it('should highlight in red', function(done){
      setTimeout(done, 100);
    })
  })
  
  describe('when reasonable', function(){
    it('should highlight in yellow', function(done){
      setTimeout(done, 50);
    })
  })
  
  describe('when fast', function(){
    it('should highlight in green', function(done){
      setTimeout(done, 10);
    })
  })
})