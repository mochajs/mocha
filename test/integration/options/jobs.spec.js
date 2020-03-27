'use strict';

var path = require('path');
var helpers = require('../helpers');
var runMochaAsync = helpers.runMochaAsync;

describe('--jobs', function() {
  it('should not work without --parallel', function() {
    return expect(
      runMochaAsync(
        path.join('options', 'parallel', '*.fixture.js'),
        ['--jobs', '3'],
        'pipe'
      ),
      'to be fulfilled with value satisfying',
      {output: /Missing\s+dependent\s+arguments[^]\s+jobs\s+->\s+parallel/i}
    );
  });
});
