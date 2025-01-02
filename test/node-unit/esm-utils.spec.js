'use strict';

const esmUtils = require('../../lib/nodejs/esm-utils');
const sinon = require('sinon');
const url = require('node:url');

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
        url.pathToFileURL('/foo/bar.mjs').toString()
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
        `${url.pathToFileURL('/foo/bar.mjs').toString()}?foo=bar`
      );
    });
  });
});
