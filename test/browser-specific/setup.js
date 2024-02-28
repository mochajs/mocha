'use strict';

process.stdout = require('browser-stdout')();

global.expect = require('unexpected')
  .clone()
  .use(require('unexpected-set'))
  .use(require('unexpected-map'))
  .use(require('unexpected-sinon'))
  .use(require('unexpected-eventemitter'));
