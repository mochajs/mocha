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
        failures.should.equal(1);
        done();
      });
    });
  });

  describe('.addFile()', function () {
    it('should add the given file to the files array', function () {
      var mocha = new Mocha(blankOpts);
      mocha.addFile('myFile.js');
      mocha.files.length.should.equal(1);
      mocha.files[0].should.equal('myFile.js');
    });
  });

  describe('.invert()', function () {
    it('should set the invert option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.invert();
      mocha.options.invert.should.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.invert().should.equal(mocha);
    });
  });

  describe('.ignoreLeaks()', function () {
    it('should set the ignoreLeaks option to true when param equals true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks(true);
      mocha.options.ignoreLeaks.should.equal(true);
    });

    it('should set the ignoreLeaks option to true when param equals false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks(false);
      mocha.options.ignoreLeaks.should.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.ignoreLeaks(false).should.equal(mocha);
    });
  });

  describe('.checkLeaks()', function () {
    it('should set the ignoreLeaks option to false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.checkLeaks();
      mocha.options.ignoreLeaks.should.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.checkLeaks().should.equal(mocha);
    });
  });

  describe('.fullTrace()', function () {
    it('should set the fullStackTrace option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.fullTrace();
      mocha.options.fullStackTrace.should.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.fullTrace().should.equal(mocha);
    });
  });

  describe('.growl()', function () {
    it('should set the growl option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.growl();
      mocha.options.growl.should.equal(true);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.growl().should.equal(mocha);
    });
  });

  describe('.useInlineDiffs()', function () {
    it('should set the useInlineDiffs option to true when param equals true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs(true);
      mocha.options.useInlineDiffs.should.equal(true);
    });

    it('should set the useInlineDiffs option to true when param equals false', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs(false);
      mocha.options.useInlineDiffs.should.equal(false);
    });

    it('should set the useInlineDiffs option to false when the param is undefined', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs();
      mocha.options.useInlineDiffs.should.equal(false);
    });

    it('should be chainable', function () {
      var mocha = new Mocha(blankOpts);
      mocha.useInlineDiffs().should.equal(mocha);
    });
  });

  describe('.noHighlighting()', function () {
    it('should set the noHighlighting option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.noHighlighting();
      mocha.options.noHighlighting.should.equal(true);
    });
  });

  describe('.allowUncaught()', function () {
    it('should set the allowUncaught option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.allowUncaught();
      mocha.options.allowUncaught.should.equal(true);
    });
  });

  describe('.delay()', function () {
    it('should set the delay option to true', function () {
      var mocha = new Mocha(blankOpts);
      mocha.delay();
      mocha.options.delay.should.equal(true);
    });
  });

});
