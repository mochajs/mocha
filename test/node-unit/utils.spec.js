"use strict";

const rewiremock = require("rewiremock/node");

describe("utils", function () {
  let utils;

  beforeEach(function () {
    // add deps to be mocked as needed to second parameter
    utils = rewiremock.proxy("../../lib/utils", {});
  });

  describe("function", function () {
    describe("cwd()", function () {
      it("should return the current working directory", function () {
        expect(utils.cwd(), "to be", process.cwd());
      });
    });

    describe("type()", function () {
      it('should return "function" if the parameter is an async function', function () {
        expect(
          utils.type(async () => {}),
          "to be",
          "function",
        );
      });
      it('should return "error" if the parameter is an Error', function () {
        expect(utils.type(new Error("err")), "to be", "error");
      });
    });
    describe("canonicalType()", function () {
      it('should return "buffer" if the parameter is a Buffer', function () {
        expect(
          utils.canonicalType(Buffer.from("ff", "hex")),
          "to be",
          "buffer",
        );
      });
      it('should return "asyncfunction" if the parameter is an async function', function () {
        expect(
          utils.canonicalType(async () => {}),
          "to be",
          "asyncfunction",
        );
      });
    });
    describe("isNumeric()", function () {
      it("returns true for a number type", function () {
        expect(utils.isNumeric(42), "to equal", true);
      });
      it("returns true for a string that can be parsed as a number", function () {
        expect(utils.isNumeric("42"), "to equal", true);
      });
      it("returns false for a string that cannot be parsed as a number", function () {
        expect(utils.isNumeric("foo"), "to equal", false);
      });
      it("returns false for empty string", function () {
        expect(utils.isNumeric(""), "to equal", false);
      });
      it("returns false for empty string with many whitespaces", function () {
        expect(utils.isNumeric("    "), "to equal", false);
      });
      it("returns true for stringified zero", function () {
        expect(utils.isNumeric("0"), "to equal", true);
      });
    });
  });
});
