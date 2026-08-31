const dependency = require('./lib/dependency');

it('checks dependency', () => {
  if (dependency.testShouldFail === true) {
    throw new Error('test failed');
  }
});
