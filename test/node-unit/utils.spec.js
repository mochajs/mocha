'use strict';

const rewiremock = require('rewiremock/node');

describe('utils', function() {
  let utils;

  beforeEach(function() {
    // add deps to be mocked as needed to second parameter
    utils = rewiremock.proxy('../../lib/utils', {});
  });

  describe('function', function() {
    describe('cwd()', function() {
      it('should return the current working directory', function() {
        expect(utils.cwd(), 'to be', process.cwd());
      });
    });

    describe('type()', function() {
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
