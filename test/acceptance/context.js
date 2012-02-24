
describe('Context', function(){
  beforeEach(function(){
    this.calls = ['before'];
  })

  describe('nested', function(){
    beforeEach(function(){
      this.calls.push('before two');
    })

    it('should work', function(){
      this.calls.should.eql(['before', 'before two']);
      this.calls.push('test');
    })

    after(function(){
      this.calls.should.eql(['before', 'before two', 'test']);
      this.calls.push('after two');
    })
  })

  after(function(){
    this.calls.should.eql(['before', 'before two', 'test', 'after two']);
  })
})