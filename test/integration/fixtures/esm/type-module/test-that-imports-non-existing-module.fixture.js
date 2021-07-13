import assert from 'assert';
import './this-module-does-not-exist.js';

it('should not pass (or even run) because above import will fail', () => {
  assert(true);
});
