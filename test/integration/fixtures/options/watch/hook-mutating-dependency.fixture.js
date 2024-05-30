const dependency = require('./lib/dependency-with-state');

module.exports = {
  mochaHooks: {
    beforeEach: () => {
      dependency.enableFlag();
    }
  }
};
