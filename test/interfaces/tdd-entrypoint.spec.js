'use strict';
const mochaEntryPoint = require('./mocha-entry-point');
const {
  suite,
  suiteSetup,
  test,
  suiteTeardown,
  setup,
  teardown
} = require(`${mochaEntryPoint}/tdd`);

let beforeSetsThis = 0;
suite('integer primitives  (with mocha/tdd)', function() {
  suite('arithmetic', function() {
    var initialValue = 41;

    suiteSetup(function(done) {
      expect(initialValue, 'to be', 41);
      initialValue += 1;
      done();
    });

    setup(() => {
      beforeSetsThis = 2;
    });
    teardown(() => {
      beforeSetsThis = 3;
    });

    test('should add', function() {
      expect(initialValue, 'to be', 42);
      expect(1 + 1, 'to be', beforeSetsThis);
      expect(2 + 2, 'to be', 4);
    });

    test('should subtract', function() {
      expect(initialValue, 'to be', 42);
      expect(1 - 1, 'to be', 0);
      expect(2 - 1, 'to be', 1);
    });

    test.skip('should skip this test', function() {
      var zero = 0;
      expect(zero, 'to be', 1);
    });

    suite.skip('should skip this suite', function() {
      test('should skip this test', function() {
        var zero = 0;
        expect(zero, 'to be', 1);
      });
    });

    suiteTeardown(function(done) {
      expect(initialValue, 'to be', 42);
      done();
    });
  });

  suite('arithmetic is not', function() {
    test('should add', function() {
      expect(1 + 1, 'not to equal', beforeSetsThis);
      expect(2 + 2, 'not to equal', 5);
    });
  });
});
