'use strict';

const Mocha = require('../../lib/mocha');
const {Suite, Test, Context} = Mocha;
const sinon = require('sinon');
const errors = require('../../lib/errors');

function supportsFunctionNames() {
  // eslint-disable-next-line no-extra-parens
  return function foo() {}.name === 'foo';
}

describe('Suite', function () {
  afterEach(function () {
    sinon.restore();
  });

  describe('instance method', function () {
    let suite;

    describe('clone()', function () {
      beforeEach(function () {
        suite = new Suite('To be cloned', {}, true);
        suite._timeout = 3043;
        suite._slow = 101;
        suite._bail = true;
        suite.suites.push(1);
        suite.tests.push('hello');
        suite._beforeEach.push(2);
        suite._beforeAll.push(3);
        suite._afterEach.push(4);
        suite._afterAll.push(5);
      });

      it('should clone the Suite, omitting children', function () {
        expect(suite.clone(), 'to satisfy', {
          title: 'To be cloned',
          _timeout: 3043,
          _slow: 101,
          _bail: true,
          suites: expect.it('to be empty'),
          tests: expect.it('to be empty'),
          _beforeEach: expect.it('to be empty'),
          _beforeAll: expect.it('to be empty'),
          _afterEach: expect.it('to be empty'),
          _afterAll: expect.it('to be empty'),
          root: true
        }).and('not to be', suite);
      });
    });

    describe('reset()', function () {
      beforeEach(function () {
        suite = new Suite('Suite to be reset', function () {});
      });

      it('should reset the `delayed` state', function () {
        suite.delayed = true;
        suite.reset();
        expect(suite.delayed, 'to be', false);
      });

      it('should forward reset to suites and tests', function () {
        const childSuite = new Suite('child suite', suite.context);
        const test = new Test('test', function () {});
        suite.addSuite(childSuite);
        suite.addTest(test);
        const testResetStub = sinon.stub(test, 'reset');
        const suiteResetStub = sinon.stub(childSuite, 'reset');
        suite.reset();
        expect(testResetStub, 'was called once');
        expect(suiteResetStub, 'was called once');
      });

      it('should forward reset to all hooks', function () {
        suite.beforeEach(function () {});
        suite.afterEach(function () {});
        suite.beforeAll(function () {});
        suite.afterAll(function () {});
        sinon.stub(suite.getHooks('beforeEach')[0], 'reset');
        sinon.stub(suite.getHooks('afterEach')[0], 'reset');
        sinon.stub(suite.getHooks('beforeAll')[0], 'reset');
        sinon.stub(suite.getHooks('afterAll')[0], 'reset');

        suite.reset();

        expect(suite.getHooks('beforeEach')[0].reset, 'was called once');
        expect(suite.getHooks('afterEach')[0].reset, 'was called once');
        expect(suite.getHooks('beforeAll')[0].reset, 'was called once');
        expect(suite.getHooks('afterAll')[0].reset, 'was called once');
      });
    });

    describe('timeout()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when no argument is passed', function () {
        it('should return the timeout value', function () {
          expect(suite.timeout(), 'to be', 2000);
        });
      });

      describe('when argument is passed', function () {
        it('should return the Suite object', function () {
          const newSuite = suite.timeout(5000);
          expect(newSuite.timeout(), 'to be', 5000);
        });
      });
    });

    describe('slow()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when given a string', function () {
        it('should parse it', function () {
          suite.slow('5 seconds');
          expect(suite.slow(), 'to be', 5000);
        });
      });

      describe('when no argument is passed', function () {
        it('should return the slow value', function () {
          expect(suite.slow(), 'to be', 75);
        });
      });

      describe('when argument is passed', function () {
        it('should return the Suite object', function () {
          const newSuite = suite.slow(5000);
          expect(newSuite.slow(), 'to be', 5000);
        });
      });
    });

    describe('bail()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
        suite._bail = true;
      });

      describe('when no argument is passed', function () {
        it('should return the bail value', function () {
          expect(suite.bail(), 'to be', true);
        });
      });

      describe('when argument is passed', function () {
        it('should return the Suite object', function () {
          const newSuite = suite.bail(false);
          expect(newSuite.bail(), 'to be', false);
        });
      });
    });

    describe('beforeAll()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('wraps the passed in function in a Hook', function () {
        it('adds it to _beforeAll', function () {
          const fn = function () {};
          suite.beforeAll(fn);

          expect(suite._beforeAll, 'to have length', 1);
          const beforeAllItem = suite._beforeAll[0];
          expect(beforeAllItem.title, 'to match', /^"before all" hook/);
          expect(beforeAllItem.fn, 'to be', fn);
        });

        it('appends title to hook', function () {
          const fn = function () {};
          suite.beforeAll('test', fn);

          expect(suite._beforeAll, 'to have length', 1);
          const beforeAllItem = suite._beforeAll[0];
          expect(beforeAllItem.title, 'to be', '"before all" hook: test');
          expect(beforeAllItem.fn, 'to be', fn);
        });

        it('uses function name if available', function () {
          if (!supportsFunctionNames()) {
            this.skip();
            return;
          }
          function namedFn() {}
          suite.beforeAll(namedFn);
          const beforeAllItem = suite._beforeAll[0];
          expect(beforeAllItem.title, 'to be', '"before all" hook: namedFn');
          expect(beforeAllItem.fn, 'to be', namedFn);
        });
      });
    });

    describe('afterAll()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('wraps the passed in function in a Hook', function () {
        it('adds it to _afterAll', function () {
          const fn = function () {};
          suite.afterAll(fn);

          expect(suite._afterAll, 'to have length', 1);
          const afterAllItem = suite._afterAll[0];
          expect(afterAllItem.title, 'to match', /^"after all" hook/);
          expect(afterAllItem.fn, 'to be', fn);
        });
        it('appends title to hook', function () {
          const fn = function () {};
          suite.afterAll('test', fn);

          expect(suite._afterAll, 'to have length', 1);
          const beforeAllItem = suite._afterAll[0];
          expect(beforeAllItem.title, 'to be', '"after all" hook: test');
          expect(beforeAllItem.fn, 'to be', fn);
        });

        it('uses function name if available', function () {
          if (!supportsFunctionNames()) {
            this.skip();
            return;
          }
          function namedFn() {}
          suite.afterAll(namedFn);
          const afterAllItem = suite._afterAll[0];
          expect(afterAllItem.title, 'to be', '"after all" hook: namedFn');
          expect(afterAllItem.fn, 'to be', namedFn);
        });
      });
    });

    describe('beforeEach()', function () {
      let suite;

      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('wraps the passed in function in a Hook', function () {
        it('adds it to _beforeEach', function () {
          const fn = function () {};
          suite.beforeEach(fn);

          expect(suite._beforeEach, 'to have length', 1);
          const beforeEachItem = suite._beforeEach[0];
          expect(beforeEachItem.title, 'to match', /^"before each" hook/);
          expect(beforeEachItem.fn, 'to be', fn);
        });

        it('appends title to hook', function () {
          const fn = function () {};
          suite.beforeEach('test', fn);

          expect(suite._beforeEach, 'to have length', 1);
          const beforeAllItem = suite._beforeEach[0];
          expect(beforeAllItem.title, 'to be', '"before each" hook: test');
          expect(beforeAllItem.fn, 'to be', fn);
        });

        it('uses function name if available', function () {
          if (!supportsFunctionNames()) {
            this.skip();
            return;
          }
          function namedFn() {}
          suite.beforeEach(namedFn);
          const beforeEachItem = suite._beforeEach[0];
          expect(beforeEachItem.title, 'to be', '"before each" hook: namedFn');
          expect(beforeEachItem.fn, 'to be', namedFn);
        });
      });

      describe('when the suite is pending', function () {
        beforeEach(function () {
          suite.pending = true;
        });

        it('should not create a hook', function () {
          suite.beforeEach(function () {});
          expect(suite._beforeEach, 'to be empty');
        });
      });
    });

    describe('afterEach()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('wraps the passed in function in a Hook', function () {
        it('adds it to _afterEach', function () {
          const fn = function () {};
          suite.afterEach(fn);

          expect(suite._afterEach, 'to have length', 1);
          const afterEachItem = suite._afterEach[0];
          expect(afterEachItem.title, 'to match', /^"after each" hook/);
          expect(afterEachItem.fn, 'to be', fn);
        });

        it('appends title to hook', function () {
          const fn = function () {};
          suite.afterEach('test', fn);

          expect(suite._afterEach, 'to have length', 1);
          const beforeAllItem = suite._afterEach[0];
          expect(beforeAllItem.title, 'to be', '"after each" hook: test');
          expect(beforeAllItem.fn, 'to be', fn);
        });

        it('uses function name if available', function () {
          if (!supportsFunctionNames()) {
            this.skip();
            return;
          }
          function namedFn() {}
          suite.afterEach(namedFn);
          const afterEachItem = suite._afterEach[0];
          expect(afterEachItem.title, 'to be', '"after each" hook: namedFn');
          expect(afterEachItem.fn, 'to be', namedFn);
        });
      });
    });

    describe('create()', function () {
      let first;
      let second;

      before(function () {
        first = new Suite('Root suite', {}, true);
        second = new Suite('RottenRoot suite', {}, true);
        first.addSuite(second);
      });

      it('does not create a second root suite', function () {
        expect(second.parent, 'to be', first);
        expect(first.root, 'to be', true);
        expect(second.root, 'to be', false);
      });

      it('does not denote the root suite by being titleless', function () {
        const emptyTitleSuite = Suite.create(second, '');
        expect(emptyTitleSuite.parent, 'to be', second);
        expect(emptyTitleSuite.root, 'to be', false);
        expect(second.root, 'to be', false);
      });
    });

    describe('addSuite()', function () {
      let first;
      let second;

      beforeEach(function () {
        first = new Suite('First suite');
        first.timeout(4002);
        first.slow(200);
        second = new Suite('Second suite');
        first.addSuite(second);
      });

      it('sets the parent on the added Suite', function () {
        expect(second.parent, 'to be', first);
      });

      it('copies the timeout value', function () {
        expect(second.timeout(), 'to be', 4002);
      });

      it('copies the slow value', function () {
        expect(second.slow(), 'to be', 200);
      });

      it('adds the suite to the suites collection', function () {
        expect(first.suites, 'to have length', 1);
        expect(first.suites[0], 'to be', second);
      });

      it('treats suite as pending if its parent is pending', function () {
        first.pending = true;
        expect(second.isPending(), 'to be', true);
      });
    });

    describe('addTest()', function () {
      let test;

      beforeEach(function () {
        suite = new Suite('A Suite', new Context());
        suite.timeout(4002);
        test = new Test('test');
        suite.addTest(test);
      });

      it('sets the parent on the added test', function () {
        expect(test.parent, 'to be', suite);
      });

      it('copies the timeout value', function () {
        expect(test.timeout(), 'to be', 4002);
      });

      it('adds the test to the tests collection', function () {
        expect(suite.tests, 'to satisfy', [test]).and('to have length', 1);
      });
    });

    describe('fullTitle()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when there is no parent', function () {
        it('returns the suite title', function () {
          expect(suite.fullTitle(), 'to be', 'A Suite');
        });
      });

      describe('when there is a parent', function () {
        it("returns the combination of parent's and suite's title", function () {
          const parentSuite = new Suite('I am a parent');
          parentSuite.addSuite(suite);
          expect(suite.fullTitle(), 'to be', 'I am a parent A Suite');
        });
      });
    });

    describe('titlePath()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when there is no parent', function () {
        it('returns the suite title', function () {
          expect(suite.titlePath(), 'to equal', ['A Suite']);
        });
      });

      describe('when there is a parent', function () {
        describe('the parent is the root suite', function () {
          it('returns the suite title', function () {
            const rootSuite = new Suite('', {}, true);
            rootSuite.addSuite(suite);
            expect(suite.titlePath(), 'to equal', ['A Suite']);
          });
        });

        describe('the parent is not the root suite', function () {
          it("returns the concatenation of parent's and suite's title", function () {
            const parentSuite = new Suite('I am a parent');
            parentSuite.addSuite(suite);
            expect(suite.titlePath(), 'to equal', ['I am a parent', 'A Suite']);
          });
        });
      });
    });

    describe('total()', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when there are no nested suites or tests', function () {
        it('should return 0', function () {
          expect(suite.total(), 'to be', 0);
        });
      });

      describe('when there are several tests in the suite', function () {
        it('should return the number', function () {
          suite.addTest(new Test('a child test'));
          suite.addTest(new Test('another child test'));
          expect(suite.total(), 'to be', 2);
        });
      });
    });

    describe('eachTest(fn)', function () {
      beforeEach(function () {
        suite = new Suite('A Suite');
      });

      describe('when there are no nested suites or tests', function () {
        it('should return 0', function () {
          let n = 0;
          function fn() {
            n++;
          }
          suite.eachTest(fn);
          expect(n, 'to be', 0);
        });
      });

      describe('when there are several tests in the suite', function () {
        it('should return the number', function () {
          suite.addTest(new Test('a child test'));
          suite.addTest(new Test('another child test'));

          let n = 0;
          function fn() {
            n++;
          }
          suite.eachTest(fn);
          expect(n, 'to be', 2);
        });
      });

      describe('when there are several levels of nested suites', function () {
        it('should return the number', function () {
          suite.addTest(new Test('a child test'));
          const childSuite = new Suite('a child suite');
          childSuite.addTest(new Test('a test in a child suite'));
          suite.addSuite(childSuite);

          let n = 0;
          function fn() {
            n++;
          }
          suite.eachTest(fn);
          expect(n, 'to be', 2);
        });
      });
    });

    describe('constructor', function () {
      beforeEach(function () {
        sinon.stub(errors, 'deprecate');
      });

      /* eslint no-new: off */
      it("should throw an error if the title isn't a string", function () {
        expect(function () {
          new Suite(undefined, 'root');
        }, 'to throw');

        expect(function () {
          new Suite(function () {}, 'root');
        }, 'to throw');
      });

      it('should not throw if the title is a string', function () {
        expect(function () {
          new Suite('Bdd suite', 'root');
        }, 'not to throw');
      });
    });

    describe('timeout()', function () {
      it('should convert a string to milliseconds', function () {
        const suite = new Suite('some suite');
        suite.timeout('100');
        expect(suite.timeout(), 'to be', 100);
      });
    });

    describe('hasOnly()', function () {
      it('should return true if a test has `only`', function () {
        const suite = new Suite('foo');
        const test = new Test('bar');

        suite.appendOnlyTest(test);

        expect(suite.hasOnly(), 'to be', true);
      });

      it('should return true if a suite has `only`', function () {
        const suite = new Suite('foo');
        const nested = new Suite('bar');

        suite.appendOnlySuite(nested);

        expect(suite.hasOnly(), 'to be', true);
      });

      it('should return true if nested suite has `only`', function () {
        const suite = new Suite('foo');
        const nested = new Suite('bar');
        const test = new Test('baz');

        nested.appendOnlyTest(test);
        // `nested` has a `only` test, but `suite` doesn't know about it
        suite.suites.push(nested);

        expect(suite.hasOnly(), 'to be', true);
      });

      it('should return false if no suite or test is marked `only`', function () {
        const suite = new Suite('foo');
        const nested = new Suite('bar');
        const test = new Test('baz');

        suite.suites.push(nested);
        nested.tests.push(test);

        expect(suite.hasOnly(), 'to be', false);
      });
    });

    describe('filterOnly()', function () {
      it('should filter out all other tests and suites if a test has `only`', function () {
        const suite = new Suite('a');
        const nested = new Suite('b');
        const test = new Test('c');
        const test2 = new Test('d');

        suite.suites.push(nested);
        suite.appendOnlyTest(test);
        suite.tests.push(test2);

        suite.filterOnly();

        expect(suite, 'to satisfy', {
          suites: expect.it('to be empty'),
          tests: expect
            .it('to have length', 1)
            .and('to have an item satisfying', {title: 'c'})
        });
      });

      it('should filter out all other tests and suites if a suite has `only`', function () {
        const suite = new Suite('a');
        const nested1 = new Suite('b');
        const nested2 = new Suite('c');
        const test = new Test('d');
        const nestedTest = new Test('e');

        nested1.appendOnlyTest(nestedTest);

        suite.tests.push(test);
        suite.suites.push(nested1);
        suite.appendOnlySuite(nested1);
        suite.suites.push(nested2);

        suite.filterOnly();

        expect(suite, 'to satisfy', {
          suites: expect
            .it('to have length', 1)
            .and('to have an item satisfying', {title: 'b'}),
          tests: expect.it('to be empty')
        });
      });
    });

    describe('filterByShard()', function () {
      it('should filter out all tests that are not in the current shard', function () {
        const suite = new Suite('a');
        const nested = new Suite('b');
        const test = new Test('c');
        const test2 = new Test('d');

        suite.suites.push(nested);
        suite.tests.push(test);
        suite.tests.push(test2);

        suite.filterByShard(1, {totalShards: 2, testNum: 0});

        expect(suite, 'to satisfy', {
          suites: expect.it('to be empty'),
          tests: expect
            .it('to have length', 1)
            .and('to have an item satisfying', {title: 'Shard #1 Test #1: c'})
        });
      });
    });

    describe('markOnly()', function () {
      it('should call appendOnlySuite on parent', function () {
        const suite = new Suite('foo');
        const spy = sinon.spy();
        suite.parent = {
          appendOnlySuite: spy
        };
        suite.markOnly();

        expect(spy, 'to have a call exhaustively satisfying', [suite]).and(
          'was called once'
        );
      });
    });
  });
});

describe('Test', function () {
  describe('initialization', function () {
    it("should throw an error if the title isn't a string", function () {
      expect(function () {
        new Test(function () {});
      }, 'to throw');

      expect(() => {
        new Test(undefined, function () {});
      }, 'to throw');
    });

    it('should not throw if the title is a string', function () {
      expect(function () {
        new Test('test-case', function () {});
      }, 'not to throw');
    });
  });
});
