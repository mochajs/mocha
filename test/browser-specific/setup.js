'use strict';

process.stdout = require('browser-stdout')();

global.expect = global.weknowhow.expect
  .clone()
  .use(global.weknowhow.unexpectedSinon);
