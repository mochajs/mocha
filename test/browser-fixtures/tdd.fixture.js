'use strict';

/* eslint-env browser */

process.stdout = require('browser-stdout')();

window.mocha.timeout(200)
  .ui('tdd');
