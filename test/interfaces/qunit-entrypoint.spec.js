'use strict';
const mochaEntryPoint = require('./mocha-entry-point.js');
const {suite, test, before, after} = require(`${mochaEntryPoint}/qunit`);

let beforeSetsThis = 0;
let beforeEachSetsThis = 0;

suite('integer primitives');

before(() => {
  beforeSetsThis = 4;
});
after(() => {
  beforeSetsThis = 3;
});
beforeEach(() => {
  beforeEachSetsThis = 4;
});
afterEach(() => {
  beforeEachSetsThis = 3;
});

test('should add', function() {
  expect(2 + 2, 'to be', beforeSetsThis);
  expect(2 + 2, 'to be', beforeEachSetsThis);
});

test('should decrement', function() {
  expect(2 + 2, 'to be', beforeSetsThis);
  expect(2 + 2, 'to be', beforeEachSetsThis);
  var number = 3;
  expect(--number, 'to be', 2);
  expect(--number, 'to be', 1);
  expect(--number, 'to be', 0);
});

suite('String');

test('#length', function() {
  expect('foo', 'to have length', beforeSetsThis);
  expect('foo', 'to have length', beforeEachSetsThis);
});
