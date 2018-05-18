'use strict';

suite('integer primitives', function() {
  suite('arithmetic', function() {
    var initialValue = 41;

    suiteSetup(function(done) {
      expect(initialValue, 'to be', 41);
      initialValue += 1;
      done();
    });

    test('should add', function() {
      expect(initialValue, 'to be', 42);
      expect(1 + 1, 'to be', 2);
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
});
