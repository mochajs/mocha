const dependency = require('./lib/dependency');
const { once } = require('node:events');

// wait for resolveTest message and then check for existing depencency.fixture.js
it('checks dependency', async () => {
  process.send({ testStarted: true });
  let message;
  do {
    [message] = await once(process, 'message');
  } while (!message?.resolveTest);
  if (dependency.testShouldFail === true) {
    throw new Error('test failed');
  }
});
