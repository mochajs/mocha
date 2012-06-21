
var mocha = require('../')

describe('pending tests', function() {
  var oldAddTest
    , latestTestIsPending
    , allTests

  beforeEach(function() {
    allTests = [];
    latestTestIsPending = false;
    oldAddTest = mocha.Suite.prototype.addTest;
    mocha.Suite.prototype.addTest = function(test) {
      allTests.push(test);
      latestTestIsPending = !!test.pending;
    };
  });

  afterEach(function() {
    mocha.Suite.prototype.addTest = oldAddTest;
  });

  describe('When calling xit', function() {
    it('should add a new pending test', function() {
      xit('blabla', function() {});
      latestTestIsPending.should.equal(true);
    });
  });

  describe('When calling it with no function', function() {
    it('should add a new pending test', function() {
      xit('blabla');
      latestTestIsPending.should.equal(true);
    });
  });

  describe('When calling xdescribe with only it calls', function() {
    beforeEach(function() {
      xdescribe('bla', function() {
        it('abc', function() {});
        it('def');
        xit('ghi', function() {});
      });
    });

    it('should add tests', function() {
      allTests.length.should.equal(3);
    });

    it('should only add pending tests', function() {
      allTests.every(function(test) {
        return !!test.pending;
      }).should.equal(true);
    });
  });

  describe('When calling xdescribe with nested describes', function() {
    beforeEach(function() {
      xdescribe('bla', function() {
        describe('nested', function() {
          it('abc', function() {});
        });
      });
    });

    it('should add tests', function() {
      allTests.length.should.equal(1);
    });

    it('should only add pending tests', function() {
      allTests[0].pending.should.equal(true);
    });
  });
});
