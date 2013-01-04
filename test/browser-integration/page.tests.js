
describe("Basic page transitions", function() {
  it("should start at the home page", function() {
    page('/');
    expect(document.querySelector('p').innerHTML).to.equal('viewing index');
  });

  it("should visit the contacts page", function() {
    page('/contact');
    expect(document.querySelector('p').innerHTML).to.equal('viewing contact');
  });

  it("should have a failing test", function() {
    expect(document.querySelector('p').innerHTML).to.equal('not this');
  });

  describe("A nested suite", function() {
    it('should start again', function(done) {
      page('/');
      setTimeout(done, 1000);
    });
  });
});


describe("Another suite", function() {
  it('should start again', function() {
    page('/');
  });
});
