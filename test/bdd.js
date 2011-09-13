
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      [1,2,3].indexOf(5).should.equal(-1);
      [1,2,3].indexOf(0).should.equal(-1);
    })
    
    it('should return the correct index when the value is present', function(){
      [1,2,3].indexOf(1).should.equal(0);
      [1,2,3].indexOf(2).should.equal(1);
      [1,2,3].indexOf(3).should.equal(2);
    })
  })
})
