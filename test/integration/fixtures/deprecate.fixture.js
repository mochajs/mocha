'use strict';

var errors = require("../../../lib/errors");

it('consolidates identical calls to deprecate', function() {
  errors.deprecate("suite foo did a deprecated thing");
  errors.deprecate("suite foo did a deprecated thing");
  errors.deprecate("suite bar did a deprecated thing");
});
