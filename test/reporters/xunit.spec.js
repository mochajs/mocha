"use strict";

var sinon = require("sinon");
var createStatsCollector = require("../../lib/stats-collector");
var reporters = require("../../").reporters;
var errors = require("../../lib/errors");

var XUnit = reporters.XUnit;
var JUnit = reporters.JUnit;

describe("XUnit reporter (deprecated)", function () {
  var runner;
  var noop = function () {};

  beforeEach(function () {
    runner = { on: noop, once: noop };
    createStatsCollector(runner);
  });

  afterEach(function () {
    sinon.restore();
    // clear the deprecation cache so each test starts fresh
    errors.deprecate.cache = {};
  });

  it("should be a subclass of JUnit", function () {
    var xunit = new XUnit(runner);
    expect(xunit, "to be a", JUnit);
  });

  it("should emit a deprecation warning on construction", function () {
    var emitWarnStub = sinon.stub(process, "emitWarning");

    new XUnit(runner);

    expect(emitWarnStub.calledOnce, "to be true");
    expect(emitWarnStub.firstCall.args[0], "to contain", "deprecated");
    expect(emitWarnStub.firstCall.args[0], "to contain", "junit");
    expect(emitWarnStub.firstCall.args[1], "to be", "DeprecationWarning");
  });

  it("should only emit the deprecation warning once", function () {
    var emitWarnStub = sinon.stub(process, "emitWarning");

    new XUnit(runner);
    new XUnit(runner);

    expect(emitWarnStub.calledOnce, "to be true");
  });

  it("should produce identical output to JUnit reporter", function () {
    var xunitOutput = "";
    var junitOutput = "";

    var xunit = new XUnit(runner);
    sinon.stub(xunit, "write").callsFake(function (str) {
      xunitOutput += str;
    });

    var junit = new JUnit(runner);
    sinon.stub(junit, "write").callsFake(function (str) {
      junitOutput += str;
    });

    var test = {
      isPending: function () {
        return false;
      },
      title: "some test",
      file: "test.js",
      parent: {
        fullTitle: function () {
          return "some suite";
        },
      },
      duration: 500,
    };

    xunit.test(test);
    junit.test(test);

    expect(xunitOutput, "to be", junitOutput);
  });
});
