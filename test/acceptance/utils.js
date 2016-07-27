var utils = require('../../lib/utils');
var toISOString = require('../../lib/to-iso-string');
var JSON = require('json3');

describe('lib/utils', function () {
  describe('clean', function () {
    it("should format a single line test function", function () {
      var fn = [
        "function () {"
        , "  var a = 1;"
        , "}"
      ].join("\n");
      expect(utils.clean(fn)).to.equal("var a = 1;");
    });

    it("should format a multi line test indented with spaces", function () {
      // and no new lines after curly braces, shouldn't matter
      var fn = [
        "function(){  var a = 1;"
        , "    var b = 2;" // this one has more spaces
        , "  var c = 3;  }"
      ].join("\n");
      expect(utils.clean(fn)).to.equal("var a = 1;\n  var b = 2;\nvar c = 3;");
    });

    it("should format a multi line test indented with tabs", function () {
      var fn = [
        "function (arg1, arg2)   {"
        , "\tif (true) {"
        , "\t\tvar a = 1;"
        , "\t}"
        , "}"
      ].join("\n");
      expect(utils.clean(fn)).to.equal("if (true) {\n\tvar a = 1;\n}");
    });

    it("should format functions saved in windows style - spaces", function () {
      var fn = [
        "function (one) {"
        , "   do {"
        , '    "nothing";'
        , "   } while (false);"
        , ' }'
      ].join("\r\n");
      expect(utils.clean(fn)).to.equal('do {\n "nothing";\n} while (false);');
    });

    it("should format functions saved in windows style - tabs", function () {
      var fn = [
        "function ( )   {"
        , "\tif (false) {"
        , "\t\tvar json = {"
        , '\t\t\tone : 1'
        , '\t\t};'
        , "\t}"
        , "}"
      ].join("\r\n");
      expect(utils.clean(fn)).to.equal("if (false) {\n\tvar json = {\n\t\tone : 1\n\t};\n}");
    });

    it("should format es6 arrow functions", function () {
      var fn = [
        "() => {",
        "  var a = 1;",
        "}"
      ].join("\n");
      expect(utils.clean(fn)).to.equal("var a = 1;");
    });

    it("should format es6 arrow functions with implicit return", function () {
      var fn = "() => foo()";
      expect(utils.clean(fn)).to.equal("foo()");
    });
  });

  describe('stringify', function(){

    var stringify = utils.stringify;

    it('should return Buffer with .toJSON representation', function() {
      expect(stringify(new Buffer([0x01]))).to.equal('[\n  1\n]');
      expect(stringify(new Buffer([0x01, 0x02]))).to.equal('[\n  1\n  2\n]');

      expect(stringify(new Buffer('ABCD'))).to.equal('[\n  65\n  66\n  67\n  68\n]');
    });

    it('should return Date object with .toISOString() + string prefix', function() {
      expect(stringify(new Date(0))).to.equal('[Date: ' + shimToISOString(new Date(0)) + ']');

      var date = new Date(); // now
      expect(stringify(date)).to.equal('[Date: ' + shimToISOString(date) + ']');

      function shimToISOString(date) {
        if (date.toISOString) {
          return date.toISOString();
        } else {
          return toISOString(date);
        }
      }
    });

    it('should return invalid Date object with .toString() + string prefix', function() {
      expect(stringify(new Date(''))).to.equal('[Date: ' + new Date('').toString() + ']');
    });

    describe('#Number', function() {
      it('should show the handle -0 situations', function() {
        expect(stringify(-0)).to.eql('-0');
        expect(stringify(0)).to.eql('0');
        expect(stringify('-0')).to.eql('"-0"');
      });

      it('should work well with `NaN` and `Infinity`', function() {
        expect(stringify(NaN)).to.equal('NaN');
        expect(stringify(Infinity)).to.equal('Infinity');
        expect(stringify(-Infinity)).to.equal('-Infinity');
      });

      it('floats and ints', function() {
        expect(stringify(1)).to.equal('1');
        expect(stringify(1.2)).to.equal('1.2');
        expect(stringify(1e9)).to.equal('1000000000');
      });
    });

    describe('canonicalize example', function() {
      it('should represent the actual full result', function() {
        var expected = {
          str: 'string',
          int: 90,
          float: 9.99,
          boolean: false,
          nil: null,
          undef: undefined,
          regex: /^[a-z|A-Z]/,
          date: new Date(0),
          func: function() {},
          infi: Infinity,
          nan: NaN,
          zero: -0,
          buffer: new Buffer([0x01, 0x02]),
          array: [1,2,3],
          empArr: [],
          matrix: [[1], [2,3,4] ],
          object: { a: 1, b: 2 },
          canObj: { a: { b: 1, c: 2 }, b: {} },
          empObj: {}
        };
        expected.circular = expected; // Make `Circular` situation
        var actual = ['{'
          , '  "array": ['
          , '    1'
          , '    2'
          , '    3'
          , '  ]'
          , '  "boolean": false'
          , '  "buffer": [Buffer: ['
          , '    1'
          , '    2'
          , '  ]]'
          , '  "canObj": {'
          , '    "a": {'
          , '      "b": 1'
          , '      "c": 2'
          , '    }'
          , '    "b": {}'
          , '  }'
          , '  "circular": [Circular]'
          , '  "date": [Date: 1970-01-01T00:00:00.000Z]'
          , '  "empArr": []'
          , '  "empObj": {}'
          , '  "float": 9.99'
          , '  "func": [Function]'
          , '  "infi": Infinity'
          , '  "int": 90'
          , '  "matrix": ['
          , '    ['
          , '      1'
          , '    ]'
          , '    ['
          , '      2'
          , '      3'
          , '      4'
          , '    ]'
          , '  ]'
          , '  "nan": NaN'
          , '  "nil": [null]'
          , '  "object": {'
          , '    "a": 1'
          , '    "b": 2'
          , '  }'
          , '  "regex": /^[a-z|A-Z]/'
          , '  "str": "string"'
          , '  "undef": [undefined]'
          , '  "zero": -0'
          , '}'].join('\n');
        expect(stringify(expected)).to.equal(actual);
      });
    });

    it('should canonicalize the object', function(){
      var travis = { name: 'travis', age: 24 };
      var travis2 = { age: 24, name: 'travis' };

      expect(stringify(travis)).to.equal(stringify(travis2));
    });

    it('should handle circular structures in objects', function(){
      var travis = { name: 'travis' };
      travis.whoami = travis;

      expect(stringify(travis)).to.equal('{\n  "name": "travis"\n  "whoami": [Circular]\n}');
    });

    it('should handle circular structures in arrays', function(){
      var travis = ['travis'];
      travis.push(travis);

      expect(stringify(travis)).to.equal('[\n  "travis"\n  [Circular]\n]');
    });

    it('should handle circular structures in functions', function(){
      var travis = function () {};
      travis.fn = travis;

      expect(stringify(travis)).to.equal('{\n  "fn": [Circular]\n}');
    });


    it('should handle various non-undefined, non-null, non-object, non-array, non-date, and non-function values', function () {
      var regexp = new RegExp("(?:)"),
        regExpObj = { regexp: regexp },
        regexpString = '/(?:)/';

      expect(stringify(regExpObj)).to.equal('{\n  "regexp": ' + regexpString + '\n}');
      expect(stringify(regexp)).to.equal(regexpString);

      var number = 1,
        numberObj = { number: number },
        numberString = '1';

      expect(stringify(numberObj)).to.equal('{\n  "number": ' + number + '\n}');
      expect(stringify(number)).to.equal(numberString);

      var boolean = false,
        booleanObj = { boolean: boolean },
        booleanString = 'false';

      expect(stringify(booleanObj)).to.equal('{\n  "boolean": ' + boolean + '\n}');
      expect(stringify(boolean)).to.equal(booleanString);

      var string = 'sneepy',
        stringObj = { string: string };

      expect(stringify(stringObj)).to.equal('{\n  "string": "' + string + '"\n}');
      expect(stringify(string)).to.equal(JSON.stringify(string));

      var nullValue = null,
        nullObj = { 'null': null },
        nullString = '[null]';

      expect(stringify(nullObj)).to.equal('{\n  "null": [null]\n}');
      expect(stringify(nullValue)).to.equal(nullString);
    });

    it('should handle arrays', function () {
      var array = ['dave', 'dave', 'dave', 'dave'],
        arrayObj = {array: array},
        arrayString = '    "dave"\n    "dave"\n    "dave"\n    "dave"'

      expect(stringify(arrayObj)).to.equal('{\n  "array": [\n' + arrayString + '\n  ]\n}');
      expect(stringify(array)).to.equal('[' + arrayString.replace(/\s+/g, '\n  ') + '\n]');
    });

    it('should handle functions', function () {
      var fn = function() {},
        fnObj = {fn: fn},
        fnString = '[Function]';

      expect(stringify(fnObj)).to.equal('{\n  "fn": ' + fnString + '\n}');
      expect(stringify(fn)).to.equal('[Function]');
    });

    it('should handle empty objects', function () {
      expect(stringify({})).to.equal('{}');
      expect(stringify({foo: {}})).to.equal('{\n  "foo": {}\n}');
    });

    it('should handle empty arrays', function () {
      expect(stringify([])).to.equal('[]');
      expect(stringify({foo: []})).to.equal('{\n  "foo": []\n}');
    });

    it('should handle non-empty arrays', function () {
      expect(stringify(['a', 'b', 'c'])).to.equal('[\n  "a"\n  "b"\n  "c"\n]')
    });

    it('should handle empty functions (with no properties)', function () {
      expect(stringify(function(){})).to.equal('[Function]');
      expect(stringify({foo: function() {}})).to.equal('{\n  "foo": [Function]\n}');
      expect(stringify({foo: function() {}, bar: 'baz'})).to.equal('{\n  "bar": "baz"\n  "foo": [Function]\n}');
    });

    it('should handle functions w/ properties', function () {
      var fn = function(){};
      fn.bar = 'baz';
      expect(stringify(fn)).to.equal('{\n  "bar": "baz"\n}');
      expect(stringify({foo: fn})).to.equal('{\n  "foo": {\n    "bar": "baz"\n  }\n}');
    });

    it('should handle undefined values', function () {
      expect(stringify({foo: undefined})).to.equal('{\n  "foo": [undefined]\n}');
      expect(stringify({foo: 'bar', baz: undefined})).to.equal('{\n  "baz": [undefined]\n  "foo": "bar"\n}');
      expect(stringify()).to.equal('[undefined]');
    });

    it('should recurse', function () {
      expect(stringify({foo: {bar: {baz: {quux: {herp: 'derp'}}}}})).to.equal('{\n  "foo": {\n    "bar": {\n      "baz": {\n        "quux": {\n          "herp": "derp"\n        }\n      }\n    }\n  }\n}');
    });

    it('might get confusing', function () {
      expect(stringify(null)).to.equal('[null]');
    });

    it('should not freak out if it sees a primitive twice', function () {
      expect(stringify({foo: null, bar: null})).to.equal('{\n  "bar": [null]\n  "foo": [null]\n}');
      expect(stringify({foo: 1, bar: 1})).to.equal('{\n  "bar": 1\n  "foo": 1\n}');
    });

    it('should stringify dates', function () {
      var date = new Date(0);
      expect(stringify(date)).to.equal('[Date: 1970-01-01T00:00:00.000Z]');
      expect(stringify({date: date})).to.equal('{\n  "date": [Date: 1970-01-01T00:00:00.000Z]\n}');
    });

    it('should handle object without an Object prototype', function () {
      var a;
      if (Object.create) {
        a = Object.create(null);
      } else {
        a = {};
      }
      a.foo = 1;

      expect(stringify(a)).to.equal('{\n  "foo": 1\n}');
    });

    // In old version node.js, Symbol is not available by default.
    if (typeof global.Symbol === 'function') {
      it('should handle Symbol', function () {
        var symbol = Symbol('value');
        expect(stringify(symbol)).to.equal('Symbol(value)');
        expect(stringify({symbol: symbol})).to.equal('{\n  "symbol": Symbol(value)\n}')
      });
    }

    it('should handle length properties that cannot be coerced to a number', function () {
      expect(stringify({length: {nonBuiltinProperty: 0}})).to.equal('{\n  "length": {\n    "nonBuiltinProperty": 0\n  }\n}');
      expect(stringify({length: "a string where length should be"})).to.equal('{\n  "length": "a string where length should be"\n}');
    });
  });

  describe('type', function () {
    var type = utils.type;
    var toString = Object.prototype.toString;

    beforeEach(function() {
      // some JS engines such as PhantomJS 1.x exhibit this behavior
      Object.prototype.toString = function() {
        if (this === global) {
          return '[object DOMWindow]';
        }
        return toString.call(this);
      };
    });

    it('should recognize various types', function () {
      expect(type({})).to.equal('object');
      expect(type([])).to.equal('array');
      expect(type(1)).to.equal('number');
      expect(type(Infinity)).to.equal('number');
      expect(type(null)).to.equal('null');
      expect(type(undefined)).to.equal('undefined');
      expect(type(new Date())).to.equal('date');
      expect(type(/foo/)).to.equal('regexp');
      expect(type('type')).to.equal('string');
      expect(type(global)).to.equal('domwindow');
      expect(type(true)).to.equal('boolean');
    });

    describe('when toString on null or undefined stringifies window', function () {
      it('should recognize null and undefined', function () {
        expect(type(null)).to.equal('null');
        expect(type(undefined)).to.equal('undefined');
      });
    });

    afterEach(function () {
      Object.prototype.toString = toString;
    });
  });
});
