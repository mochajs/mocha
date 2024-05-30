const dependency = require('./lib/dependency-with-state');

it('checks and mutates dependency', () => {
  if (dependency.getFlag()) {
    throw new Error('test failed');
  }
  // Will pass 1st run, fail on subsequent ones
  dependency.enableFlag();
});
