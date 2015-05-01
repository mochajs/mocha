var n = 30;
while (n--) {
  describe('Array ' + n, function(){
    var arr;

    beforeEach(function(){
      arr = [1,2,3];
    })

    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        assert(-1 == arr.indexOf(5));
      })

      it('should return the correct index when the value is present', function(done){
        assert(0 == arr.indexOf(1));
        assert(1 == arr.indexOf(2));
        done();
      })
    })
  })
}

describe('something', function(){
  it('should provide a useful error', function(done){
    setTimeout(function(){
      throw new Error('boom');
      done();
    }, 1);
  })

  it('should provide an even better error on phantomjs', function(done){
    setTimeout(function(){
      var AssertionError = function(message, actual, expected) {
        this.message = message;
        this.actual = actual;
        this.expected = expected;
        this.showDiff = true;
      };
      AssertionError.prototype = Object.create(Error.prototype);
      AssertionError.prototype.name = 'AssertionError';
      AssertionError.prototype.constructor = AssertionError;

      mocha.throwError(new AssertionError('kabooom', 'text with a typo', 'text without a typo'));
      done();
    }, 1);
  })
})
