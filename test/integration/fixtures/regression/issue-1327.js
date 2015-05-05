it('test 1', function() {
  process.nextTick(function() {
    throw 'Too bad';
  });
});

it('test 2', function() {});

it('test 3', function() {
  throw new Error('OUCH');
});
