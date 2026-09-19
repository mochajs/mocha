module.exports = function Crash(runner) {
  runner.on('fail', function () {
    throw new Error('boom from reporter');
  });
};