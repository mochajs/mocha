
var mocha = require('..');
var utils = mocha.utils;
var clean = utils.clean;

describe('utils', function(){
  describe('.clean()', function(){
    it('should remove the wrapping function declaration', function(){
      clean('function  (one, two, three)  {\n//code\n}').should.equal('//code');
    })

    it('should remove space character indentation from the function body', function(){
      clean('  //line1\n    //line2').should.equal('//line1\n  //line2');
    })

    it('should remove tab character indentation from the function body', function(){
      clean('\t//line1\n\t\t//line2').should.equal('//line1\n\t//line2');
    })
  })
})
