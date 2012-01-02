
describe('Context', function(){
  var prev;

  beforeEach(function(){
    this.name = 'Tobi';
  })

  afterEach(function(){
    this.name.should.equal('Tobi');
    prev = this;
  })

  it('should be maintained between hooks', function(){
    this.name.should.equal('Tobi');
  })

  it('should be unique to the test-case', function(){
    this.should.not.equal(prev);
  })

  describe('when async', function(){
    var prev;

    beforeEach(function(done){
      this.name = 'Tobi';
      done();
    })

    afterEach(function(done){
      this.name.should.equal('Tobi');
      prev = this;
      done();
    })

    it('should be maintained between hooks', function(done){
      this.name.should.equal('Tobi');
      done();
    })

    it('should be unique to the test-case', function(done){
      this.should.not.equal(prev);
      done();
    })
  })
})