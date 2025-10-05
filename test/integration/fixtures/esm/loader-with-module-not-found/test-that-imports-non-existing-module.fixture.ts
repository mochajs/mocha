// This file will be resolved to `test-that-imports-non-existing-module.fixture.mjs` by the loader
import 'non-existent-package';

describe('Test that imports non-existing module', () => {
  it('works', () => {
    return true;
  });
});
