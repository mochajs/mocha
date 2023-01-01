'use strict';

var helpers = require('../helpers');
var runMocha = helpers.runMocha;
var runMochaJSON = helpers.runMochaJSON;

var FIXTURE = 'options/shard';

describe('--shard', function () {
  it('should run specs for a given shard 1/2', function (done) {
    runMochaJSON(FIXTURE, ['--shard', '1/2'], function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 2)
        .and('not to have pending tests');
      done();
    });
  });

  it('should run specs for a given shard 2/2', function (done) {
    runMochaJSON(FIXTURE, ['--shard', '2/2'], function (err, res) {
      if (err) {
        return done(err);
      }
      expect(res, 'to have passed')
        .and('to have passed test count', 1)
        .and('not to have pending tests');
      done();
    });
  });

  it('should fail if the parameter has non numeric value', function (done) {
    var spawnOpts = {stdio: 'pipe'};
    runMocha(
      FIXTURE,
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
      FIXTURE,
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
