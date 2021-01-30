'use strict';

describe('afterThis', function() {
  var calls = [];

  it('calls the hook', () => {
    afterThis(() => {
      calls.push('sync');
    });
  });

  it('calls the hook in an async test', async () => {
    afterThis(() => {
      calls.push('async');
    });
  });

  it('calls the async hook', () => {
    afterThis(() => {
      calls.push('async hook');
    });
  });

  it('calls the hook on a skipped test', function() {
    afterThis(() => {
      calls.push('skip');
    });

    this.skip();
  });

  // XXX what's the proper way to test this?
  it.skip('calls the hook even on test fail', () => {
    afterThis(() => {
      calls.push('test fail');
    });

    throw new Error('fail');
  });

  after(() => {
    expect(calls, 'to equal', ['sync', 'async', 'async hook', 'skip']);
  });
});
