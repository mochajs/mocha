var mocha = require('..');
var utils = mocha.utils;

describe('utils', function() {
  describe('.clean()', function() {
    var clean = utils.clean;
    it('should remove the wrapping function declaration', function() {
      clean('function  (one, two, three)  {\n//code\n}').should.equal('//code');
    });

    it('should remove space character indentation from the function body', function() {
      clean('  //line1\n    //line2').should.equal('//line1\n  //line2');
    });

    it('should remove tab character indentation from the function body', function() {
      clean('\t//line1\n\t\t//line2').should.equal('//line1\n\t//line2');
    });
  });

  describe('.isBuffer()', function() {
    var isBuffer = utils.isBuffer;
    it('should test if object is a Buffer', function() {
      isBuffer(new Buffer([0x01])).should.equal(true);
      isBuffer({}).should.equal(false);
    })
  });

  describe('.map()', function() {
    var map = utils.map;
    it('should behave same as Array.prototype.map', function() {
      var arr = [1, 2, 3];
      map(arr, JSON.stringify).should.eql(arr.map(JSON.stringify));
    });

    it('should call the callback with 3 arguments[currentValue, index, array]', function() {
      var index = 0;
      map([1, 2, 3], function(e, i, arr) {
        e.should.equal(arr[index]);
        i.should.equal(index++);
      })
    });

    it('should apply with the given scope', function() {
      var scope = {};
      map(['a', 'b', 'c'], function() {
        this.should.equal(scope);
      }, scope);
    });
  });

  describe('.parseQuery()', function() {
    var parseQuery = utils.parseQuery;
    it('should get queryString and return key-value object', function() {
      parseQuery('?foo=1&bar=2&baz=3').should.eql({
        foo: 1,
        bar: 2,
        baz: 3
      });

      parseQuery('?r1=^@(?!.*\\)$)&r2=m{2}&r3=^co.*').should.eql({
        r1: '^@(?!.*\\)$)',
        r2: 'm{2}',
        r3: '^co.*'
      });
    })
  });
});
