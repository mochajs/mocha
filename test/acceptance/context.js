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

describe('Context Siblings', function(){
  beforeEach(function(){
    this.calls = ['before'];
  })

  describe('sequestered sibling', function(){
    beforeEach(function(){
      this.calls.push('before two');
      this.hiddenFromSibling = 'This should be hidden';
    })

    it('should work', function(){
      this.hiddenFromSibling.should.eql('This should be hidden')
    })
  })

  describe('sibling verifiction', function(){
    beforeEach(function(){
      this.calls.push('before sibling');
    })

    it('should not have value set within a sibling describe', function(){
      'This should be hidden'.should.not.eql(this.hiddenFromSibling);
      this.visibleFromTestSibling = 'Visible from test sibling';
    })

    it('should allow test siblings to modify shared context', function(){
      'Visible from test sibling'.should.eql(this.visibleFromTestSibling);
    })

    it('should have reset this.calls before describe', function(){
      this.calls.should.eql(['before', 'before sibling']);
    })
  })

  after(function(){
    this.calls.should.eql(['before', 'before sibling']);
  })

})

describe('timeout()', function(){
  it('should return the timeout', function(){
    this.timeout().should.equal(200);
  });
});
