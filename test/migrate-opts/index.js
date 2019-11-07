'use strict';

var Mocha = require('../../');

var mocha = new Mocha({
  ui: 'bdd',
  globals: ['okGlobalA', 'okGlobalB', 'okGlobalC', 'callback*'],
  growl: true,
  timeout: 1000
});

require('../setup');

mocha.addFile('test/migrate-opts/migrate-opts.spec.js');

mocha.run(function() {});
