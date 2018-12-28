'use strict';

suite('integer primitives');

test('should add', function() {
  expect(2 + 2, 'to be', 4);
});

test('should decrement', function() {
  var number = 3;
  expect(--number, 'to be', 2);
  expect(--number, 'to be', 1);
  expect(--number, 'to be', 0);
});

suite('String');

test('#length', function() {
  expect('foo', 'to have length', 3);
});
