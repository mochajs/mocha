describe('integer primitives', function(){
  describe('arithmetic', function(){
    it('should add', function(){
      expect(1 + 1).to.equal(2);
      expect(2 + 2).to.equal(4);
    })

    it('should subtract', function(){
      expect(1 - 1).to.equal(0);
      expect(2 - 1).to.equal(1);
    })
  })
})

describe('integer primitives', function(){
  describe('arithmetic is not', function(){
    it('should add', function(){
      expect(1 + 1).not.to.equal(3);
      expect(2 + 2).not.to.equal(5);
    })
  })
})

context('test suite', function(){
  beforeEach(function(){
    this.number = 5;
  })

  specify('share a property', function(){
    expect(this.number).to.equal(5);
  })
})
