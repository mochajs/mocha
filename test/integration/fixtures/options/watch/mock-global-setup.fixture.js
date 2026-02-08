const { once } = require('node:events')

exports.mochaGlobalSetup = async function () {
  let message;
  do {
    [message] = await once(process, 'message');
  } while (!message?.resolveGlobalSetup);
}
