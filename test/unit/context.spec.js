'use strict';

describe('Context', function () {
  beforeEach(function () {
    this.calls = ['before'];
  });

  describe('nested', function () {
    beforeEach(function () {
      this.calls.push('before two');
    });

    it('should work', function () {
      expect(this.calls).to.eql(['before', 'before two']);
      this.calls.push('test');
    });

    after(function () {
      expect(this.calls).to.eql(['before', 'before two', 'test']);
      this.calls.push('after two');
    });
  });

  after(function () {
    expect(this.calls).to.eql(['before', 'before two', 'test', 'after two']);
  });
});

describe('Context Siblings', function () {
  beforeEach(function () {
    this.calls = ['before'];
  });

  describe('sequestered sibling', function () {
    beforeEach(function () {
      this.calls.push('before two');
      this.hiddenFromSibling = 'This should be hidden';
    });

    it('should work', function () {
      expect(this.hiddenFromSibling).to.eql('This should be hidden');
    });
  });

  describe('sibling verifiction', function () {
    beforeEach(function () {
      this.calls.push('before sibling');
    });

    it('should not have value set within a sibling describe', function () {
      expect('This should be hidden').not.to.eql(this.hiddenFromSibling);
      this.visibleFromTestSibling = 'Visible from test sibling';
    });

    it('should allow test siblings to modify shared context', function () {
      expect('Visible from test sibling').to.eql(this.visibleFromTestSibling);
    });

    it('should have reset this.calls before describe', function () {
      expect(this.calls).to.eql(['before', 'before sibling']);
    });
  });

  after(function () {
    expect(this.calls).to.eql(['before', 'before sibling']);
  });
});

describe('methods', function () {
  describe('timeout()', function () {
    it('should return the timeout', function () {
      expect(this.timeout()).to.equal(200);
    });
  });

  describe('slow()', function () {
    it('should return the slow', function () {
      expect(this.slow()).to.equal(75);
    });
  });

  describe('enableTimeouts()', function () {
    it('should return the enableTimeouts', function () {
      expect(this.enableTimeouts()).to.equal(true);
    });
  });

  describe('retries', function () {
    it('should return the number of retries', function () {
      expect(this.retries()).to.equal(-1);
    });
  });
});
