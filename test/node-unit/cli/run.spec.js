'use strict';

const {builder} = require('../../../lib/cli/run');
const {types} = require('../../../lib/cli/run-option-metadata');

describe('command', function() {
  describe('run', function() {
    describe('builder', function() {
      const IGNORED_OPTIONS = new Set(['help', 'version']);
      const options = builder(require('yargs')).getOptions();
      ['number', 'string', 'boolean', 'array'].forEach(type => {
        describe(`${type} type`, function() {
          Array.from(new Set(options[type])).forEach(option => {
            if (!IGNORED_OPTIONS.has(option)) {
              it(`should include option ${option}`, function() {
                expect(types[type], 'to contain', option);
              });
            }
          });
        });
      });
    });
  });
});
