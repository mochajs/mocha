'use strict';

throw new Error("Error from mocharcWithThrowError");

// a comment
module.exports = {
  require: ['foo', 'bar'],
  bail: true,
  reporter: 'dot',
  slow: 60
};
