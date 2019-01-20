'use strict';

/**
 * Tests for cmdline options.
 * Provides umbrella for all spec files in the "options" subdirectory.
 */

var path = require('path');
var utils = require('../../lib/utils');

describe('options', function() {
  var specDir = path.join(__dirname, 'options');
  var specs = utils.lookupFiles(specDir, ['js']).sort();

  specs.forEach(require);
});
