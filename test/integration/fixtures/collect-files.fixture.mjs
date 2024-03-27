var obj = {foo: 'bar'};

describe('mjs', function () {
  it('should work', function () {
    expect(obj, 'to equal', {foo: 'bar'});
  });
});
