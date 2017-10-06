'use strict';

var Mocha = require('../../lib/mocha');
var Test = Mocha.Test;

describe('Mocha', function () {
  var blankOpts = { reporter: function () {} }; // no output

  describe('.run(fn)', function () {
    it('should not raise errors if callback was not provided', function () {
      var mocha = new Mocha(blankOpts);
      mocha.run();
    });

    it('should execute the callback when complete', function (done) {
      var mocha = new Mocha(blankOpts);
      mocha.run(function () {
        done();
      });
    });

    it('should execute the callback with the number of failures ' +
      'as parameter', function (done) {
      var mocha = new Mocha(blankOpts);
      var failingTest = new Test('failing test', function () {
        throw new Error('such fail');
      });
      mocha.suite.addTest(failingTest);
      mocha.run(function (failures) {
        expect(failures).to.equal(1);
        done();
      });
    });
  });

  describe('.addFile()', function () {
    it('should add the given file to the files array', function () {
      var mocha = new Mocha(blankOpts);
      mocha.addFile('myFile.js');
      expect(mocha.files.length).to.equal(1);
      expect(mocha.files[0]).to.equal('myFile.js');
    });
  });

  describe('.invert()', function () {
    it('should set the invert option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.invert();
      expect(mocha.options.invert).to.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.invert()).to.equal(mocha);
    });
  });

  describe('.ignoreLeaks()', function () {
    it('should set the ignoreLeaks option to true when param equals true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks(true);
      expect(mocha.options.ignoreLeaks).to.equal(true);
    });

    it('should set the ignoreLeaks option to false when param equals false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks(false);
      expect(mocha.options.ignoreLeaks).to.equal(false);
    });

    it('should set the ignoreLeaks option to false when the param is undefined', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks();
      expect(mocha.options.ignoreLeaks).to.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.ignoreLeaks(false)).to.equal(mocha);
    });
  });

  describe('.checkLeaks()', function () {
    it('should set the ignoreLeaks option to false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.checkLeaks();
      expect(mocha.options.ignoreLeaks).to.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.checkLeaks()).to.equal(mocha);
    });
  });

  describe('.fullTrace()', function () {
    it('should set the fullStackTrace option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.fullTrace();
      expect(mocha.options.fullStackTrace).to.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.fullTrace()).to.equal(mocha);
    });
  });

  describe('.growl()', function () {
    it('should set the growl option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.growl();
      expect(mocha.options.growl).to.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.growl()).to.equal(mocha);
    });
  });

  describe('.useInlineDiffs()', function () {
    it('should set the useInlineDiffs option to true when param equals true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs(true);
      expect(mocha.options.useInlineDiffs).to.equal(true);
    });

    it('should set the useInlineDiffs option to false when param equals false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs(false);
      expect(mocha.options.useInlineDiffs).to.equal(false);
    });

    it('should set the useInlineDiffs option to false when the param is undefined', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs();
      expect(mocha.options.useInlineDiffs).to.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      expect(mocha.useInlineDiffs()).to.equal(mocha);
    });
  });

  describe('.noHighlighting()', function () {
    it('should set the noHighlighting option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.noHighlighting();
      expect(mocha.options.noHighlighting).to.equal(true);
    });
  });

  describe('.allowUncaught()', function () {
    it('should set the allowUncaught option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.allowUncaught();
      expect(mocha.options.allowUncaught).to.equal(true);
    });
  });

  describe('.delay()', function () {
    it('should set the delay option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.delay();
      expect(mocha.options.delay).to.equal(true);
    });
  });

  describe('.bail()', function () {
    it('should set the suite._bail to true if there is no arguments', function () {
      var mocha = new Mocha({bail: false});
      expect(mocha.suite._bail).to.equal(false);
      mocha.bail();
      expect(mocha.suite._bail).to.equal(true);
    });
  });
});
