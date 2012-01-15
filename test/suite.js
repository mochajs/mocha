var mocha = require('../')
  , Suite = mocha.Suite;

describe('Suite', function() {
  describe('when initialized', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    it('is initialized with a title', function() {
      this.suite.title.should.equal('A Suite');
    });

    it('the suites array is empty', function() {
      this.suite.suites.should.be.empty;
    });

    it('the tests array is empty', function() {
      this.suite.tests.should.be.empty;
    });

    it('the _beforeEach array is empty', function() {
      this.suite._beforeEach.should.be.empty;
    });

    it('the _beforeAll array is empty', function() {
      this.suite._beforeEach.should.be.empty;
    });

    it('the _afterEach array is empty', function() {
      this.suite._afterEach.should.be.empty;
    });

    it('the _afterAll array is empty', function() {
      this.suite._afterAll.should.be.empty;
    });

    it('the root is false', function() {
      this.suite.root.should.be.false;
    });

    it('the _timeout is 2000', function() {
      this.suite._timeout.should.equal(2000);
    });

    it('the _bail is false', function() {
      this.suite._bail.should.be.false;
    });
  });

  describe('cloning', function() {
    beforeEach(function() {
      this.suite = new Suite('To be cloned');
      this.suite._timeout = 3043;
      this.suite._bail = true;
      this.suite.suites.push(1);
      this.suite.tests.push('hello');
      this.suite._beforeEach.push(2);
      this.suite._beforeAll.push(3);
      this.suite._afterEach.push(4);
      this.suite._afterAll.push(5);
    });

    describe('copies', function() {
      it('the title', function() {
        this.suite.clone().title.should.equal('To be cloned');
      });

      it('the timeout value', function() {
        this.suite.clone().timeout().should.equal(3043);
      });

      it('the bail value', function() {
        this.suite.clone().bail().should.be.true;
      });
    });

    describe('does NOT copy', function() {
      it('the values from the suites array', function() {
        this.suite.clone().suites.should.be.empty;
      });

      it('the values from the tests array', function() {
        this.suite.clone().tests.should.be.empty;
      });

      it('the values from the _beforeEach array', function() {
        this.suite.clone()._beforeEach.should.be.empty;
      });

      it('the values from the _beforeAll array', function() {
        this.suite.clone()._beforeAll.should.be.empty;
      });

      it('the values from the _afterEach array', function() {
        this.suite.clone()._afterEach.should.be.empty;
      });

      it('the values from the _afterAll array', function() {
        this.suite.clone()._afterAll.should.be.empty;
      });
    });

  });
});
