const dependency = require('./lib/dependency-with-state');

// Will fail 1st run, unless hook runs
before(() => {
  dependency.disableFlag();
});

// Will pass 1st run, fail on subsequent ones, unless hook runs
afterEach(() => {
  dependency.disableFlag();
});

it('hook should have mutated dependency', () => {
  if (!dependency.getFlag()) {
    throw new Error('test failed');
  }
});
