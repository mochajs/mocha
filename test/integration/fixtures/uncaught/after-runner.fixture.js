'use strict';

describe("Uncaught exception after runner's end", () => {
  it('test', () => {
    setTimeout(() => {
      throw new Error('Unexpected crash');
    }, 100);
  });
});
