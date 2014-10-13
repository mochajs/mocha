describe('require test', function(){
  it('should require args in order', function(){
    var req = global.required;
    req.indexOf('a.js').should.equal(0);
    req.indexOf('b.coffee').should.equal(1);
    req.indexOf('c.js').should.equal(2);
    req.indexOf('d.coffee').should.equal(3);
  })
});
