const { once } = require('node:events')
require('./lib/dependency');

exports.mochaGlobalSetup = async function () {
  let message;
  do {
    [message] = await once(process, 'message');
  } while (!message?.resolveGlobalSetup);
}
