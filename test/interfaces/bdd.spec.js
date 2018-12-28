'use strict';

describe('integer primitives', function() {
  describe('arithmetic', function() {
    it('should add', function() {
      expect(1 + 1, 'to be', 2);
      expect(2 + 2, 'to be', 4);
    });

    it('should subtract', function() {
      expect(1 - 1, 'to be', 0);
      expect(2 - 1, 'to be', 1);
    });
  });
});

describe('integer primitives', function() {
  describe('arithmetic is not', function() {
    it('should add', function() {
      expect(1 + 1, 'not to equal', 3);
      expect(2 + 2, 'not to equal', 5);
    });
  });
});

context('test suite', function() {
  beforeEach(function() {
    this.number = 5;
  });

  specify('share a property', function() {
    expect(this.number, 'to be', 5);
  });
});

describe('pending suite', function() {
  describe.skip('this is pending suite', function() {
    it('should not run', function() {
      expect(1 + 1, 'to be', 3);
    });
  });
});

describe('pending tests', function() {
  it.skip('should not run', function() {
    expect(1 + 1, 'to be', 3);
  });
});

describe('setting timeout by appending it to test', function() {
  var runningTest = it('enables users to call timeout on active tests', function() {
    expect(1 + 1, 'to be', 2);
  }).timeout(1003);

  var skippedTest = xit('enables users to call timeout on pending tests', function() {
    expect(1 + 1, 'to be', 3);
  }).timeout(1002);

  it('sets timeout on pending tests', function() {
    expect(skippedTest._timeout, 'to be', 1002);
  });

  it('sets timeout on running tests', function() {
    expect(runningTest._timeout, 'to be', 1003);
  });
});
