function ok(expr, msg) {
  if (!expr) throw new Error(msg);
}

suite('integer primitives');

test('should add', function(){
  var number = 2 + 2;
  ok(number == 4);
});

test('should decrement', function(){
  var number = 3;
  ok(--number == 2);
  ok(--number == 1);
  ok(--number == 0);
});

suite('String');

test('#length', function(){
  ok('foo'.length == 3);
});
