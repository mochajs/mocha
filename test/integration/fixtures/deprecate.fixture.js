'use strict';

var utils = require("../../../lib/utils");

it('consolidates identical calls to deprecate', function() {
  utils.deprecate("suite foo did a deprecated thing");
  utils.deprecate("suite foo did a deprecated thing");
  utils.deprecate("suite bar did a deprecated thing");
});
