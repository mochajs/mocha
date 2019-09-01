'use strict';

try {
  const minimatch = require('minimatch');
  const childProcess = require('child_process');
  const gitDiffRange = (
    process.env.TRAVIS_COMMIT_RANGE || 'master..HEAD'
  ).replace('...', '..');
  const changedFiles = childProcess
    .execSync(`git diff --name-only ${gitDiffRange}`, {encoding: 'utf8'})
    .split('\n')
    .slice(0, -1);

  const testRelatedFilePatterns = [
    'scripts/travis-run-filter.js',
    'lib/**/*',
    'test/**/*',
    'bin/**/*',
    '.eslintignore',
    '.eslintrc.yml',
    '.markdownlint.json',
    '.mocharc.yml',
    '.nycrc',
    '.travis.yml',
    '.wallaby.js',
    'browser-entry.js',
    'index.js',
    'karma.conf.js',
    'mocha.*',
    'package.json',
    'package-lock.json',
    'package-scripts.json'
  ];

  const shouldRunTest = changedFiles.some(filePath =>
    testRelatedFilePatterns.some(pattern => minimatch(filePath, pattern))
  );

  if (!shouldRunTest) {
    console.log('No library related files have changed. Skipping test');
    process.exit(1);
  }

  console.log('Library related files have changed. Continuing full tests');
} catch (err) {
  console.log(
    'Caught an error while checking git diff against test file patterns:'
  );
  console.error(err);
  console.log('Running the full test suite as a consequence');
}
