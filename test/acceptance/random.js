'use strict';

var mocha = require('../..');
// yuk
var Mocha = mocha.Mocha || mocha;
var utils = require('../../lib/utils');

describe('random option', function() {
  describe('seed', function() {
    it('should return a hex string', function() {
      expect(Mocha.seed())
        .to
        .match(/^0x[0-9A-F]+/);
    });

    it('should be a valid seed', function() {
      expect(utils.toSafeUnsignedInteger(Mocha.seed())).to.be.a('number');
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
        mocha = new Mocha({ random: false });
      });

      it('should not populate the "randomConfig" option', function() {
        expect(mocha.options.randomConfig).to.be(undefined);
      });
    });

    describe('and that option is undefined', function() {
      it('should not populate the "randomConfig" option', function() {
        expect(mocha.options.randomConfig).to.be(undefined);
      });
    });

    describe('and that option is not an integer or convertable string', function() {
      it('should throw', function() {
        expect(function() {
          new Mocha({random: true});
        })
          .to
          .throwException(Error);
      });
    });

    describe('and that option is a valid seed', function() {
      var seed;

      beforeEach(function() {
        seed = '0xDEADBEEF';
        mocha = new Mocha({ random: seed });
      });

      describe('randomConfig', function() {
        it('should be defined', function() {
          expect(mocha.options.randomConfig).not.to.be(undefined);
        });

        it('should define a "seed" prop', function() {
          expect(mocha.options.randomConfig.seed).to.equal(0xDEADBEEF);
        });

        it('should define a hexadecimal representation in the "hex" prop', function() {
          expect(mocha.options.randomConfig.hex).to.equal(seed);
        });

        it('should define a function to shuffle tests in the "shuffleTests" prop', function() {
          expect(mocha.options.randomConfig.shuffleTests).to.be.a('function');
        });
      });

    });
  });
});
