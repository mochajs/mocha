'use strict';

const assert = require('assert');
const path = require('path');
const { spawnSync } = require('child_process');

describe('Run Global Fixtures Error Handling', function () {

  const FIXTURES_DIR = 'test/integration/fixtures/global-fixtures/';

  function runMochaWithFixture(setupFile, testFile) {
    return spawnSync('node', [
      'bin/mocha',
      '--require', path.join(FIXTURES_DIR, setupFile),
      path.join(FIXTURES_DIR, testFile)
    ], { encoding: 'utf-8' });
  }

  function assertFailure(result, expectedMessage) {
    assert.strictEqual(result.status, 1, 'Process should exit with 1');
    assert(
      result.stderr.includes(expectedMessage) || result.stdout.includes(expectedMessage),
      `Should show error message: ${expectedMessage}`
    );
  }

  it('should fail with non-zero exit code when global setup fails', function () {
    const result = runMochaWithFixture('global-setup.fixture.js', 'failing-test.fixture.js');
    assertFailure(result, 'Setup problem');
  });

  it('should fail with non-zero exit code when global teardown fails', function () {
    const result = runMochaWithFixture('global-teardown.fixture.js', 'failing-test.fixture.js');
    assertFailure(result, 'Teardown problem');
  });

  it('should combine failures with setup failures', function () {
    const result = runMochaWithFixture('global-setup.fixture.js', 'failing-test.fixture.js');
    assertFailure(result, 'Setup problem');
  });

  it('should combine failures with teardown failures', function () {
    const result = runMochaWithFixture('global-teardown.fixture.js', 'failing-test.fixture.js');
    assertFailure(result, 'Teardown problem');
  });

  it('should pass with zero exit code when no errors occur in setup', function () {
    const result = runMochaWithFixture('passing-setup.fixture.js', 'test.fixture.js');
    assert.strictEqual(result.status, 0, 'Process should exit with 0');
  });

  it('should pass with zero exit code when no errors occur in teardown', function () {
    const result = runMochaWithFixture('passing-teardown.fixture.js', 'test.fixture.js');
    assert.strictEqual(result.status, 0, 'Process should exit with 0');
  });
});
