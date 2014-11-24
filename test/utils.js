var mocha = require('..');
var utils = mocha.utils;
var clean = utils.clean;
var isBuffer = utils.isBuffer;

describe('utils', function() {
  describe('.clean()', function(){
    it('should remove the wrapping function declaration', function(){
      clean('function  (one, two, three)  {\n//code\n}').should.equal('//code');
    });

    it('should remove space character indentation from the function body', function(){
      clean('  //line1\n    //line2').should.equal('//line1\n  //line2');
    });

    it('should remove tab character indentation from the function body', function(){
      clean('\t//line1\n\t\t//line2').should.equal('//line1\n\t//line2');
    });
  });
  describe('.isBuffer()', function(){
    it('should test if object is a Buffer', function() {
      isBuffer(new Buffer([0x01])).should.equal(true);
      isBuffer({}).should.equal(false);
    })
  });
  describe('Array#some', function() {
    function odd(item) { return item % 2 !== 0; }
    it('returns false if no items match', function() {
      utils.some([2, 4, 6], odd).should.eql(false);
    });
    it('returns true if any item matches', function() {
      utils.some([2, 4, 5, 6], odd).should.eql(true);
    });
  });
  describe('Array#indexOf', function() {
    it('returns the index of the first matching item', function() {
      utils.indexOf([2, 4, 6], 6).should.eql(2);
      utils.indexOf([2, 4, 2], 2).should.eql(0);
      utils.indexOf(['hello', 'world'], 'world').should.eql(1);
    });
    it('returns -1 if no item matches', function() {
      utils.indexOf([2, 4, 6], 3).should.eql(-1);
    });
  });
});
