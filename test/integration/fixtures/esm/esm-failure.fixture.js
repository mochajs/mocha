import {add} from './add.js';

it('should use a function from an esm, and fail', () => {
  expect(add(3, 5), 'to be', 9);
});
