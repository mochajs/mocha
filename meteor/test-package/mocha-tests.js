import {describe, it, before, after, beforeEach, afterEach, xdescribe, xit, specify, xspecify, context, xcontext} from "meteor/practicalmeteor:mocha"
import {expect} from "meteor/practicalmeteor:chai"
import TestCollection from "./TestCollection"


describe('1 - Array', function() {
  describe('1.1 - #indexOf()', function() {
    return it('should return -1 when the value is not present', function() {
      expect([1, 2, 3].indexOf(5)).to.equal(-1);
      return expect([1, 2, 3].indexOf(0)).to.equal(-1);
    });
  });

  describe('1.2 - length', function() {
    return it('should return length of array', function() {
      return expect([1, 2, 3].length).to.equal(3);
    });
  });

  describe("Specify", function () {

    specify("it works", function () {
      expect(true).to.be.true;
    });

    xspecify("Skip: This won't run", function () {
      throw new Error("This won't run")
    })
  })

  context("Context test", function () {
    it("it works", function () {
      expect(true).to.be.true;
    });
  });

  xcontext("Skip suite (xcontext)", function () {

    it("This won't run", function () {
      throw new Error("This won't run")
    })
  })

});

describe('2 - Async test', function() {
  it('should pass', function(done) {
    return Meteor.setTimeout((function(_this) {
      return function() {
        return done();
      };
    })(this), 1000);
  });
  return it('should throw', function(done) {
    return Meteor.setTimeout((function(_this) {
      return function() {
        return done("I'm throwing");
      };
    })(this), 1000);
  });
});

describe('3 - Skipped test', function() {
  it.skip('3.1 - should skip test', function(done) {
    return Meteor.setTimeout((function(_this) {
      return function() {
        return done();
      };
    })(this), 1000);
  });
  return it('3.2 - should skip test');
});

describe('4 - Uncaught exception suite', function() {
  return it('should fail due to an uncaught exception', function(done) {
    return setTimeout((function(_this) {
      return function() {
        throw new Error("I'm an uncaught exception");
        return done();
      };
    })(this), 1000);
  });
});

describe('5 - All sync test suite', function() {
  before(function() {
    return console.log('before');
  });
  after(function() {
    return console.log('after');
  });
  beforeEach(function() {
    return console.log('beforeEach');
  });
  afterEach(function() {
    return console.log('afterEach');
  });
  it('passing', function() {
    return expect(true).to.be["true"];
  });
  return it('throwing', function() {
    return expect(false).to.be["true"];
  });
});

describe('6 - All async test suite', function() {
  before(function(done) {
    this.keepContext = true;
    console.log('before');
    return Meteor.defer(function() {
      return done();
    });
  });
  after(function(done) {
    console.log('after');
    return Meteor.setTimeout((function() {
      return done();
    }), 500);
  });
  beforeEach(function(done) {
    console.log('beforeEach');
    return Meteor.setTimeout((function() {
      return done();
    }), 500);
  });
  afterEach(function(done) {
    console.log('afterEach');
    this.timeout(1000);
    return Meteor.setTimeout((function() {
      return done();
    }), 500);
  });
  this.timeout(5000);
  it('passing', function(done) {
    expect(this.keepContext).to.be["true"];
    return Meteor.setTimeout((function() {
      return done();
    }), 2500);
  });
  return it('throwing', function(done) {
    return Meteor.defer(function() {
      return done(new Error('failing'));
    });
  });
});

describe('7 - implicit wait', function() {
  return it('during findOne', function() {
    var doc;
    return doc = TestCollection.findOne({
      _id: 'xxx'
    });
  });
});

describe.skip('8 - skip suite', function() {
  return it("this won't run", function() {
    throw new Error("This is an error");
  });
});
