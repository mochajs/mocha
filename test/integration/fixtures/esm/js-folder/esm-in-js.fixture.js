import {add} from './add.mjs';

it('should use a function from an esm module with a js extension', () => {
  expect(add(3, 5), 'to be', 8);
});
