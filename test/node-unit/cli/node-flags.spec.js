'use strict';

const nodeEnvFlags = [...process.allowedNodeEnvironmentFlags];
const {
  isNodeFlag,
  impliesNoTimeouts,
  unparseNodeFlags
} = require('../../../lib/cli/node-flags');

const {isMochaFlag} = require('../../../lib/cli/run-option-metadata');

describe('node-flags', function () {
  describe('isNodeFlag()', function () {
    describe('for all allowed node environment flags', function () {
      nodeEnvFlags
        .filter(flag => !isMochaFlag(flag))
        .forEach(envFlag => {
          it(`${envFlag} should return true`, function () {
            expect(isNodeFlag(envFlag), 'to be true');
          });
        });
    });

    describe('for all allowed node env flags which conflict with mocha flags', function () {
      nodeEnvFlags
        .filter(flag => isMochaFlag(flag))
        .forEach(envFlag => {
          it(`${envFlag} should return false`, function () {
            expect(isNodeFlag(envFlag), 'to be false');
          });
        });
    });

    describe('when expecting leading dashes', function () {
      it('should require leading dashes', function () {
        expect(isNodeFlag('throw-deprecation', false), 'to be false');
        expect(isNodeFlag('--throw-deprecation', false), 'to be true');
      });
    });

    describe('special cases', function () {
      it('should return true for flags starting with "preserve-symlinks"', function () {
        expect(isNodeFlag('preserve-symlinks'), 'to be true');
        expect(isNodeFlag('preserve-symlinks-main'), 'to be true');
        expect(isNodeFlag('preserve_symlinks'), 'to be true');
      });

      it('should return true for flags starting with "harmony-" or "harmony_"', function () {
        expect(isNodeFlag('harmony-literally-anything'), 'to be true');
        expect(isNodeFlag('harmony_literally_underscores'), 'to be true');
        expect(isNodeFlag('harmonynope'), 'to be false');
      });

      it('should return true for flags starting with "trace-" or "trace_"', function () {
        expect(isNodeFlag('trace-literally-anything'), 'to be true');
        expect(isNodeFlag('trace_literally_underscores'), 'to be true');
        expect(isNodeFlag('tracenope'), 'to be false');
      });

      it('should return true for "harmony" itself', function () {
        expect(isNodeFlag('harmony'), 'to be true');
      });

      it('should return true for "gc-global"', function () {
        expect(isNodeFlag('gc-global'), 'to be true');
        expect(isNodeFlag('gc_global'), 'to be true');
      });

      it('should return true for "es-staging"', function () {
        expect(isNodeFlag('es-staging'), 'to be true');
        expect(isNodeFlag('es_staging'), 'to be true');
      });

      it('should return true for "use-strict"', function () {
        expect(isNodeFlag('use-strict'), 'to be true');
        expect(isNodeFlag('use_strict'), 'to be true');
      });

      it('should return true for flags starting with "--v8-"', function () {
        expect(isNodeFlag('v8-'), 'to be false');
        expect(isNodeFlag('v8-options'), 'to be false');
        expect(isNodeFlag('v8_options'), 'to be false');
        expect(isNodeFlag('v8-anything-else'), 'to be true');
        expect(isNodeFlag('v8_anything_else'), 'to be true');
      });
    });
  });

  describe('impliesNoTimeouts()', function () {
    it('should return true for inspect flags', function () {
      expect(impliesNoTimeouts('inspect'), 'to be true');
      expect(impliesNoTimeouts('inspect-brk'), 'to be true');
    });
  });

  describe('unparseNodeFlags()', function () {
    it('should handle single v8 flags', function () {
      expect(unparseNodeFlags({'v8-numeric': 100}), 'to equal', [
        '--v8-numeric=100'
      ]);
      expect(unparseNodeFlags({'v8-boolean': true}), 'to equal', [
        '--v8-boolean'
      ]);
    });

    it('should handle multiple v8 flags', function () {
      expect(
        unparseNodeFlags({'v8-numeric-one': 1, 'v8-numeric-two': 2}),
        'to equal',
        ['--v8-numeric-one=1', '--v8-numeric-two=2']
      );
      expect(
        unparseNodeFlags({'v8-boolean-one': true, 'v8-boolean-two': true}),
        'to equal',
        ['--v8-boolean-one', '--v8-boolean-two']
      );
      expect(
        unparseNodeFlags({
          'v8-boolean-one': true,
          'v8-numeric-one': 1,
          'v8-boolean-two': true
        }),
        'to equal',
        ['--v8-boolean-one', '--v8-numeric-one=1', '--v8-boolean-two']
      );
      expect(
        unparseNodeFlags({
          'v8-numeric-one': 1,
          'v8-boolean-one': true,
          'v8-numeric-two': 2
        }),
        'to equal',
        ['--v8-numeric-one=1', '--v8-boolean-one', '--v8-numeric-two=2']
      );
    });
  });
});
