var mocha = require('../')
  , Filter = require('../lib/filter')
  , Context = mocha.Context
  , Suite = mocha.Suite
  , Test = mocha.Test;

describe('filter', function() {

  var root, fruit, veggies, apple, pear, beans;

  beforeEach(function() {
    root    = new Suite('root', new Context);
    apples  = new Test('apples');
    pears   = new Test('pears');
    beans   = new Test('beans');
    fruit   = Suite.create(root, 'some fruit')
                   .tag('fruit')
                   .addTest(apples)
                   .addTest(pears);
    veggies = Suite.create(root, 'some veggies')
                   .tag('veggies', 'green')
                   .addTest(beans);
  });

  describe('shouldRun', function() {

    it('runs all tests by default', function() {
      var filter = new Filter();
      filter.shouldRun(apples).should.eql(true);
    });

    describe('grep', function() {

      it('can grep with a regex on the test name', function() {
        var filter = new Filter();
        filter.grep = /p/;
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(pears).should.eql(true);
        filter.shouldRun(beans).should.eql(false);
      });

      it('can grep with a regex on the full test title', function() {
        var filter = new Filter();
        filter.grep = /fruit/;
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(beans).should.eql(false);
      });

      it('can invert a grep match', function() {
        var filter = new Filter();
        filter.grep = /fruit/;
        filter.invertGrep = true;
        filter.shouldRun(apples).should.eql(false);
        filter.shouldRun(beans).should.eql(true);
      });

    });

    describe('tags', function() {

      it('only runs test with specified tags', function() {
        var filter = new Filter();
        filter.tags = ['veggies'];
        filter.shouldRun(apples).should.eql(false);
        filter.shouldRun(beans).should.eql(true);
        filter.tags = ['fruit', 'veggies'];
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(beans).should.eql(true);
      });

      it('can exclude certain tags', function() {
        var filter = new Filter();
        filter.skipTags = ['green'];
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(beans).should.eql(false);
      });

      it('can exclude certain tags', function() {
        var filter = new Filter();
        filter.tags = ['fruit', 'veggies'];
        filter.skipTags = ['green'];
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(beans).should.eql(false);
      });

    });

    describe('combination', function() {

      it('can combines grep and tags', function() {
        var filter = new Filter();
        filter.grep = /some/;
        filter.skipTags = ['green'];
        filter.shouldRun(apples).should.eql(true);
        filter.shouldRun(beans).should.eql(false);
      });

    });

  });

  describe('count', function() {

    it('returns the number of tests matching the filter', function() {
      var filter = new Filter();
      filter.count(root).should.eql(3);
      filter.tags = ['veggies'];
      filter.count(root).should.eql(1);
      filter.grep = /beans/;
      filter.count(root).should.eql(1);
      filter.skipTags = ['green'];
      filter.count(root).should.eql(0);
    });

  });

});
