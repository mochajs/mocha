import {expect} from "meteor/practicalmeteor:chai"

describe('Globals', function() {

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
  it('throwing', function() {
    return expect(false).to.be["true"];
  });

  specify("it works", function () {
    expect(true).to.be.true;
  });

  xspecify("Skip: This won't run (xspecify)", function () {
    throw new Error("This won't run")
  })

  xdescribe('Skip suite (xdescribe)', function() {
    return it("this won't run", function() {
      throw new Error("This is an error");
    });
  });

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
