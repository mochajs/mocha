'use strict';

// Putting this method in its own module facilitates ease of stubbing for unit testing purposes
function getPath () {
  return 'test/mocha.opts';
}

module.exports = {
  getPath: getPath
};
