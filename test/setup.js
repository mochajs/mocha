'use strict';

var unexpected = require('unexpected');
global.expect = require('./assertions').mixinMochaAssertions(
  unexpected.clone().use(require('unexpected-sinon'))
);
