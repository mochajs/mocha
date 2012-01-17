var mocha = require('../')
  , Suite = mocha.Suite
  , Test = mocha.Test;

describe('Suite', function(){
  describe('when initialized', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    it('is initialized with a title', function(){
      this.suite.title.should.equal('A Suite');
    });

    it('the suites array is empty', function(){
      this.suite.suites.should.be.empty;
    });

    it('the tests array is empty', function(){
      this.suite.tests.should.be.empty;
    });

    it('the _beforeEach array is empty', function(){
      this.suite._beforeEach.should.be.empty;
    });

    it('the _beforeAll array is empty', function(){
      this.suite._beforeEach.should.be.empty;
    });

    it('the _afterEach array is empty', function(){
      this.suite._afterEach.should.be.empty;
    });

    it('the _afterAll array is empty', function(){
      this.suite._afterAll.should.be.empty;
    });

    it('the root is false', function(){
      this.suite.root.should.be.false;
    });

    it('the _timeout is 2000', function(){
      this.suite._timeout.should.equal(2000);
    });

    it('the _bail is false', function(){
      this.suite._bail.should.be.false;
    });
  });

  describe('cloning', function(){
    beforeEach(function(){
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

    describe('copies', function(){
      it('the title', function(){
        this.suite.clone().title.should.equal('To be cloned');
      });

      it('the timeout value', function(){
        this.suite.clone().timeout().should.equal(3043);
      });

      it('the bail value', function(){
        this.suite.clone().bail().should.be.true;
      });
    });

    describe('does NOT copy', function(){
      it('the values from the suites array', function(){
        this.suite.clone().suites.should.be.empty;
      });

      it('the values from the tests array', function(){
        this.suite.clone().tests.should.be.empty;
      });

      it('the values from the _beforeEach array', function(){
        this.suite.clone()._beforeEach.should.be.empty;
      });

      it('the values from the _beforeAll array', function(){
        this.suite.clone()._beforeAll.should.be.empty;
      });

      it('the values from the _afterEach array', function(){
        this.suite.clone()._afterEach.should.be.empty;
      });

      it('the values from the _afterAll array', function(){
        this.suite.clone()._afterAll.should.be.empty;
      });
    });

  });

  describe('timeout', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when no argument is passed', function(){
      it('returns the _timeout value', function(){
        this.suite.timeout().should.equal(2000);
      });
    });

    describe('when argument is passed', function(){
      it('returns the Suite object', function(){
        var newSuite = this.suite.timeout(5000);
        newSuite.timeout().should.equal(5000);
      });
    });
  });

  describe('bail', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
      this.suite._bail = true
    });

    describe('when no argument is passed', function(){
      it('returns the _bail value', function(){
        this.suite.bail().should.be.true;
      });
    });

    describe('when argument is passed', function(){
      it('returns the Suite object', function(){
        var newSuite = this.suite.bail(false);
        newSuite.bail().should.be.false;
      });
    });
  });

  describe('beforeAll', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function(){
      it('adds it to _beforeAll', function(){
        function fn(){}
        this.suite.beforeAll(fn);

        this.suite._beforeAll.should.have.length(1);
        var beforeAllItem = this.suite._beforeAll[0];
        beforeAllItem.title.should.equal('"before all" hook');
        beforeAllItem.fn.should.equal(fn);
      });
    });
  });

  describe('afterAll', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function(){
      it('adds it to _afterAll', function(){
        function fn(){}
        this.suite.afterAll(fn);

        this.suite._afterAll.should.have.length(1);
        var afterAllItem = this.suite._afterAll[0];
        afterAllItem.title.should.equal('"after all" hook');
        afterAllItem.fn.should.equal(fn);
      });
    });
  });

  describe('beforeEach', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function(){
      it('adds it to _beforeEach', function(){
        function fn(){}
        this.suite.beforeEach(fn);

        this.suite._beforeEach.should.have.length(1);
        var beforeEachItem = this.suite._beforeEach[0];
        beforeEachItem.title.should.equal('"before each" hook');
        beforeEachItem.fn.should.equal(fn);
      });
    });
  });

  describe('afterEach', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function(){
      it('adds it to _afterEach', function(){
        function fn(){}
        this.suite.afterEach(fn);

        this.suite._afterEach.should.have.length(1);
        var afterEachItem = this.suite._afterEach[0];
        afterEachItem.title.should.equal('"after each" hook');
        afterEachItem.fn.should.equal(fn);
      });
    });
  });

  describe('addSuite', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
      this.suite.timeout(4002);
      this.suiteToAdd = new Suite('Suite to Add');
      this.suite.addSuite(this.suiteToAdd);
    });

    it('sets the parent on the added Suite', function(){
      this.suiteToAdd.parent.should.equal(this.suite);
    });

    it('copies the timeout value', function(){
      this.suiteToAdd.timeout().should.equal(4002);
    });

    it('adds the suite to the suites collection', function(){
      this.suite.suites.should.have.length(1);
      this.suite.suites[0].should.equal(this.suiteToAdd);
    });
  });

  describe('addTest', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
      this.suite.timeout(4002);
      this.test = new Test('Suite to Add');
      this.suite.addTest(this.test);
    });

    it('sets the parent on the added test', function(){
      this.test.parent.should.equal(this.suite);
    });

    it('copies the timeout value', function(){
      this.test.timeout().should.equal(4002);
    });

    it('adds the test to the tests collection', function(){
      this.suite.tests.should.have.length(1);
      this.suite.tests[0].should.equal(this.test);
    });
  });

  describe('fullTitle', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when there is no parent', function(){
      it('returns the suite title', function(){
        this.suite.fullTitle().should.equal('A Suite');
      });
    });

    describe('when there is a parent', function(){
      it('returns the combination of parent\'s and suite\'s title', function(){
        var parentSuite = new Suite('I am a parent');
        parentSuite.addSuite(this.suite);
        this.suite.fullTitle().should.equal('I am a parent A Suite');
      });
    });
  });

  describe('total', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when there are no other suites or tests under the suite', function(){
      it('returns 0', function(){
        this.suite.total().should.equal(0);
      });
    });

    describe('when there are two tests under the suite', function(){
      it('returns 2', function(){
        this.suite.addTest(new Test('a child test'));
        this.suite.addTest(new Test('another child test'));
        this.suite.total().should.equal(2);
      });
    });
  });
});
