'use strict';

var Mocha = require('../..').Mocha;

describe('random option', function() {
  describe('seed', function() {
    it('should return a number', function() {
      expect(Mocha.seed())
        .to
        .be
        .a('number');
    });

    it('should return a positive number', function() {
      expect(Mocha.seed() > 0)
        .to
        .be(true);
    });

    it('should return a finite number', function() {
      expect(Mocha.seed())
        .not
        .to
        .equal(Infinity);
    });
  });

  describe('when Mocha is instantiated with "random" option', function() {
    var mocha;

    describe('and that option is "false"', function() {
      beforeEach(function() {
        mocha = new Mocha({random: false});
      });

      it('should not populate the "randomConfig" option', function() {
        expect(mocha.options.randomConfig).to.be(undefined);
      });
    });

    describe('and that option is "true"', function() {
      beforeEach(function() {
        mocha = new Mocha({random: true});
      });

      it('should populate the "randomConfig" option', function() {
        expect(mocha.options.randomConfig).not.to.be(undefined);
      });

      it('should generate a seed', function() {
        expect(mocha.options.randomConfig.seed).to.be.a('number');
      });

      it('should generate a hexadecimal representation of a seed', function() {
        expect(mocha.options.randomConfig.hex).to.be.a('string');
      });

      it('should expose a "shuffleTests" function', function() {
        expect(mocha.options.randomConfig.shuffleTests).to.be.a('function');
      });
    });
  });
});
