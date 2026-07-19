/* global BigInt */
"use strict";

var utils = require("../../lib/utils.js");
var pkg = require("../../package.json");
var sinon = require("sinon");

describe("lib/utils", function () {
  afterEach(function () {
    sinon.restore();
  });

  describe("clean()", function () {
    it("should remove the wrapping function declaration", function () {
      expect(
        utils.clean("function  (one, two, three)  {\n//code\n}"),
        "to be",
        "//code",
      );
    });

    it("should handle newlines in the function declaration", function () {
      expect(
        utils.clean("function  (one, two, three)\n  {\n//code\n}"),
        "to be",
        "//code",
      );
    });

    it("should remove space character indentation from the function body", function () {
      expect(
        utils.clean("  //line1\n    //line2"),
        "to be",
        "//line1\n  //line2",
      );
    });

    it("should remove tab character indentation from the function body", function () {
      expect(
        utils.clean("\t//line1\n\t\t//line2"),
        "to be",
        "//line1\n\t//line2",
      );
    });

    it("should handle functions with tabs in their declarations", function () {
      expect(utils.clean("function\t(\t)\t{\n//code\n}"), "to be", "//code");
    });

    it("should handle named functions without space after name", function () {
      expect(
        utils.clean("function withName() {\n//code\n}"),
        "to be",
        "//code",
      );
    });

    it("should handle named functions with space after name", function () {
      expect(
        utils.clean("function withName () {\n//code\n}"),
        "to be",
        "//code",
      );
    });

    it("should handle functions with no space between the end and the closing brace", function () {
      expect(utils.clean("function() {/*code*/}"), "to be", "/*code*/");
    });

    it("should handle functions with parentheses in the same line", function () {
      expect(
        utils.clean("function() { if (true) { /* code */ } }"),
        "to be",
        "if (true) { /* code */ }",
      );
    });

    it("should handle empty functions", function () {
      expect(utils.clean("function() {}"), "to be", "");
    });

    it("should format a single line test function", function () {
      var fn = ["function () {", "  var a = 1;", "}"].join("\n");
      expect(utils.clean(fn), "to be", "var a = 1;");
    });

    it("should format a multi line test indented with spaces", function () {
      // and no new lines after curly braces, shouldn't matter
      var fn = [
        "function(){  var a = 1;",
        // this one has more spaces
        "    var b = 2;",
        "  var c = 3;  }",
      ].join("\n");
      expect(utils.clean(fn), "to be", "var a = 1;\n  var b = 2;\nvar c = 3;");
    });

    it("should format a multi line test indented with tabs", function () {
      var fn = [
        "function (arg1, arg2)   {",
        "\tif (true) {",
        "\t\tvar a = 1;",
        "\t}",
        "}",
      ].join("\n");
      expect(utils.clean(fn), "to be", "if (true) {\n\tvar a = 1;\n}");
    });

    it("should format functions saved in windows style - spaces", function () {
      var fn = [
        "function (one) {",
        "   do {",
        '    "nothing";',
        "   } while (false);",
        " }",
      ].join("\r\n");
      expect(utils.clean(fn), "to be", 'do {\n "nothing";\n} while (false);');
    });

    it("should format functions saved in windows style - tabs", function () {
      var fn = [
        "function ( )   {",
        "\tif (false) {",
        "\t\tvar json = {",
        "\t\t\tone : 1",
        "\t\t};",
        "\t}",
        "}",
      ].join("\r\n");
      expect(
        utils.clean(fn),
        "to be",
        "if (false) {\n\tvar json = {\n\t\tone : 1\n\t};\n}",
      );
    });

    it("should format es6 arrow functions", function () {
      var fn = ["() => {", "  var a = 1;", "}"].join("\n");
      expect(utils.clean(fn), "to be", "var a = 1;");
    });

    it("should format es6 arrow functions with implicit return", function () {
      var fn = "() => foo()";
      expect(utils.clean(fn), "to be", "foo()");
    });
  });

  describe("stringify()", function () {
    var stringify = utils.stringify;

    it("should return an object representation of a string created with a String constructor", function () {
      /* eslint no-new-wrappers: off */
      expect(
        stringify(new String("foo")),
        "to be",
        '{\n  "0": "f"\n  "1": "o"\n  "2": "o"\n}',
      );
    });

    it("should return Buffer with .toJSON representation", function () {
      expect(stringify(Buffer.from([0x01])), "to be", "[\n  1\n]");
      expect(stringify(Buffer.from([0x01, 0x02])), "to be", "[\n  1\n  2\n]");

      expect(
        stringify(Buffer.from("ABCD")),
        "to be",
        "[\n  65\n  66\n  67\n  68\n]",
      );
    });

    it("should return Date object with .toISOString() + string prefix", function () {
      expect(
        stringify(new Date(0)),
        "to be",
        "[Date: " + new Date(0).toISOString() + "]",
      );

      var date = new Date(); // now
      expect(stringify(date), "to be", "[Date: " + date.toISOString() + "]");
    });

    it("should return invalid Date object with .toString() + string prefix", function () {
      expect(
        stringify(new Date("")),
        "to be",
        "[Date: " + new Date("").toString() + "]",
      );
    });

    describe("#Number", function () {
      it("should show the handle -0 situations", function () {
        expect(stringify(-0), "to be", "-0");
        expect(stringify(0), "to be", "0");
        expect(stringify("-0"), "to be", '"-0"');
      });

      it("should work well with `NaN` and `Infinity`", function () {
        expect(stringify(NaN), "to be", "NaN");
        expect(stringify(Infinity), "to be", "Infinity");
        expect(stringify(-Infinity), "to be", "-Infinity");
      });

      it("floats and ints", function () {
        expect(stringify(1), "to be", "1");
        expect(stringify(1.2), "to be", "1.2");
        expect(stringify(1e9), "to be", "1000000000");
      });

      if (typeof BigInt === "function") {
        it("should work with bigints when possible", function () {
          expect(stringify(BigInt(1)), "to be", "1n");
          expect(stringify(BigInt(2)), "to be", "2n");
        });
      }
    });

    describe("canonicalize example", function () {
      it("should represent the actual full result", function () {
        var expected = {
          str: "string",
          int: 90,
          float: 9.99,
          boolean: false,
          nil: null,
          undef: undefined,
          regex: /^[a-z|A-Z]/,
          date: new Date(0),
          func: function () {},
          infi: Infinity,
          nan: NaN,
          zero: -0,
          buffer: Buffer.from([0x01, 0x02]),
          array: [1, 2, 3],
          empArr: [],
          matrix: [[1], [2, 3, 4]],
          object: { a: 1, b: 2 },
          canObj: { a: { b: 1, c: 2 }, b: {} },
          empObj: {},
        };
        expected.circular = expected; // Make `Circular` situation
        var actual = [
          "{",
          '  "array": [',
          "    1",
          "    2",
          "    3",
          "  ]",
          '  "boolean": false',
          '  "buffer": [Buffer: [',
          "    1",
          "    2",
          "  ]]",
          '  "canObj": {',
          '    "a": {',
          '      "b": 1',
          '      "c": 2',
          "    }",
          '    "b": {}',
          "  }",
          '  "circular": [Circular]',
          '  "date": [Date: 1970-01-01T00:00:00.000Z]',
          '  "empArr": []',
          '  "empObj": {}',
          '  "float": 9.99',
          '  "func": [Function]',
          '  "infi": Infinity',
          '  "int": 90',
          '  "matrix": [',
          "    [",
          "      1",
          "    ]",
          "    [",
          "      2",
          "      3",
          "      4",
          "    ]",
          "  ]",
          '  "nan": NaN',
          '  "nil": [null]',
          '  "object": {',
          '    "a": 1',
          '    "b": 2',
          "  }",
          '  "regex": /^[a-z|A-Z]/',
          '  "str": "string"',
          '  "undef": [undefined]',
          '  "zero": -0',
          "}",
        ].join("\n");
        expect(stringify(expected), "to be", actual);
      });

      describe("should represent null prototypes", function () {
        it("Without properties", function () {
          const foo = Object.create(null, {});
          const expected = "{}";

          expect(stringify(foo), "to be", expected);
        });

        it("With explicit names", function () {
          const foo = Object.create(null, {
            [Symbol.toStringTag]: { value: "Foo" },
            bing: { get: () => "bong", enumerable: true },
          });
          const expected = [
            "{",
            '  "[Symbol.toStringTag]": "Foo"',
            '  "bing": "bong"',
            "}",
          ].join("\n");

          expect(stringify(foo), "to be", expected);
        });

        it("Without names", function () {
          const unnamed = {
            bing: "bong",
            abc: 123,
          };
          unnamed.self = unnamed;
          const expected = [
            "{",
            '  "abc": 123',
            '  "bing": "bong"',
            '  "self": [Circular]',
            "}",
          ].join("\n");

          expect(
            stringify(Object.setPrototypeOf(unnamed, null)),
            "to be",
            expected,
          );
        });
      });
    });

    it("should canonicalize the object", function () {
      var travis = { name: "travis", age: 24 };
      var travis2 = { age: 24, name: "travis" };

      expect(stringify(travis), "to be", stringify(travis2));
    });

    it("should handle circular structures in objects", function () {
      var travis = { name: "travis" };
      travis.whoami = travis;

      expect(
        stringify(travis),
        "to be",
        '{\n  "name": "travis"\n  "whoami": [Circular]\n}',
      );
    });

    it("should handle circular structures in arrays", function () {
      var travis = ["travis"];
      travis.push(travis);

      expect(stringify(travis), "to be", '[\n  "travis"\n  [Circular]\n]');
    });

    it("should handle circular structures in functions", function () {
      var travis = function () {};
      travis.fn = travis;

      expect(stringify(travis), "to be", '{\n  "fn": [Circular]\n}');
    });

    it("should handle various non-undefined, non-null, non-object, non-array, non-date, and non-function values", function () {
      var regexp = /(?:)/;
      var regExpObj = { regexp };
      var regexpString = "/(?:)/";

      expect(
        stringify(regExpObj),
        "to be",
        '{\n  "regexp": ' + regexpString + "\n}",
      );
      expect(stringify(regexp), "to be", regexpString);

      var number = 1;
      var numberObj = { number };
      var numberString = "1";

      expect(stringify(numberObj), "to be", '{\n  "number": ' + number + "\n}");
      expect(stringify(number), "to be", numberString);

      var boolean = false;
      var booleanObj = { boolean };
      var booleanString = "false";

      expect(
        stringify(booleanObj),
        "to be",
        '{\n  "boolean": ' + boolean + "\n}",
      );
      expect(stringify(boolean), "to be", booleanString);

      var string = "sneepy";
      var stringObj = { string };

      expect(
        stringify(stringObj),
        "to be",
        '{\n  "string": "' + string + '"\n}',
      );
      expect(stringify(string), "to be", JSON.stringify(string));

      var nullValue = null;
      var nullObj = { null: null };
      var nullString = "[null]";

      expect(stringify(nullObj), "to be", '{\n  "null": [null]\n}');
      expect(stringify(nullValue), "to be", nullString);
    });

    it("should handle arrays", function () {
      var array = ["dave", "dave", "dave", "dave"];
      var arrayObj = { array };
      var arrayString = '    "dave"\n    "dave"\n    "dave"\n    "dave"';

      expect(
        stringify(arrayObj),
        "to be",
        '{\n  "array": [\n' + arrayString + "\n  ]\n}",
      );
      expect(
        stringify(array),
        "to be",
        "[" + arrayString.replace(/\s+/g, "\n  ") + "\n]",
      );
    });

    it("should handle functions", function () {
      var fn = function () {};
      var fnObj = { fn };
      var fnString = "[Function]";

      expect(stringify(fnObj), "to be", '{\n  "fn": ' + fnString + "\n}");
      expect(stringify(fn), "to be", "[Function]");
    });

    it("should handle empty objects", function () {
      expect(stringify({}), "to be", "{}");
      expect(stringify({ foo: {} }), "to be", '{\n  "foo": {}\n}');
    });

    it("should handle empty arrays", function () {
      expect(stringify([]), "to be", "[]");
      expect(stringify({ foo: [] }), "to be", '{\n  "foo": []\n}');
    });

    it("should handle non-empty arrays", function () {
      expect(stringify(["a", "b", "c"]), "to be", '[\n  "a"\n  "b"\n  "c"\n]');
    });

    it("should handle empty functions (with no properties)", function () {
      expect(
        stringify(function () {}),
        "to be",
        "[Function]",
      );
      expect(
        stringify({ foo: function () {} }),
        "to be",
        '{\n  "foo": [Function]\n}',
      );
      expect(
        stringify({ foo: function () {}, bar: "baz" }),
        "to be",
        '{\n  "bar": "baz"\n  "foo": [Function]\n}',
      );
    });

    it("should handle functions w/ properties", function () {
      var fn = function () {};
      fn.bar = "baz";
      expect(stringify(fn), "to be", '{\n  "bar": "baz"\n}');
      expect(
        stringify({ foo: fn }),
        "to be",
        '{\n  "foo": {\n    "bar": "baz"\n  }\n}',
      );
    });

    it("should handle undefined values", function () {
      expect(
        stringify({ foo: undefined }),
        "to be",
        '{\n  "foo": [undefined]\n}',
      );
      expect(
        stringify({ foo: "bar", baz: undefined }),
        "to be",
        '{\n  "baz": [undefined]\n  "foo": "bar"\n}',
      );
      expect(stringify(), "to be", "[undefined]");
    });

    it("should recurse", function () {
      expect(
        stringify({ foo: { bar: { baz: { quux: { herp: "derp" } } } } }),
        "to be",
        '{\n  "foo": {\n    "bar": {\n      "baz": {\n        "quux": {\n          "herp": "derp"\n        }\n      }\n    }\n  }\n}',
      );
    });

    it("might get confusing", function () {
      expect(stringify(null), "to be", "[null]");
    });

    it("should not freak out if it sees a primitive twice", function () {
      expect(
        stringify({ foo: null, bar: null }),
        "to be",
        '{\n  "bar": [null]\n  "foo": [null]\n}',
      );
      expect(
        stringify({ foo: 1, bar: 1 }),
        "to be",
        '{\n  "bar": 1\n  "foo": 1\n}',
      );
    });

    it("should stringify dates", function () {
      var date = new Date(0);
      expect(stringify(date), "to be", "[Date: 1970-01-01T00:00:00.000Z]");
      expect(
        stringify({ date }),
        "to be",
        '{\n  "date": [Date: 1970-01-01T00:00:00.000Z]\n}',
      );
    });

    it("should handle object without an Object prototype", function () {
      var a;
      if (Object.create) {
        a = Object.create(null);
      } else {
        a = {};
      }
      a.foo = 1;

      expect(stringify(a), "to be", '{\n  "foo": 1\n}');
    });

    // In old version node.js, Symbol is not available by default.
    if (typeof global.Symbol === "function") {
      it("should handle Symbol", function () {
        var symbol = Symbol("value");
        expect(stringify(symbol), "to match", /^Symbol\(value\)/);
        expect(stringify({ symbol }), "to match", /"symbol": Symbol\(value\)/);
      });
    }

    it("should handle length properties that cannot be coerced to a number", function () {
      expect(
        stringify({ length: { nonBuiltinProperty: 0 } }),
        "to be",
        '{\n  "length": {\n    "nonBuiltinProperty": 0\n  }\n}',
      );
      expect(
        stringify({ length: "a string where length should be" }),
        "to be",
        '{\n  "length": "a string where length should be"\n}',
      );
    });
  });

  describe("type()", function () {
    var type = utils.type;
    var toString = Object.prototype.toString;

    beforeEach(function () {
      // some JS engines such as PhantomJS 1.x exhibit this behavior
      Object.prototype.toString = function () {
        if (this === global) {
          return "[object DOMWindow]";
        }
        return toString.call(this);
      };
    });

    it("should recognize various types", function () {
      expect(type({}), "to be", "object");
      expect(type([]), "to be", "array");
      expect(type(1), "to be", "number");
      expect(type(Infinity), "to be", "number");
      expect(type(null), "to be", "null");
      expect(type(undefined), "to be", "undefined");
      expect(type(new Date()), "to be", "object");
      expect(type(/foo/), "to be", "object");
      expect(type("type"), "to be", "string");
      expect(type(new Error()), "to be", "error");
      expect(type(global), "to be", "object");
      expect(type(true), "to be", "boolean");
      expect(type(Buffer.from("ff", "hex")), "to be", "object");
      expect(type(Symbol.iterator), "to be", "symbol");
      expect(type(new Map()), "to be", "object");
      expect(type(new WeakMap()), "to be", "object");
      expect(type(new Set()), "to be", "object");
      expect(type(new WeakSet()), "to be", "object");
      expect(
        type(async () => {}),
        "to be",
        "function",
      );
    });

    describe("when toString on null or undefined stringifies window", function () {
      it("should recognize null and undefined", function () {
        expect(type(null), "to be", "null");
        expect(type(undefined), "to be", "undefined");
      });
    });

    afterEach(function () {
      Object.prototype.toString = toString;
    });
  });

  describe("canonicalType()", function () {
    var type = utils.canonicalType;
    var toString = Object.prototype.toString;

    beforeEach(function () {
      // some JS engines such as PhantomJS 1.x exhibit this behavior
      Object.prototype.toString = function () {
        if (this === global) {
          return "[object DOMWindow]";
        }
        return toString.call(this);
      };
    });

    it("should recognize various types", function () {
      expect(type({}), "to be", "object");
      expect(type([]), "to be", "array");
      expect(type(1), "to be", "number");
      expect(type(Infinity), "to be", "number");
      expect(type(null), "to be", "null");
      expect(type(undefined), "to be", "undefined");
      expect(type(new Date()), "to be", "date");
      expect(type(/foo/), "to be", "regexp");
      expect(type("type"), "to be", "string");
      expect(type(global), "to be", "domwindow");
      expect(type(true), "to be", "boolean");
    });

    describe("when toString on null or undefined stringifies window", function () {
      it("should recognize null and undefined", function () {
        expect(type(null), "to be", "null");
        expect(type(undefined), "to be", "undefined");
      });
    });

    afterEach(function () {
      Object.prototype.toString = toString;
    });
  });

  describe("isPromise()", function () {
    it("should return true if the value is Promise-ish", function () {
      expect(
        utils.isPromise({
          then: function () {},
        }),
        "to be",
        true,
      );
    });

    it("should return false if the value is not an object", function () {
      expect(utils.isPromise(1), "to be", false);
    });

    it('should return false if the value is an object w/o a "then" function', function () {
      expect(utils.isPromise({}), "to be", false);
    });

    it("should return false if the object is null", function () {
      expect(utils.isPromise(null), "to be", false);
    });
  });

  describe("escape()", function () {
    [
      ["null", null, "null"],
      ["undefined", undefined, "undefined"],
      ["number", 42, "42"],
      ["boolean", false, "false"],
      ["object", { toString: () => "<tag>" }, "&#x3C;tag&#x3E;"],
    ].forEach(function ([label, input, expected]) {
      it(`coerces ${label} to a string before escaping`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      [
        "alphanumeric",
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
      ],
      ["safe punctuation", " !#$%()*+,-./:;=?@[\\]^_{|}~"],
    ].forEach(function ([label, input]) {
      it(`leaves safe ascii ${label} unchanged`, function () {
        expect(utils.escape(input), "to be", input);
      });
    });

    [
      ["less-than signs", "<a<bc<d<", "&#x3C;a&#x3C;bc&#x3C;d&#x3C;"],
      ["greater-than signs", ">a>bc>d>", "&#x3E;a&#x3E;bc&#x3E;d&#x3E;"],
      ["double quotes", '"a"bc"d"', "&#x22;a&#x22;bc&#x22;d&#x22;"],
      ["ampersands", "&a&bc&d&", "&#x26;a&#x26;bc&#x26;d&#x26;"],
      ["existing entities", "&amp;&lt;", "&#x26;amp;&#x26;lt;"],
      [
        "all sensitive punctuation",
        "<>\"&'`",
        "&#x3C;&#x3E;&#x22;&#x26;&#x27;&#x60;",
      ],
    ].forEach(function ([label, input, expected]) {
      it(`replaces ${label} with uppercase hexadecimal references`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      ["nul", "\x00", "\x00"],
      ["start of heading", "\x01", "&#x1;"],
      ["start of text", "\x02", "&#x2;"],
      ["end of text", "\x03", "&#x3;"],
      ["end of transmission", "\x04", "&#x4;"],
      ["enquiry", "\x05", "&#x5;"],
      ["acknowledge", "\x06", "&#x6;"],
      ["bell", "\x07", "&#x7;"],
      ["backspace", "\x08", "&#x8;"],
      ["tab", "\x09", "&#x9;"],
      ["line feed", "\x0A", "\n"],
      ["vertical tab", "\x0B", "&#xB;"],
      ["form feed", "\x0C", "&#xC;"],
      ["carriage return", "\x0D", "\r"],
      ["shift out", "\x0E", "&#xE;"],
      ["shift in", "\x0F", "&#xF;"],
      ["data link escape", "\x10", "&#x10;"],
      ["device control one", "\x11", "&#x11;"],
      ["device control two", "\x12", "&#x12;"],
      ["device control three", "\x13", "&#x13;"],
      ["device control four", "\x14", "&#x14;"],
      ["negative acknowledge", "\x15", "&#x15;"],
      ["synchronous idle", "\x16", "&#x16;"],
      ["end transmission block", "\x17", "&#x17;"],
      ["cancel", "\x18", "&#x18;"],
      ["end of medium", "\x19", "&#x19;"],
      ["substitute", "\x1A", "&#x1A;"],
      ["escape", "\x1B", "&#x1B;"],
      ["file separator", "\x1C", "&#x1C;"],
      ["group separator", "\x1D", "&#x1D;"],
      ["record separator", "\x1E", "&#x1E;"],
      ["unit separator", "\x1F", "&#x1F;"],
    ].forEach(function ([label, input, expected]) {
      it(`handles C0 control ${label}`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      ["delete", "\x7F", "&#x7F;"],
      ["padding character", "\x80", "\x80"],
      ["high octet preset", "\x81", "&#x81;"],
      ["partial line backward", "\x8C", "\x8C"],
      ["reverse line feed", "\x8D", "&#x8D;"],
      ["single shift two", "\x8E", "\x8E"],
      ["single shift three", "\x8F", "&#x8F;"],
      ["device control string", "\x90", "&#x90;"],
      ["private use one", "\x91", "\x91"],
      ["string terminator", "\x9C", "\x9C"],
      ["operating system command", "\x9D", "&#x9D;"],
      ["privacy message", "\x9E", "\x9E"],
      ["application program command", "\x9F", "\x9F"],
    ].forEach(function ([label, input, expected]) {
      it(`handles C1 control ${label}`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      ["copyright sign", "©", "&#xA9;"],
      ["latin small e acute", "é", "&#xE9;"],
      ["em dash", "—", "&#x2014;"],
      ["CJK character", "中", "&#x4E2D;"],
      ["replacement character", "\uFFFD", "&#xFFFD;"],
      ["noncharacter FFFE", "\uFFFE", "&#xFFFE;"],
      ["noncharacter FFFF", "\uFFFF", "&#xFFFF;"],
    ].forEach(function ([label, input, expected]) {
      it(`replaces non-ascii unicode ${label}`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      ["pile of poo", "💩", "&#x1F4A9;"],
      ["grinning face", "😀", "&#x1F600;"],
      ["tetragram", "𝌆", "&#x1D306;"],
      ["CJK extension", "𠜎", "&#x2070E;"],
    ].forEach(function ([label, input, expected]) {
      it(`replaces astral unicode ${label} as one code point`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    [
      ["lone high surrogate", "\uD800", "&#xD800;"],
      ["lone low surrogate", "\uDC00", "&#xDC00;"],
      ["high surrogate between ascii", "a\uD800b", "a&#xD800;b"],
      ["low surrogate between ascii", "a\uDC00b", "a&#xDC00;b"],
    ].forEach(function ([label, input, expected]) {
      it(`replaces ${label}`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    it("does not rely on he as a runtime dependency", function () {
      expect(pkg.dependencies, "not to have key", "he");
    });

    [
      ["ansi color escapes", "\x1B[32mfoo\x1B[0m", "&#x1B;[32mfoo&#x1B;[0m"],
      ["ascii whitespace controls", "\t\n\r", "&#x9;\n\r"],
      ["mixed null and C1 controls", "\0\x7F\x80\x81", "\0&#x7F;\x80&#x81;"],
    ].forEach(function ([label, input, expected]) {
      it(`replaces ${label}`, function () {
        expect(utils.escape(input), "to be", expected);
      });
    });

    it("replaces unpaired surrogates without consuming neighboring characters", function () {
      expect(
        utils.escape("\uD800\uD800\uDC00\uDC00"),
        "to be",
        "&#xD800;&#x10000;&#xDC00;",
      );
    });

    it("escapes mixed reporter content in order", function () {
      expect(
        utils.escape("Suite <root> failed: 💩 & \x1B[31mred\x1B[0m"),
        "to be",
        "Suite &#x3C;root&#x3E; failed: &#x1F4A9; &#x26; &#x1B;[31mred&#x1B;[0m",
      );
    });
  });

  describe("createMap()", function () {
    it("should return an object with a null prototype", function () {
      expect(Object.getPrototypeOf(utils.createMap()), "to be", null);
    });

    it("should add props to the object", function () {
      expect(utils.createMap({ foo: "bar" }), "to exhaustively satisfy", {
        foo: "bar",
      });
    });

    it("should add props from all object parameters to the object", function () {
      expect(
        utils.createMap({ foo: "bar" }, { bar: "baz" }),
        "to exhaustively satisfy",
        { foo: "bar", bar: "baz" },
      );
    });
  });

  describe("slug()", function () {
    it("should convert the string to lowercase", function () {
      expect(utils.slug("FOO"), "to be", "foo");
    });

    it("should convert whitespace to dashes", function () {
      expect(
        utils.slug("peanut butter\nand\tjelly"),
        "to be",
        "peanut-butter-and-jelly",
      );
    });

    it("should strip non-alphanumeric and non-dash characters", function () {
      expect(utils.slug("murder-hornets!!"), "to be", "murder-hornets");
    });

    it("should disallow consecutive dashes", function () {
      expect(utils.slug("poppies & fritz"), "to be", "poppies-fritz");
    });
  });

  describe("castArray()", function () {
    describe("when provided an array value", function () {
      it("should return a copy of the array", function () {
        const v = ["foo", "bar", "baz"];
        expect(utils.castArray(v), "to equal", ["foo", "bar", "baz"]).and(
          "not to be",
          v,
        );
      });
    });

    describe('when provided an "arguments" value', function () {
      it("should return an array containing the arguments", function () {
        (function () {
          expect(utils.castArray(arguments), "to equal", [
            "foo",
            "bar",
            "baz",
          ]).and("not to be", arguments);
        })("foo", "bar", "baz");
      });
    });

    describe("when provided an object", function () {
      it("should return an array containing the object only", function () {
        const v = { foo: "bar" };
        expect(utils.castArray(v), "to equal", [v]);
      });
    });

    describe("when provided no parameters", function () {
      it("should return an empty array", function () {
        expect(utils.castArray(), "to equal", []);
      });
    });

    describe("when provided a primitive value", function () {
      it("should return an array containing the primitive value only", function () {
        expect(utils.castArray("butts"), "to equal", ["butts"]);
      });
    });

    describe("when provided null", function () {
      it("should return an array containing a null value only", function () {
        expect(utils.castArray(null), "to equal", [null]);
      });
    });
  });

  describe("uniqueID()", function () {
    it("should return a non-empty string", function () {
      expect(utils.uniqueID(), "to be a string").and("not to be empty");
    });
    it("should have length of 21", function () {
      expect(utils.uniqueID().length, "to equal", 21);
    });
  });
});
