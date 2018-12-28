'use strict';

const nodeEnvFlags = require('node-environment-flags');
const {isNodeFlag, impliesNoTimeouts} = require('../../../lib/cli/node-flags');

describe('node-flags', function() {
  describe('isNodeFlag()', function() {
    describe('for all allowed node environment flags', function() {
      // NOTE: this is not stubbing nodeEnvFlags in any way, so relies on
      // the userland polyfill to be correct.
      nodeEnvFlags.forEach(envFlag => {
        it(`${envFlag} should return true`, function() {
          expect(isNodeFlag(envFlag), 'to be true');
        });
      });
    });

    describe('special cases', function() {
      it('should return true for flags starting with "preserve-symlinks"', function() {
        expect(isNodeFlag('preserve-symlinks'), 'to be true');
        expect(isNodeFlag('preserve-symlinks-main'), 'to be true');
        // XXX this is not true in some newer versions of Node.js.  figure out where
        // this changed.
        expect(isNodeFlag('preserve_symlinks'), 'to be false');
      });

      it('should return true for flags starting with "harmony-" or "harmony_"', function() {
        expect(isNodeFlag('harmony-literally-anything'), 'to be true');
        expect(isNodeFlag('harmony_literally_underscores'), 'to be true');
        expect(isNodeFlag('harmonynope'), 'to be false');
      });

      it('should return true for flags starting with "trace-" or "trace_"', function() {
        expect(isNodeFlag('trace-literally-anything'), 'to be true');
        expect(isNodeFlag('trace_literally_underscores'), 'to be true');
        expect(isNodeFlag('tracenope'), 'to be false');
      });

      it('should return true for "harmony" itself', function() {
        expect(isNodeFlag('harmony'), 'to be true');
      });

      it('should return true for "gc-global"', function() {
        expect(isNodeFlag('gc-global'), 'to be true');
        expect(isNodeFlag('gc_global'), 'to be true');
        expect(isNodeFlag('gc'), 'to be true');
      });

      it('should return true for "es-staging"', function() {
        expect(isNodeFlag('es-staging'), 'to be true');
        expect(isNodeFlag('es_staging'), 'to be true');
      });

      it('should return true for "use-strict"', function() {
        expect(isNodeFlag('use-strict'), 'to be true');
        expect(isNodeFlag('use_strict'), 'to be true');
      });

      it('should return true for flags starting with "--v8-"', function() {
        expect(isNodeFlag('v8-'), 'to be false');
        expect(isNodeFlag('v8-options'), 'to be false');
        expect(isNodeFlag('v8_options'), 'to be false');
        expect(isNodeFlag('v8-anything-else'), 'to be true');
        expect(isNodeFlag('v8_anything_else'), 'to be true');
      });
    });
  });

  describe('impliesNoTimeouts()', function() {
    it('should return true for debug/inspect flags', function() {
      expect(impliesNoTimeouts('debug'), 'to be true');
      expect(impliesNoTimeouts('inspect'), 'to be true');
      expect(impliesNoTimeouts('debug-brk'), 'to be true');
      expect(impliesNoTimeouts('inspect-brk'), 'to be true');
    });
  });
});
