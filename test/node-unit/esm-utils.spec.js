'use strict';

const esmUtils = require('../../lib/nodejs/esm-utils');
const sinon = require('sinon');

describe('esm-utils', function () {
  beforeEach(function () {
    sinon.stub(esmUtils, 'doImport').resolves({});
  });

  afterEach(function () {
    sinon.restore();
  });

  describe('loadFilesAsync()', function () {
    it('should not decorate imported module if no decorator passed', async function () {
      await esmUtils.loadFilesAsync(
        ['/foo/bar.mjs'],
        () => {},
        () => {}
      );

      expect(
        esmUtils.doImport.firstCall.args[0].toString(),
        'to be',
        'file:///foo/bar.mjs'
      );
    });

    it('should decorate imported module with passed decorator', async function () {
      await esmUtils.loadFilesAsync(
        ['/foo/bar.mjs'],
        () => {},
        () => {},
        x => `${x}?foo=bar`
      );

      expect(
        esmUtils.doImport.firstCall.args[0].toString(),
        'to be',
        'file:///foo/bar.mjs?foo=bar'
      );
    });
  });
});
