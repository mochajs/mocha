it('test 1', function() {
  console.log('testbody1');
  process.nextTick(function() {
    throw 'Too bad';
  });
});

it('test 2', function() {
  console.log('testbody2');
});

it('test 3', function() {
  console.log('testbody3');
  throw new Error('OUCH');
});
