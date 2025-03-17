'use strict';

const lookupFiles = require('../../lib/cli/lookup-files');
const {existsSync, symlinkSync, renameSync} = require('node:fs');
const path = require('node:path');
const {touchFile, createTempDir} = require('./helpers');

const SYMLINK_SUPPORT = process.platform !== 'win32';

describe('file utils', function () {
  let tmpDir;
  let removeTempDir;
  let tmpFile;

  beforeEach(async function () {
    const result = await createTempDir();
    tmpDir = result.dirpath;
    removeTempDir = result.removeTempDir;

    tmpFile = filepath => path.join(tmpDir, filepath);

    touchFile(tmpFile('mocha-utils.js'));
    if (SYMLINK_SUPPORT) {
      symlinkSync(tmpFile('mocha-utils.js'), tmpFile('mocha-utils-link.js'));
    }
  });

  afterEach(async function () {
    return removeTempDir();
  });

  describe('lookupFiles()', function () {
    it('should not return broken symlink file path', function () {
      if (!SYMLINK_SUPPORT) {
        return this.skip();
      }

      expect(
        lookupFiles(tmpDir, ['js'], false),
        'to contain',
        tmpFile('mocha-utils-link.js'),
        tmpFile('mocha-utils.js')
      ).and('to have length', 2);
      expect(existsSync(tmpFile('mocha-utils-link.js')), 'to be', true);
      renameSync(tmpFile('mocha-utils.js'), tmpFile('bob'));
      expect(existsSync(tmpFile('mocha-utils-link.js')), 'to be', false);
      expect(lookupFiles(tmpDir, ['js'], false), 'to equal', []);
    });

    it('should accept a glob "path" value', function () {
      const res = lookupFiles(tmpFile('mocha-utils*'), ['js'], false).map(
        foundFilepath => path.normalize(foundFilepath)
      );

      let expectedLength = 0;
      let ex = expect(res, 'to contain', tmpFile('mocha-utils.js'));
      expectedLength++;

      if (SYMLINK_SUPPORT) {
        ex = ex.and('to contain', tmpFile('mocha-utils-link.js'));
        expectedLength++;
      }

      ex.and('to have length', expectedLength);
    });

    describe('when given `extension` option', function () {
      describe('when provided a directory for the filepath', function () {
        let filepath;

        beforeEach(async function () {
          filepath = tmpFile('mocha-utils-text.txt');
          touchFile(filepath);
        });

        describe('when `extension` option has leading dot', function () {
          it('should find the file w/ the extension', function () {
            expect(lookupFiles(tmpDir, ['.txt']), 'to equal', [filepath]);
          });
        });

        describe('when `extension` option has no leading dot', function () {
          it('should find the file w/ the extension', function () {
            expect(lookupFiles(tmpDir, ['txt']), 'to equal', [filepath]);
          });
        });

        describe('when directory contains file without multipart extension', function () {
          let filepath;

          beforeEach(function () {
            filepath = tmpFile('mocha-utils-test.js');
            touchFile(filepath);
          });

          describe('when provided multipart `extension` option', function () {
            describe('when `extension` option has no leading dot', function () {
              it('should not match the filepath', function () {
                expect(
                  lookupFiles(tmpDir, ['test.js']).map(filepath =>
                    path.normalize(filepath)
                  ),
                  'to equal',
                  []
                );
              });
            });

            describe('when `extension` option has a leading dot', function () {
              it('should not match the filepath', function () {
                expect(
                  lookupFiles(tmpDir, ['.test.js']).map(filepath =>
                    path.normalize(filepath)
                  ),
                  'to equal',
                  []
                );
              });
            });
          });
        });

        describe('when directory contains matching file having a multipart extension', function () {
          let filepath;

          beforeEach(function () {
            filepath = tmpFile('mocha-utils.test.js');
            touchFile(filepath);
          });

          describe('when provided multipart `extension` option', function () {
            describe('when `extension` option has no leading dot', function () {
              it('should find the matching file', function () {
                expect(
                  lookupFiles(tmpDir, ['test.js']).map(filepath =>
                    path.normalize(filepath)
                  ),
                  'to equal',
                  [filepath]
                );
              });
            });

            describe('when `extension` option has a leading dot', function () {
              it('should find the matching file', function () {
                expect(
                  lookupFiles(tmpDir, ['.test.js']).map(filepath =>
                    path.normalize(filepath)
                  ),
                  'to equal',
                  [filepath]
                );
              });
            });
          });
        });
      });
    });

    describe('when provided a filepath with no extension', function () {
      let filepath;

      beforeEach(async function () {
        filepath = tmpFile('mocha-utils.ts');
        touchFile(filepath);
      });

      describe('when `extension` option has a leading dot', function () {
        describe('when only provided a single extension', function () {
          it('should append provided extensions and find only the matching file', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['.js']).map(foundFilepath =>
                path.normalize(foundFilepath)
              ),
              'to equal',
              [tmpFile('mocha-utils.js')]
            );
          });
        });

        describe('when provided multiple extensions', function () {
          it('should append provided extensions and find all matching files', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['.js', '.ts']).map(
                foundFilepath => path.normalize(foundFilepath)
              ),
              'to contain',
              tmpFile('mocha-utils.js'),
              filepath
            ).and('to have length', 2);
          });
        });
      });

      describe('when `extension` option has no leading dot', function () {
        describe('when only provided a single extension', function () {
          it('should append provided extensions and find only the matching file', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['js']).map(foundFilepath =>
                path.normalize(foundFilepath)
              ),
              'to equal',
              [tmpFile('mocha-utils.js')]
            );
          });
        });

        describe('when provided multiple extensions', function () {
          it('should append provided extensions and find all matching files', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['js', 'ts']).map(
                foundFilepath => path.normalize(foundFilepath)
              ),
              'to contain',
              tmpFile('mocha-utils.js'),
              filepath
            ).and('to have length', 2);
          });
        });
      });

      describe('when `extension` option is multipart', function () {
        let filepath;

        beforeEach(function () {
          filepath = tmpFile('mocha-utils.test.js');
          touchFile(filepath);
        });

        describe('when `extension` option has no leading dot', function () {
          it('should append provided extension and find only the matching file', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['test.js']).map(
                foundFilepath => path.normalize(foundFilepath)
              ),
              'to equal',
              [filepath]
            );
          });
        });

        describe('when `extension` option has leading dot', function () {
          it('should append provided extension and find only the matching file', function () {
            expect(
              lookupFiles(tmpFile('mocha-utils'), ['.test.js']).map(
                foundFilepath => path.normalize(foundFilepath)
              ),
              'to equal',
              [filepath]
            );
          });
        });
      });
    });

    describe('when no files match', function () {
      it('should throw an exception', function () {
        expect(() => lookupFiles(tmpFile('mocha-utils')), 'to throw', {
          name: 'Error',
          code: 'ERR_MOCHA_NO_FILES_MATCH_PATTERN'
        });
      });
    });

    describe('when looking up a directory and no extensions provided', function () {
      it('should throw', function () {
        expect(() => lookupFiles(tmpDir), 'to throw', {
          name: 'TypeError',
          code: 'ERR_MOCHA_INVALID_ARG_TYPE',
          argument: 'extensions'
        });
      });
    });
  });
});
