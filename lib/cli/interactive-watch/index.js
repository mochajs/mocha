'use strict';

const path = require('path');

const debug = require('debug')('mocha:cli:interactive-watch');

const collectFiles = require('../collect-files');
const {isDebugEnabled, lineBreak} = require('./util');
const {promptFilter} = require('./filter');
const {switchToTestRunner} = require('./test-runner');

exports.interactiveWatchRun = async (mocha, options, fileCollectParams) => {
  try {
    debug('initiating interactive watch');
    let collectedFiles = collectFiles(fileCollectParams);

    // files given through --file options
    const explicitlyIncludedFiles = fileCollectParams.file.map(filepath =>
      path.resolve(filepath)
    );
    debug('files given through --file option: ', explicitlyIncludedFiles);

    // remove explicitly included files from collected files
    collectedFiles = collectedFiles.slice(explicitlyIncludedFiles.length);

    if (collectedFiles.length === 0) {
      console.warn('Warning: No test files found');
      process.exit();
    }

    const filteredFiles = await promptFilter(collectedFiles);
    if (isDebugEnabled()) lineBreak();
    debug('filtered files: ', filteredFiles);

    switchToTestRunner({
      mocha,
      options,
      collectedFiles,
      explicitlyIncludedFiles,
      filteredFiles
    });
  } catch (err) {
    console.error('\n' + (err.stack || `Error: ${err.message || err}`));
    process.exit(1);
  }
};
