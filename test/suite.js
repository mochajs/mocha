
var mocha = require('../')
  , Context = mocha.Context
  , Suite = mocha.Suite
  , Test = mocha.Test;

describe('Suite', function(){
  describe('.clone()', function(){
    beforeEach(function(){
      this.suite = new Suite('To be cloned');
      this.suite._timeout = 3043;
      this.suite._slow = 101;
      this.suite._bail = true;
      this.suite.suites.push(1);
      this.suite.tests.push('hello');
      this.suite._beforeEach.push(2);
      this.suite._beforeAll.push(3);
      this.suite._afterEach.push(4);
      this.suite._afterAll.push(5);
    });

    it('should copy the title', function(){
      this.suite.clone().title.should.equal('To be cloned');
    });

    it('should copy the timeout value', function(){
      this.suite.clone().timeout().should.equal(3043);
    });

    it('should copy the slow value', function(){
      this.suite.clone().slow().should.equal(101);
    });

    it('should copy the bail value', function(){
      this.suite.clone().bail().should.be.true;
    });

    it('should not copy the values from the suites array', function(){
      this.suite.clone().suites.should.be.empty;
    });

    it('should not copy the values from the tests array', function(){
      this.suite.clone().tests.should.be.empty;
    });

    it('should not copy the values from the _beforeEach array', function(){
      this.suite.clone()._beforeEach.should.be.empty;
    });

    it('should not copy the values from the _beforeAll array', function(){
      this.suite.clone()._beforeAll.should.be.empty;
    });

    it('should not copy the values from the _afterEach array', function(){
      this.suite.clone()._afterEach.should.be.empty;
    });

    it('should not copy the values from the _afterAll array', function(){
      this.suite.clone()._afterAll.should.be.empty;
    });
  });

  describe('.timeout()', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when no argument is passed', function(){
      it('should return the timeout value', function(){
        this.suite.timeout().should.equal(2000);
      });
    });

    describe('when argument is passed', function(){
      it('should return the Suite object', function(){
        var newSuite = this.suite.timeout(5000);
        newSuite.timeout().should.equal(5000);
      });
    });
  });

  describe('.slow()', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when given a string', function(){
      it('should parse it', function(){
        this.suite.slow('5 seconds');
        this.suite.slow().should.equal(5000);
      })
    })

    describe('when no argument is passed', function(){
      it('should return the slow value', function(){
        this.suite.slow().should.equal(75);
      });
    });

    describe('when argument is passed', function(){
      it('should return the Suite object', function(){
        var newSuite = this.suite.slow(5000);
        newSuite.slow().should.equal(5000);
      });
    });
  });

  describe('.bail()', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
      this.suite._bail = true
    });

    describe('when no argument is passed', function(){
      it('should return the bail value', function(){
        this.suite.bail().should.be.true;
      });
    });

    describe('when argument is passed', function(){
      it('should return the Suite object', function(){
        var newSuite = this.suite.bail(false);
        newSuite.bail().should.be.false;
      });
    });
  });

  describe('.beforeAll()', function(){
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

  describe('.afterAll()', function(){
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

  describe('.beforeEach()', function(){
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

  describe('.afterEach()', function(){
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

  describe('.addSuite()', function(){
    beforeEach(function(){
      this.first = new Suite('First suite');
      this.first.timeout(4002);
      this.first.slow(200);
      this.second = new Suite('Second suite');
      this.first.addSuite(this.second);
    });

    it('sets the parent on the added Suite', function(){
      this.second.parent.should.equal(this.first);
    });

    it('copies the timeout value', function(){
      this.second.timeout().should.equal(4002);
    });

    it('copies the slow value', function(){
      this.second.slow().should.equal(200);
    });

    it('adds the suite to the suites collection', function(){
      this.first.suites.should.have.length(1);
      this.first.suites[0].should.equal(this.second);
    });
  });

  // describe('.addTest()', function(){
  //   beforeEach(function(){
  //     this.suite = new Suite('A Suite', new Context);
  //     this.suite.timeout(4002);
  //     this.test = new Test('test');
  //     this.suite.addTest(this.test);
  //   });
  //
  //   it('sets the parent on the added test', function(){
  //     this.test.parent.should.equal(this.suite);
  //   });
  //
  //   it('copies the timeout value', function(){
  //     this.test.timeout().should.equal(4002);
  //   });
  //
  //   it('adds the test to the tests collection', function(){
  //     this.suite.tests.should.have.length(1);
  //     this.suite.tests[0].should.equal(this.test);
  //   });
  // });

  describe('.fullTitle()', function(){
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

  describe('.total()', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when there are no nested suites or tests', function(){
      it('should return 0', function(){
        this.suite.total().should.equal(0);
      });
    });

    describe('when there are several tests in the suite', function(){
      it('should return the number', function(){
        this.suite.addTest(new Test('a child test'));
        this.suite.addTest(new Test('another child test'));
        this.suite.total().should.equal(2);
      });
    });
  });

  describe('.eachTest(fn)', function(){
    beforeEach(function(){
      this.suite = new Suite('A Suite');
    });

    describe('when there are no nested suites or tests', function(){
      it('should return 0', function(){
        var n = 0;
        function fn(){ n++; }
        this.suite.eachTest(fn);
        n.should.equal(0);
      });
    });

    describe('when there are several tests in the suite', function(){
      it('should return the number', function(){
        this.suite.addTest(new Test('a child test'));
        this.suite.addTest(new Test('another child test'));

        var n = 0;
        function fn(){ n++; }
        this.suite.eachTest(fn);
        n.should.equal(2);
      });
    });

    describe('when there are several levels of nested suites', function(){
      it('should return the number', function(){
        this.suite.addTest(new Test('a child test'));
        var suite = new Suite('a child suite');
        suite.addTest(new Test('a test in a child suite'));
        this.suite.addSuite(suite);

        var n = 0;
        function fn(){ n++; }
        this.suite.eachTest(fn);
        n.should.equal(2);
      });
    });

  });
});
