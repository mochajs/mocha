'use strict';

var helpers = require('../helpers');
const {posix: path} = require('path');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;
var resolvePath = helpers.resolveFixturePath;

describe('--shard', function () {
  var fixtures = {
    alpha: {
      name: 'alpha',
      suiteCount: 1,
      path: path.join('options', 'shard-file-alpha')
    },
    beta: {
      name: 'beta',
      suiteCount: 4,
      path: path.join('options', 'shard-file-beta')
    },
    theta: {
      name: 'theta',
      suiteCount: 5,
      path: path.join('options', 'shard-file-theta')
    }
  };

  const combinations = [
    // Each combination with distinct files
    [fixtures.alpha, fixtures.beta, fixtures.theta],
    [fixtures.alpha, fixtures.theta, fixtures.beta],
    [fixtures.beta, fixtures.alpha, fixtures.theta],
    [fixtures.beta, fixtures.theta, fixtures.alpha],
    [fixtures.theta, fixtures.alpha, fixtures.beta],
    [fixtures.theta, fixtures.beta, fixtures.alpha]
  ];

  const shards = ['1/2', '2/2'];

  for (const [fixture1, fixture2, fixture3] of combinations) {
    for (const shard of shards) {
      const testName = `should run specs for combination of ${fixture1.name}, ${fixture2.name}, and ${fixture3.name} on shard ${shard}`;
      let expectedCount;

      if (shard === shards[0]) {
        expectedCount = fixture1.suiteCount + fixture3.suiteCount;
      } else {
        expectedCount = fixture2.suiteCount;
      }

      it(testName, function (done) {
        const args = [
          '--file',
          resolvePath(fixture1.path),
          '--file',
          resolvePath(fixture2.path),
          '--shard',
          shard
        ];
        // Test that come in through --file are always run first
        runMochaJSON(fixture3.path, args, function (err, res) {
          if (err) {
            return done(err);
          }
          expect(res, 'to have passed')
            .and('to have suite count', expectedCount)
            .and('not to have pending tests');
          done();
        });
      });
    }
  }

  it('should fail if the parameter has non numeric value', function (done) {
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixtures.alpha.path,
      ['--shard', '1/a'],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(res, 'to have failed with output', /Invalid shard values/);
        done();
      },
      spawnOpts
    );
  });

  it('should fail if the parameter has invalid numeric value', function (done) {
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      fixtures.alpha.path,
      ['--shard', '2/1'],
      function (err, res) {
        if (err) {
          return done(err);
        }
        expect(
          res,
          'to have failed with output',
          /Desired shard must be greater than 0 and less than total shards./
        );
        done();
      },
      spawnOpts
    );
  });
});
