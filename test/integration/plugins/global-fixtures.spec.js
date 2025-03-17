'use strict';

const path = require('node:path');
const {
  touchFile,
  runMochaAsync,
  runMochaWatchAsync,
  copyFixture,
  DEFAULT_FIXTURE,
  resolveFixturePath,
  createTempDir
} = require('../helpers');

describe('global setup/teardown', function () {
  describe('when mocha run in serial mode', function () {
    it('should execute global setup and teardown', async function () {
      return expect(
        runMochaAsync(DEFAULT_FIXTURE, [
          '--require',
          resolveFixturePath('plugins/global-fixtures/global-setup-teardown')
        ]),
        'when fulfilled',
        'to have passed'
      );
    });

    describe('when only global teardown is supplied', function () {
      it('should run global teardown', async function () {
        return expect(
          runMochaAsync(DEFAULT_FIXTURE, [
            '--require',
            resolveFixturePath('plugins/global-fixtures/global-teardown')
          ]),
          'when fulfilled',
          'to contain once',
          /teardown schmeardown/
        );
      });
    });

    describe('when only global setup is supplied', function () {
      it('should run global setup', async function () {
        return expect(
          runMochaAsync(DEFAULT_FIXTURE, [
            '--require',
            resolveFixturePath('plugins/global-fixtures/global-setup')
          ]),
          'when fulfilled',
          'to contain once',
          /setup schmetup/
        );
      });
    });

    it('should share context', async function () {
      return expect(
        runMochaAsync(DEFAULT_FIXTURE, [
          '--require',
          resolveFixturePath('plugins/global-fixtures/global-setup-teardown')
        ]),
        'when fulfilled',
        'to contain once',
        /setup: this\.foo = bar[\s\S]+teardown: this\.foo = bar/
      );
    });

    describe('when supplied multiple functions', function () {
      it('should execute them sequentially', async function () {
        return expect(
          runMochaAsync(DEFAULT_FIXTURE, [
            '--require',
            resolveFixturePath(
              'plugins/global-fixtures/global-setup-teardown-multiple'
            )
          ]),
          'when fulfilled',
          'to contain once',
          /teardown: this.foo = 3/
        );
      });
    });

    describe('when run in watch mode', function () {
      let tempDir;
      let testFile;
      let removeTempDir;

      beforeEach(async function () {
        const tempInfo = await createTempDir();
        tempDir = tempInfo.dirpath;
        removeTempDir = tempInfo.removeTempDir;
        testFile = path.join(tempDir, 'test.js');
        copyFixture(DEFAULT_FIXTURE, testFile);
      });

      afterEach(async function () {
        if (removeTempDir) {
          return removeTempDir();
        }
      });

      it('should execute global setup and teardown', async function () {
        return expect(
          runMochaWatchAsync(
            [
              '--require',
              resolveFixturePath(
                'plugins/global-fixtures/global-setup-teardown'
              ),
              testFile
            ],
            tempDir,
            () => {
              touchFile(testFile);
            }
          ),
          'when fulfilled',
          'to have passed'
        );
      });

      describe('when only global teardown is supplied', function () {
        it('should run global teardown', async function () {
          return expect(
            runMochaWatchAsync(
              [
                '--require',
                resolveFixturePath('plugins/global-fixtures/global-teardown'),
                testFile
              ],
              tempDir,
              () => {
                touchFile(testFile);
              }
            ),
            'when fulfilled',
            'to contain once',
            /teardown schmeardown/
          );
        });
      });

      describe('when only global setup is supplied', function () {
        it('should run global setup', async function () {
          return expect(
            runMochaWatchAsync(
              [
                '--require',
                resolveFixturePath('plugins/global-fixtures/global-setup'),
                testFile
              ],
              tempDir,
              () => {
                touchFile(testFile);
              }
            ),
            'when fulfilled',
            'to contain once',
            /setup schmetup/
          );
        });
      });

      it('should not re-execute the global fixtures', async function () {
        return expect(
          runMochaWatchAsync(
            [
              '--require',
              resolveFixturePath(
                'plugins/global-fixtures/global-setup-teardown-multiple'
              ),
              testFile
            ],
            tempDir,
            () => {
              touchFile(testFile);
            }
          ),
          'when fulfilled',
          'to contain once',
          /teardown: this.foo = 3/
        );
      });
    });
  });

  describe('when mocha run in parallel mode', function () {
    it('should execute global setup and teardown', async function () {
      return expect(
        runMochaAsync(DEFAULT_FIXTURE, [
          '--parallel',
          '--require',
          resolveFixturePath('plugins/global-fixtures/global-setup-teardown')
        ]),
        'when fulfilled',
        'to have passed'
      );
    });

    it('should share context', async function () {
      return expect(
        runMochaAsync(DEFAULT_FIXTURE, [
          '--parallel',
          '--require',
          resolveFixturePath('plugins/global-fixtures/global-setup-teardown')
        ]),
        'when fulfilled',
        'to contain once',
        /setup: this.foo = bar/
      ).and('when fulfilled', 'to contain once', /teardown: this.foo = bar/);
    });

    describe('when supplied multiple functions', function () {
      it('should execute them sequentially', async function () {
        return expect(
          runMochaAsync(DEFAULT_FIXTURE, [
            '--parallel',
            '--require',
            resolveFixturePath(
              'plugins/global-fixtures/global-setup-teardown-multiple'
            )
          ]),
          'when fulfilled',
          'to contain once',
          /teardown: this.foo = 3/
        );
      });
    });

    describe('when run in watch mode', function () {
      let tempDir;
      let testFile;
      let removeTempDir;

      beforeEach(async function () {
        const tempInfo = await createTempDir();
        tempDir = tempInfo.dirpath;
        removeTempDir = tempInfo.removeTempDir;
        testFile = path.join(tempDir, 'test.js');
        copyFixture(DEFAULT_FIXTURE, testFile);
      });

      afterEach(async function () {
        if (removeTempDir) {
          return removeTempDir();
        }
      });

      it('should execute global setup and teardown', async function () {
        return expect(
          runMochaWatchAsync(
            [
              '--parallel',
              '--require',
              resolveFixturePath(
                'plugins/global-fixtures/global-setup-teardown'
              ),
              testFile
            ],
            tempDir,
            () => {
              touchFile(testFile);
            }
          ),
          'when fulfilled',
          'to have passed'
        );
      });

      it('should not re-execute the global fixtures', async function () {
        return expect(
          runMochaWatchAsync(
            [
              '--parallel',
              '--require',
              resolveFixturePath(
                'plugins/global-fixtures/global-setup-teardown-multiple'
              ),
              testFile
            ],
            tempDir,
            () => {
              touchFile(testFile);
            }
          ),
          'when fulfilled',
          'to contain once',
          /teardown: this.foo = 3/
        );
      });
    });
  });
});
