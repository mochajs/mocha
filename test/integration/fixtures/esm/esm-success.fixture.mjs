import {it, before, beforeEach, after, afterEach, describe, test} from 'mocha'
import {add} from './add.mjs';

describe('some esm tests', () => {
  before(() => {
    expect(add(3, 5), 'to be', 8);
  })
  after(() => {
    expect(add(3, 5), 'to be', 8);
  })
  beforeEach(() => {
    expect(add(3, 5), 'to be', 8);
  })
  afterEach(() => {
    expect(add(3, 5), 'to be', 8);
  })
  it('should use a function from an esm', () => {
    expect(add(3, 5), 'to be', 8);
  });

  test('should use a function from an esm, using test', () => {
    expect(add(3, 5), 'to be', 8);
  });
})
