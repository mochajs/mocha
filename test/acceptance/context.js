
describe('Context', function(){
  var prev;

  before(function(){
    this.age = 2;
  })

  after(function(){
    this.age.should.equal(2);
    this.name.should.equal('Tobi');
    this.inspect().should.equal('{\n  "age": 2,\n  "name": "Tobi"\n}');
  })

  beforeEach(function(){
    this.name = 'Tobi';
    this.age.should.equal(2);
  })

  afterEach(function(){
    this.name.should.equal('Tobi');
    prev = this;
  })

  it('should be maintained between hooks', function(){
    this.name.should.equal('Tobi');
    this.age.should.equal(2);
  })

  it('should provide the same object', function(){
    this.should.equal(prev);
  })

  describe('when async', function(){
    var prev;

    beforeEach(function(done){
      this.name = 'Tobi';
      this.age.should.equal(2);
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

    it('should provide the same object', function(done){
      this.should.equal(prev);
      done();
    })
  })
})