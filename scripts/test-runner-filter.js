'use strict';

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
  'scripts/test-runner-filter.js',
  'bin/**/*',
  'lib/**/*',
  'test/**/*',
  '.mocharc.yml',
  '.wallaby.js',
  'index.js',
  'package.json',
  'package-lock.json',
  'package-scripts.json',
  '.nycrc',
  '.travis.yml',
  'browser-entry.js',
  'karma.conf.js',
  'mocha.*'
];

const shouldRunTest = changedFiles.some(filePath =>
  testRelatedFilePatterns.some(pattern => minimatch(filePath, pattern))
);

if (!shouldRunTest) {
  console.log('No library related files have changed. Skipping test');
  process.exit(1);
}

console.log('Library related files have changed. Continuing full tests');
