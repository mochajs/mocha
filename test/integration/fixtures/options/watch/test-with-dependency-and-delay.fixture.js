const dependency = require('./lib/dependency');

it('checks dependency', async () => {
  await new Promise(r => setTimeout(r, 100));
  if (dependency.testShouldFail === true) {
    throw new Error('test failed');
  }
});
