'use strict'

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');
const fs = require('fs').promises;

describe('Global Teardown Error Handling', function() {
  this.timeout(5000);

  const setupFile = 'test/fixtures/global-teardown/setup.js';
  const testFile = 'test/fixtures/global-teardown/test.js';

  before(async function() {
    await fs.mkdir(path.dirname(setupFile), { recursive: true });

    await fs.writeFile(setupFile, `
      exports.mochaGlobalTeardown = async function () {
        throw new Error('Teardown failure');
      };
    `);

    await fs.writeFile(testFile, `
      describe('Test Suite', function() {
        it('passing test', function() {
          // This test passes
        });
      });
    `);
  });

  after(async function() {
    await fs.rm(path.dirname(setupFile), { recursive: true, force: true });
  });

  it('should fail with non-zero exit code when global teardown fails', function() {
    const result = spawnSync('node', [
      'bin/mocha',
      '--require', setupFile,
      testFile
    ], {
      encoding: 'utf8'
    });

    assert.strictEqual(result.status, 1, 'Process should exit with code 1');

    assert(result.stderr.includes('Teardown failure') || 
           result.stdout.includes('Teardown failure'),
           'Should show teardown error message');
  });

  it('should combine test failures with teardown failures', async function() {

    await fs.writeFile(testFile, `
      describe('Test Suite', function() {
        it('failing test', function() {
          throw new Error('Test failure');
        });
      });
    `);

    const result = spawnSync('node', [
      'bin/mocha',
      '--require', setupFile,
      testFile
    ], {
      encoding: 'utf8'
    });

    assert.strictEqual(result.status, 1, 'Process should exit with code 1');

    const output = result.stdout + result.stderr;
    assert(output.includes('Test failure'), 'Should show test error');
    assert(output.includes('Teardown failure'), 'Should show teardown error');
  });

  it('should pass with zero exit code when no errors occur', async function() {
    await fs.writeFile(setupFile, `
      exports.mochaGlobalTeardown = async function () {
        // Success case
      };
    `);

    await fs.writeFile(testFile, `
      describe('Test Suite', function() {
        it('passing test', function() {
          // This test passes
        });
      });
    `);

    const result = spawnSync('node', [
      'bin/mocha',
      '--require', setupFile,
      testFile
    ], {
      encoding: 'utf8'
    });

    assert.strictEqual(result.status, 0, 'Process should exit with code 0');
  });
});