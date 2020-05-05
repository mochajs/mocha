'use strict';

const Mocha = require('../../lib/mocha');
const utils = require('../../lib/utils');
const {createSandbox} = require('sinon');

describe('Mocha', function() {
  const opts = {reporter: utils.noop}; // no output
  const dumbFilepath = require.resolve('./fixtures/dumb-module.fixture.js');
  const dumberFilepath = require.resolve('./fixtures/dumber-module.fixture.js');

  let mocha;
  let sandbox;

  beforeEach(function() {
    sandbox = createSandbox();
    mocha = new Mocha(opts);
    delete require.cache[dumbFilepath];
    delete require.cache[dumberFilepath];
  });

  afterEach(function() {
    delete require.cache[dumbFilepath];
    delete require.cache[dumberFilepath];
    sandbox.restore();
  });

  describe('instance method', function() {
    describe('addFile()', function() {
      it('should add the given file to the files array', function() {
        mocha.addFile('some-file.js');
        expect(mocha.files, 'to exhaustively satisfy', ['some-file.js']);
      });

      it('should be chainable', function() {
        expect(mocha.addFile('some-file.js'), 'to be', mocha);
      });
    });

    describe('loadFiles()', function() {
      it('should load all files from the files array', function() {
        this.timeout(1000);
        mocha.files = [dumbFilepath, dumberFilepath];
        mocha.loadFiles();
        expect(require.cache, 'to have keys', [dumbFilepath, dumberFilepath]);
      });

      it('should execute the optional callback if given', function() {
        expect(cb => {
          mocha.loadFiles(cb);
        }, 'to call the callback');
      });
    });

    describe('unloadFiles()', function() {
      it('should delegate Mocha.unloadFile() for each item in its list of files', function() {
        mocha.files = [dumbFilepath, dumberFilepath];
        sandbox.stub(Mocha, 'unloadFile');
        mocha.unloadFiles();
        expect(Mocha.unloadFile, 'to have a call exhaustively satisfying', [
          dumbFilepath
        ])
          .and('to have a call exhaustively satisfying', [dumberFilepath])
          .and('was called twice');
      });

      it('should be chainable', function() {
        expect(mocha.unloadFiles(), 'to be', mocha);
      });
    });
  });

  describe('static method', function() {
    describe('unloadFile()', function() {
      it('should unload a specific file from cache', function() {
        require(dumbFilepath);
        Mocha.unloadFile(dumbFilepath);
        expect(require.cache, 'not to have key', dumbFilepath);
      });
    });
  });
});
