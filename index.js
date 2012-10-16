mconsole = {};
mconsole.log = console.log;
mconsole.warn = console.warn;
mconsole.error = console.error;
mconsole.trace = console.trace;
global.mconsole = mconsole;
if (process.env.NOLOG) {
    console.log = console.warn = console.error = console.trace = function() {};
}

module.exports = process.env.COV
  ? require('./lib-cov/mocha')
  : require('./lib/mocha');