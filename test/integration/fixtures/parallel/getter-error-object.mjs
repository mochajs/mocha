import {describe, it} from '../../../../index.mjs';

describe('test1', () => {
  it('test', async () => {
    const error = new Error('Oh no!');

    error.nested = {
      get inner() {
        return 'abc';
      }
    };

    throw error;
  });
});
