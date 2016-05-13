var getConfig = require('./.karma-config');

module.exports = function(config) {
  var cfg = getConfig();
  var ui = process.env.KARMA_INTERFACE;
  if (ui) {
    cfg.files = [
      getConfig.uiFixturePaths[ui],
      './test/acceptance/interfaces/' + ui + '.js'
    ];
  }

  config.set(cfg);
};
