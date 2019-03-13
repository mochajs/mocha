'use strict';

const {builder} = require('../../../lib/cli/run');
const {types} = require('../../../lib/cli/run-option-metadata');

describe('command', function() {
  describe('run', function() {
    describe('builder', function() {
      const IGNORED_OPTIONS = new Set(['help', 'version']);
      const yargs = require('yargs');
      // Without doing this first, yargs will throw an error when we call `.positional()` below.
      yargs
        .command('foo', 'bar', yargs => {
          return yargs;
        })
        .parse(['foo']);
      const options = builder(yargs).getOptions();
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
