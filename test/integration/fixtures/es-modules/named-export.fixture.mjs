import { double } from './module.mjs'

describe('testing imported function', function () {
  it('imported value should double its argument', function () {
    assert(double(5), 10);
  });
});
