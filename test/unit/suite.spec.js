'use strict';

var mocha = require('../../lib/mocha');
var Suite = mocha.Suite;
var Test = mocha.Test;

function supportsFunctionNames() {
  // eslint-disable-next-line no-extra-parens
  return function foo() {}.name === 'foo';
}

describe('Suite', function() {
  describe('.clone()', function() {
    beforeEach(function() {
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

    it('should copy the title', function() {
      expect(this.suite.clone().title, 'to be', 'To be cloned');
    });

    it('should copy the timeout value', function() {
      expect(this.suite.clone().timeout(), 'to be', 3043);
    });

    it('should copy the slow value', function() {
      expect(this.suite.clone().slow(), 'to be', 101);
    });

    it('should copy the bail value', function() {
      expect(this.suite.clone().bail(), 'to be', true);
    });

    it('should not copy the values from the suites array', function() {
      expect(this.suite.clone().suites, 'to be empty');
    });

    it('should not copy the values from the tests array', function() {
      expect(this.suite.clone().tests, 'to be empty');
    });

    it('should not copy the values from the _beforeEach array', function() {
      expect(this.suite.clone()._beforeEach, 'to be empty');
    });

    it('should not copy the values from the _beforeAll array', function() {
      expect(this.suite.clone()._beforeAll, 'to be empty');
    });

    it('should not copy the values from the _afterEach array', function() {
      expect(this.suite.clone()._afterEach, 'to be empty');
    });

    it('should not copy the values from the _afterAll array', function() {
      expect(this.suite.clone()._afterAll, 'to be empty');
    });
  });

  describe('.timeout()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when no argument is passed', function() {
      it('should return the timeout value', function() {
        expect(this.suite.timeout(), 'to be', 2000);
      });
    });

    describe('when argument is passed', function() {
      it('should return the Suite object', function() {
        var newSuite = this.suite.timeout(5000);
        expect(newSuite.timeout(), 'to be', 5000);
      });
    });
  });

  describe('.slow()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when given a string', function() {
      it('should parse it', function() {
        this.suite.slow('5 seconds');
        expect(this.suite.slow(), 'to be', 5000);
      });
    });

    describe('when no argument is passed', function() {
      it('should return the slow value', function() {
        expect(this.suite.slow(), 'to be', 75);
      });
    });

    describe('when argument is passed', function() {
      it('should return the Suite object', function() {
        var newSuite = this.suite.slow(5000);
        expect(newSuite.slow(), 'to be', 5000);
      });
    });
  });

  describe('.bail()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
      this.suite._bail = true;
    });

    describe('when no argument is passed', function() {
      it('should return the bail value', function() {
        expect(this.suite.bail(), 'to be', true);
      });
    });

    describe('when argument is passed', function() {
      it('should return the Suite object', function() {
        var newSuite = this.suite.bail(false);
        expect(newSuite.bail(), 'to be', false);
      });
    });
  });

  describe('.beforeAll()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function() {
      it('adds it to _beforeAll', function() {
        var fn = function() {};
        this.suite.beforeAll(fn);

        expect(this.suite._beforeAll, 'to have length', 1);
        var beforeAllItem = this.suite._beforeAll[0];
        expect(beforeAllItem.title, 'to match', /^"before all" hook/);
        expect(beforeAllItem.fn, 'to be', fn);
      });

      it('appends title to hook', function() {
        var fn = function() {};
        this.suite.beforeAll('test', fn);

        expect(this.suite._beforeAll, 'to have length', 1);
        var beforeAllItem = this.suite._beforeAll[0];
        expect(beforeAllItem.title, 'to be', '"before all" hook: test');
        expect(beforeAllItem.fn, 'to be', fn);
      });

      it('uses function name if available', function() {
        if (!supportsFunctionNames()) {
          this.skip();
          return;
        }
        function namedFn() {}
        this.suite.beforeAll(namedFn);
        var beforeAllItem = this.suite._beforeAll[0];
        expect(beforeAllItem.title, 'to be', '"before all" hook: namedFn');
        expect(beforeAllItem.fn, 'to be', namedFn);
      });
    });
  });

  describe('.afterAll()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function() {
      it('adds it to _afterAll', function() {
        var fn = function() {};
        this.suite.afterAll(fn);

        expect(this.suite._afterAll, 'to have length', 1);
        var afterAllItem = this.suite._afterAll[0];
        expect(afterAllItem.title, 'to match', /^"after all" hook/);
        expect(afterAllItem.fn, 'to be', fn);
      });
      it('appends title to hook', function() {
        var fn = function() {};
        this.suite.afterAll('test', fn);

        expect(this.suite._afterAll, 'to have length', 1);
        var beforeAllItem = this.suite._afterAll[0];
        expect(beforeAllItem.title, 'to be', '"after all" hook: test');
        expect(beforeAllItem.fn, 'to be', fn);
      });

      it('uses function name if available', function() {
        if (!supportsFunctionNames()) {
          this.skip();
          return;
        }
        function namedFn() {}
        this.suite.afterAll(namedFn);
        var afterAllItem = this.suite._afterAll[0];
        expect(afterAllItem.title, 'to be', '"after all" hook: namedFn');
        expect(afterAllItem.fn, 'to be', namedFn);
      });
    });
  });

  describe('.beforeEach()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function() {
      it('adds it to _beforeEach', function() {
        var fn = function() {};
        this.suite.beforeEach(fn);

        expect(this.suite._beforeEach, 'to have length', 1);
        var beforeEachItem = this.suite._beforeEach[0];
        expect(beforeEachItem.title, 'to match', /^"before each" hook/);
        expect(beforeEachItem.fn, 'to be', fn);
      });

      it('appends title to hook', function() {
        var fn = function() {};
        this.suite.beforeEach('test', fn);

        expect(this.suite._beforeEach, 'to have length', 1);
        var beforeAllItem = this.suite._beforeEach[0];
        expect(beforeAllItem.title, 'to be', '"before each" hook: test');
        expect(beforeAllItem.fn, 'to be', fn);
      });

      it('uses function name if available', function() {
        if (!supportsFunctionNames()) {
          this.skip();
          return;
        }
        function namedFn() {}
        this.suite.beforeEach(namedFn);
        var beforeEachItem = this.suite._beforeEach[0];
        expect(beforeEachItem.title, 'to be', '"before each" hook: namedFn');
        expect(beforeEachItem.fn, 'to be', namedFn);
      });
    });
  });

  describe('.afterEach()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('wraps the passed in function in a Hook', function() {
      it('adds it to _afterEach', function() {
        var fn = function() {};
        this.suite.afterEach(fn);

        expect(this.suite._afterEach, 'to have length', 1);
        var afterEachItem = this.suite._afterEach[0];
        expect(afterEachItem.title, 'to match', /^"after each" hook/);
        expect(afterEachItem.fn, 'to be', fn);
      });

      it('appends title to hook', function() {
        var fn = function() {};
        this.suite.afterEach('test', fn);

        expect(this.suite._afterEach, 'to have length', 1);
        var beforeAllItem = this.suite._afterEach[0];
        expect(beforeAllItem.title, 'to be', '"after each" hook: test');
        expect(beforeAllItem.fn, 'to be', fn);
      });

      it('uses function name if available', function() {
        if (!supportsFunctionNames()) {
          this.skip();
          return;
        }
        function namedFn() {}
        this.suite.afterEach(namedFn);
        var afterEachItem = this.suite._afterEach[0];
        expect(afterEachItem.title, 'to be', '"after each" hook: namedFn');
        expect(afterEachItem.fn, 'to be', namedFn);
      });
    });
  });

  describe('.addSuite()', function() {
    beforeEach(function() {
      this.first = new Suite('First suite');
      this.first.timeout(4002);
      this.first.slow(200);
      this.second = new Suite('Second suite');
      this.first.addSuite(this.second);
    });

    it('sets the parent on the added Suite', function() {
      expect(this.second.parent, 'to be', this.first);
    });

    it('copies the timeout value', function() {
      expect(this.second.timeout(), 'to be', 4002);
    });

    it('copies the slow value', function() {
      expect(this.second.slow(), 'to be', 200);
    });

    it('adds the suite to the suites collection', function() {
      expect(this.first.suites, 'to have length', 1);
      expect(this.first.suites[0], 'to be', this.second);
    });

    it('treats suite as pending if its parent is pending', function() {
      this.first.pending = true;
      expect(this.second.isPending(), 'to be', true);
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
  //     expect(this.test.parent, 'to be', this.suite);
  //   });
  //
  //   it('copies the timeout value', function(){
  //     expect(this.test.timeout(), 'to be', 4002);
  //   });
  //
  //   it('adds the test to the tests collection', function(){
  //     expect(this.suite.tests, 'to have length', 1);
  //     expect(this.suite.tests[0], 'to be', this.test);
  //   });
  // });

  describe('.fullTitle()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when there is no parent', function() {
      it('returns the suite title', function() {
        expect(this.suite.fullTitle(), 'to be', 'A Suite');
      });
    });

    describe('when there is a parent', function() {
      it("returns the combination of parent's and suite's title", function() {
        var parentSuite = new Suite('I am a parent');
        parentSuite.addSuite(this.suite);
        expect(this.suite.fullTitle(), 'to be', 'I am a parent A Suite');
      });
    });
  });

  describe('.titlePath()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when there is no parent', function() {
      it('returns the suite title', function() {
        expect(this.suite.titlePath(), 'to equal', ['A Suite']);
      });
    });

    describe('when there is a parent', function() {
      describe('the parent is the root suite', function() {
        it('returns the suite title', function() {
          var parentSuite = new Suite('');
          parentSuite.addSuite(this.suite);
          expect(this.suite.titlePath(), 'to equal', ['A Suite']);
        });
      });

      describe('the parent is not the root suite', function() {
        it("returns the concatenation of parent's and suite's title", function() {
          var parentSuite = new Suite('I am a parent');
          parentSuite.addSuite(this.suite);
          expect(this.suite.titlePath(), 'to equal', [
            'I am a parent',
            'A Suite'
          ]);
        });
      });
    });
  });

  describe('.total()', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when there are no nested suites or tests', function() {
      it('should return 0', function() {
        expect(this.suite.total(), 'to be', 0);
      });
    });

    describe('when there are several tests in the suite', function() {
      it('should return the number', function() {
        this.suite.addTest(new Test('a child test'));
        this.suite.addTest(new Test('another child test'));
        expect(this.suite.total(), 'to be', 2);
      });
    });
  });

  describe('.eachTest(fn)', function() {
    beforeEach(function() {
      this.suite = new Suite('A Suite');
    });

    describe('when there are no nested suites or tests', function() {
      it('should return 0', function() {
        var n = 0;
        function fn() {
          n++;
        }
        this.suite.eachTest(fn);
        expect(n, 'to be', 0);
      });
    });

    describe('when there are several tests in the suite', function() {
      it('should return the number', function() {
        this.suite.addTest(new Test('a child test'));
        this.suite.addTest(new Test('another child test'));

        var n = 0;
        function fn() {
          n++;
        }
        this.suite.eachTest(fn);
        expect(n, 'to be', 2);
      });
    });

    describe('when there are several levels of nested suites', function() {
      it('should return the number', function() {
        this.suite.addTest(new Test('a child test'));
        var suite = new Suite('a child suite');
        suite.addTest(new Test('a test in a child suite'));
        this.suite.addSuite(suite);

        var n = 0;
        function fn() {
          n++;
        }
        this.suite.eachTest(fn);
        expect(n, 'to be', 2);
      });
    });
  });

  describe('initialization', function() {
    /* eslint no-new: off */
    it("should throw an error if the title isn't a string", function() {
      expect(function() {
        new Suite(undefined, 'root');
      }, 'to throw');

      expect(function() {
        new Suite(function() {}, 'root');
      }, 'to throw');
    });

    it('should not throw if the title is a string', function() {
      expect(function() {
        new Suite('Bdd suite', 'root');
      }, 'not to throw');
    });
  });
});

describe('Test', function() {
  describe('initialization', function() {
    it("should throw an error if the title isn't a string", function() {
      expect(function() {
        new Test(function() {});
      }, 'to throw');

      expect(function() {
        new Test(undefined, function() {});
      }, 'to throw');
    });

    it('should not throw if the title is a string', function() {
      expect(function() {
        new Test('test-case', function() {});
      }, 'not to throw');
    });
  });
});
