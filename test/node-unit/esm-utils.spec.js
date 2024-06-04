'use strict';

const esmUtils = require('../../lib/nodejs/esm-utils');
const sinon = require('sinon');
const url = require('url');

describe('esm-utils', function () {
  beforeEach(function () {
    sinon.stub(esmUtils, 'doImport').resolves({});
  });

  afterEach(function () {
    sinon.restore();
    esmUtils.setCacheBusterKey('');
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

    it('should decorate imported module with passed decorator - with cache buster key', async function () {
      esmUtils.setCacheBusterKey('1234');

      await esmUtils.loadFilesAsync(
        ['/foo/bar.mjs'],
        () => {},
        () => {},
        x => `${x}?foo=bar`
      );

      expect(
        esmUtils.doImport.firstCall.args[0].toString(),
        'to be',
        `${url.pathToFileURL('/foo/bar.mjs').toString()}?foo=bar&cache=1234`
      );
    });
  });
});
