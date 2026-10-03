'use strict';

const inspector = require('node:inspector');

if (inspector.url() === undefined) {
  inspector.open(0);
}
