'use strict';

const utils = require('../../lib/utils');

describe('utils', function() {
  describe('function', function() {
    describe('type', function() {
      it('should return "asyncfunction" if the parameter is an async function', function() {
        expect(
          utils.type(async () => {}),
          'to be',
          'asyncfunction'
        );
      });
    });
  });
});
