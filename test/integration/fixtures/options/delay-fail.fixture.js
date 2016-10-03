setTimeout(function() {
  throw new Error('oops');
  it('test', function() {});
  run();
}, 100);
