'use strict';

describe('integer primitives', function () {
  describe('arithmetic', function () {
    it('should add', function () {
      expect(1 + 1).to.equal(2);
      expect(2 + 2).to.equal(4);
    });

    it('should subtract', function () {
      expect(1 - 1).to.equal(0);
      expect(2 - 1).to.equal(1);
    });
  });
});

describe('integer primitives', function () {
  describe('arithmetic is not', function () {
    it('should add', function () {
      expect(1 + 1).not.to.equal(3);
      expect(2 + 2).not.to.equal(5);
    });
  });
});

context('test suite', function () {
  beforeEach(function () {
    this.number = 5;
  });

  specify('share a property', function () {
    expect(this.number).to.equal(5);
  });
});

describe('a suite skipped by "before" hook', function () {
  before(function () {
    this.skip();
  });

  it('should skip this test', function () {
    expect(2).to.equal(1);
  });

  it('should skip this test too', function () {
    expect(2).to.equal(1);
  });
});

describe('a parent suite with "skip" in "before" hook', function () {
  before(function () {
    this.skip();
  });

  describe('a suite skipped by parent\'s "before" hook', function () {
    it('should skip this test', function () {
      expect(2).to.equal(1);
    });

    it('should skip this test too', function () {
      expect(2).to.equal(1);
    });
  });
});
