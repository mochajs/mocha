'use strict';

var path = require('node:path').posix;
var helpers = require('./helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

describe('nested test detection', function () {
  var nestedTestErrorMessage = 'Nested test ".*" detected inside';

  describe('BDD interface', function () {
    it('should fail when nested tests are detected', function (done) {
      var fixture = path.join('nested-tests', 'bdd-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /inner nested test.*detected inside.*outer test/);
          done();
        },
        spawnOpts
      );
    });

    it('should report correct test counts when nested tests fail', function (done) {
      var fixture = path.join('nested-tests', 'bdd-nested');
      runMochaJSON(fixture, ['--ui', 'bdd'], function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed')
          .and('to have passed test count', 2)  // 'normal test' and 'another normal test' should pass
          .and('to have failed test count', 1); // 'outer test with nested test' should fail
        done();
      });
    });
  });

  describe('TDD interface', function () {
    it('should fail when nested tests are detected', function (done) {
      var fixture = path.join('nested-tests', 'tdd-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'tdd'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /inner nested test.*detected inside.*outer test/);
          done();
        },
        spawnOpts
      );
    });

    it('should report correct test counts when nested tests fail', function (done) {
      var fixture = path.join('nested-tests', 'tdd-nested');
      runMochaJSON(fixture, ['--ui', 'tdd'], function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed')
          .and('to have passed test count', 2)  // 'normal test' and 'another normal test' should pass
          .and('to have failed test count', 1); // 'outer test with nested test' should fail
        done();
      });
    });
  });

  describe('async nested tests', function () {
    it('should handle synchronous nested tests', function (done) {
      var fixture = path.join('nested-tests', 'bdd-async-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd', '--grep', 'sync nested test'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /nested in sync.*detected inside.*sync nested test/);
          done();
        },
        spawnOpts
      );
    });

    it('should handle async/await nested tests', function (done) {
      var fixture = path.join('nested-tests', 'bdd-async-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd', '--grep', 'async/await nested test'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /nested in async.*detected inside.*async\/await nested test/);
          done();
        },
        spawnOpts
      );
    });

    it('should handle callback-based nested tests as uncaught errors', function (done) {
      var fixture = path.join('nested-tests', 'bdd-async-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd', '--grep', 'callback nested test'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /Uncaught.*nested in callback.*detected inside.*callback nested test/);
          done();
        },
        spawnOpts
      );
    });

    it('should handle promise-based nested tests as uncaught errors', function (done) {
      var fixture = path.join('nested-tests', 'bdd-async-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd', '--grep', 'promise nested test'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /Uncaught.*nested in promise.*detected inside.*promise nested test/);
          done();
        },
        spawnOpts
      );
    });
  });

  describe('hook nested tests', function () {
    it('should fail when nested tests are detected inside hooks', function (done) {
      var fixture = path.join('nested-tests', 'bdd-hook-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', new RegExp(nestedTestErrorMessage));
          expect(res, 'to have failed with output', /nested test in before hook.*detected inside.*"before all" hook/);
          done();
        },
        spawnOpts
      );
    });
  });

  describe('error details', function () {
    it('should provide helpful error messages with test names', function (done) {
      var fixture = path.join('nested-tests', 'bdd-nested');
      var spawnOpts = {stdio: 'pipe'};
      runMocha(
        fixture,
        ['--ui', 'bdd'],
        function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have failed with output', /Error: Nested test "inner nested test"/);
          expect(res, 'to have failed with output', /detected inside "outer test with nested test"/);
          expect(res, 'to have failed with output', /createUnsupportedError/);
          done();
        },
        spawnOpts
      );
    });
  });
});
