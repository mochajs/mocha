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
      expect(this.calls, 'to equal', ['before', 'before two']);
      this.calls.push('test');
    });

    after(function () {
      expect(this.calls, 'to equal', ['before', 'before two', 'test']);
      this.calls.push('after two');
    });
  });

  after(function () {
    expect(this.calls, 'to equal', [
      'before',
      'before two',
      'test',
      'after two'
    ]);
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
      expect(this.hiddenFromSibling, 'to equal', 'This should be hidden');
    });
  });

  describe('sibling verifiction', function () {
    beforeEach(function () {
      this.calls.push('before sibling');
    });

    it('should not have value set within a sibling describe', function () {
      expect('This should be hidden', 'not to equal', this.hiddenFromSibling);
      this.visibleFromTestSibling = 'Visible from test sibling';
    });

    it('should allow test siblings to modify shared context', function () {
      expect(
        'Visible from test sibling',
        'to equal',
        this.visibleFromTestSibling
      );
    });

    it('should have reset this.calls before describe', function () {
      expect(this.calls, 'to equal', ['before', 'before sibling']);
    });
  });

  after(function () {
    expect(this.calls, 'to equal', ['before', 'before sibling']);
  });
});

describe('methods', function () {
  describe('timeout()', function () {
    it('should return the timeout', function () {
      // set this explicitly because browser and node use diff settings
      this.timeout(1000);
      expect(this.timeout(), 'to be', 1000);
    });
  });

  describe('slow()', function () {
    it('should return the slow', function () {
      expect(this.slow(), 'to be', 75);
    });
  });

  describe('retries', function () {
    it('should return the number of retries', function () {
      expect(this.retries(), 'to be', -1);
    });
  });

  describe('repeats', function () {
    it('should return the number of repeats', function () {
      expect(this.repeats(), 'to be', 1);
    });
  });
});
