'use strict';

// as of this writing we're using a config file instead of mocha.opts,
// so to run this test, we must use `--opts test/opts/mocha.opts`
// and `--no-config`.
describe('--opts', function() {
  it('should use options present in test `mocha.opts`', function() {
    // this will fail if config file was used and/or mocha.opts didn't load.
    expect(this.timeout(), 'to be', 300);
  });
});
