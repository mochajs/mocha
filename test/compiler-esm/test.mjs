const obj = {foo: 'bar'};

describe('esm written in esm', () => {
  it('should work', () => {
    expect(obj, 'to equal', {foo: 'bar'});
  });
});

export const foo = 'bar';
