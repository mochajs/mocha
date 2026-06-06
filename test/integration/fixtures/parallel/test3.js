import {describe,it} from "../../../../index.js";

describe('test3', () => {
  it('should fail', () => {
    throw new Error('expecting this error to fail');
  });
});
