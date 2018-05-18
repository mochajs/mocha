'use strict';

var utils = require('../../lib/utils');

describe('lib/utils', function() {
  describe('clean', function() {
    it('should remove the wrapping function declaration', function() {
      expect(
        utils.clean('function  (one, two, three)  {\n//code\n}'),
        'to be',
        '//code'
      );
    });

    it('should handle newlines in the function declaration', function() {
      expect(
        utils.clean('function  (one, two, three)\n  {\n//code\n}'),
        'to be',
        '//code'
      );
    });

    it('should remove space character indentation from the function body', function() {
      expect(
        utils.clean('  //line1\n    //line2'),
        'to be',
        '//line1\n  //line2'
      );
    });

    it('should remove tab character indentation from the function body', function() {
      expect(
        utils.clean('\t//line1\n\t\t//line2'),
        'to be',
        '//line1\n\t//line2'
      );
    });

    it('should handle functions with tabs in their declarations', function() {
      expect(utils.clean('function\t(\t)\t{\n//code\n}'), 'to be', '//code');
    });

    it('should handle named functions without space after name', function() {
      expect(
        utils.clean('function withName() {\n//code\n}'),
        'to be',
        '//code'
      );
    });

    it('should handle named functions with space after name', function() {
      expect(
        utils.clean('function withName () {\n//code\n}'),
        'to be',
        '//code'
      );
    });

    it('should handle functions with no space between the end and the closing brace', function() {
      expect(utils.clean('function() {/*code*/}'), 'to be', '/*code*/');
    });

    it('should handle functions with parentheses in the same line', function() {
      expect(
        utils.clean('function() { if (true) { /* code */ } }'),
        'to be',
        'if (true) { /* code */ }'
      );
    });

    it('should handle empty functions', function() {
      expect(utils.clean('function() {}'), 'to be', '');
    });

    it('should format a single line test function', function() {
      var fn = ['function () {', '  var a = 1;', '}'].join('\n');
      expect(utils.clean(fn), 'to be', 'var a = 1;');
    });

    it('should format a multi line test indented with spaces', function() {
      // and no new lines after curly braces, shouldn't matter
      var fn = [
        'function(){  var a = 1;',
        // this one has more spaces
        '    var b = 2;',
        '  var c = 3;  }'
      ].join('\n');
      expect(utils.clean(fn), 'to be', 'var a = 1;\n  var b = 2;\nvar c = 3;');
    });

    it('should format a multi line test indented with tabs', function() {
      var fn = [
        'function (arg1, arg2)   {',
        '\tif (true) {',
        '\t\tvar a = 1;',
        '\t}',
        '}'
      ].join('\n');
      expect(utils.clean(fn), 'to be', 'if (true) {\n\tvar a = 1;\n}');
    });

    it('should format functions saved in windows style - spaces', function() {
      var fn = [
        'function (one) {',
        '   do {',
        '    "nothing";',
        '   } while (false);',
        ' }'
      ].join('\r\n');
      expect(utils.clean(fn), 'to be', 'do {\n "nothing";\n} while (false);');
    });

    it('should format functions saved in windows style - tabs', function() {
      var fn = [
        'function ( )   {',
        '\tif (false) {',
        '\t\tvar json = {',
        '\t\t\tone : 1',
        '\t\t};',
        '\t}',
        '}'
      ].join('\r\n');
      expect(
        utils.clean(fn),
        'to be',
        'if (false) {\n\tvar json = {\n\t\tone : 1\n\t};\n}'
      );
    });

    it('should format es6 arrow functions', function() {
      var fn = ['() => {', '  var a = 1;', '}'].join('\n');
      expect(utils.clean(fn), 'to be', 'var a = 1;');
    });

    it('should format es6 arrow functions with implicit return', function() {
      var fn = '() => foo()';
      expect(utils.clean(fn), 'to be', 'foo()');
    });
  });

  describe('stringify', function() {
    var stringify = utils.stringify;

    it('should return an object representation of a string created with a String constructor', function() {
      /* eslint no-new-wrappers: off */
      expect(
        stringify(new String('foo')),
        'to be',
        '{\n  "0": "f"\n  "1": "o"\n  "2": "o"\n}'
      );
    });

    it('should return Buffer with .toJSON representation', function() {
      expect(stringify(Buffer.from([0x01])), 'to be', '[\n  1\n]');
      expect(stringify(Buffer.from([0x01, 0x02])), 'to be', '[\n  1\n  2\n]');

      expect(
        stringify(Buffer.from('ABCD')),
        'to be',
        '[\n  65\n  66\n  67\n  68\n]'
      );
    });

    it('should return Date object with .toISOString() + string prefix', function() {
      expect(
        stringify(new Date(0)),
        'to be',
        '[Date: ' + new Date(0).toISOString() + ']'
      );

      var date = new Date(); // now
      expect(stringify(date), 'to be', '[Date: ' + date.toISOString() + ']');
    });

    it('should return invalid Date object with .toString() + string prefix', function() {
      expect(
        stringify(new Date('')),
        'to be',
        '[Date: ' + new Date('').toString() + ']'
      );
    });

    describe('#Number', function() {
      it('should show the handle -0 situations', function() {
        expect(stringify(-0), 'to be', '-0');
        expect(stringify(0), 'to be', '0');
        expect(stringify('-0'), 'to be', '"-0"');
      });

      it('should work well with `NaN` and `Infinity`', function() {
        expect(stringify(NaN), 'to be', 'NaN');
        expect(stringify(Infinity), 'to be', 'Infinity');
        expect(stringify(-Infinity), 'to be', '-Infinity');
      });

      it('floats and ints', function() {
        expect(stringify(1), 'to be', '1');
        expect(stringify(1.2), 'to be', '1.2');
        expect(stringify(1e9), 'to be', '1000000000');
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
          buffer: Buffer.from([0x01, 0x02]),
          array: [1, 2, 3],
          empArr: [],
          matrix: [[1], [2, 3, 4]],
          object: {a: 1, b: 2},
          canObj: {a: {b: 1, c: 2}, b: {}},
          empObj: {}
        };
        expected.circular = expected; // Make `Circular` situation
        var actual = [
          '{',
          '  "array": [',
          '    1',
          '    2',
          '    3',
          '  ]',
          '  "boolean": false',
          '  "buffer": [Buffer: [',
          '    1',
          '    2',
          '  ]]',
          '  "canObj": {',
          '    "a": {',
          '      "b": 1',
          '      "c": 2',
          '    }',
          '    "b": {}',
          '  }',
          '  "circular": [Circular]',
          '  "date": [Date: 1970-01-01T00:00:00.000Z]',
          '  "empArr": []',
          '  "empObj": {}',
          '  "float": 9.99',
          '  "func": [Function]',
          '  "infi": Infinity',
          '  "int": 90',
          '  "matrix": [',
          '    [',
          '      1',
          '    ]',
          '    [',
          '      2',
          '      3',
          '      4',
          '    ]',
          '  ]',
          '  "nan": NaN',
          '  "nil": [null]',
          '  "object": {',
          '    "a": 1',
          '    "b": 2',
          '  }',
          '  "regex": /^[a-z|A-Z]/',
          '  "str": "string"',
          '  "undef": [undefined]',
          '  "zero": -0',
          '}'
        ].join('\n');
        expect(stringify(expected), 'to be', actual);
      });
    });

    it('should canonicalize the object', function() {
      var travis = {name: 'travis', age: 24};
      var travis2 = {age: 24, name: 'travis'};

      expect(stringify(travis), 'to be', stringify(travis2));
    });

    it('should handle circular structures in objects', function() {
      var travis = {name: 'travis'};
      travis.whoami = travis;

      expect(
        stringify(travis),
        'to be',
        '{\n  "name": "travis"\n  "whoami": [Circular]\n}'
      );
    });

    it('should handle circular structures in arrays', function() {
      var travis = ['travis'];
      travis.push(travis);

      expect(stringify(travis), 'to be', '[\n  "travis"\n  [Circular]\n]');
    });

    it('should handle circular structures in functions', function() {
      var travis = function() {};
      travis.fn = travis;

      expect(stringify(travis), 'to be', '{\n  "fn": [Circular]\n}');
    });

    it('should handle various non-undefined, non-null, non-object, non-array, non-date, and non-function values', function() {
      var regexp = new RegExp('(?:)');
      var regExpObj = {regexp: regexp};
      var regexpString = '/(?:)/';

      expect(
        stringify(regExpObj),
        'to be',
        '{\n  "regexp": ' + regexpString + '\n}'
      );
      expect(stringify(regexp), 'to be', regexpString);

      var number = 1;
      var numberObj = {number: number};
      var numberString = '1';

      expect(stringify(numberObj), 'to be', '{\n  "number": ' + number + '\n}');
      expect(stringify(number), 'to be', numberString);

      var boolean = false;
      var booleanObj = {boolean: boolean};
      var booleanString = 'false';

      expect(
        stringify(booleanObj),
        'to be',
        '{\n  "boolean": ' + boolean + '\n}'
      );
      expect(stringify(boolean), 'to be', booleanString);

      var string = 'sneepy';
      var stringObj = {string: string};

      expect(
        stringify(stringObj),
        'to be',
        '{\n  "string": "' + string + '"\n}'
      );
      expect(stringify(string), 'to be', JSON.stringify(string));

      var nullValue = null;
      var nullObj = {null: null};
      var nullString = '[null]';

      expect(stringify(nullObj), 'to be', '{\n  "null": [null]\n}');
      expect(stringify(nullValue), 'to be', nullString);
    });

    it('should handle arrays', function() {
      var array = ['dave', 'dave', 'dave', 'dave'];
      var arrayObj = {array: array};
      var arrayString = '    "dave"\n    "dave"\n    "dave"\n    "dave"';

      expect(
        stringify(arrayObj),
        'to be',
        '{\n  "array": [\n' + arrayString + '\n  ]\n}'
      );
      expect(
        stringify(array),
        'to be',
        '[' + arrayString.replace(/\s+/g, '\n  ') + '\n]'
      );
    });

    it('should handle functions', function() {
      var fn = function() {};
      var fnObj = {fn: fn};
      var fnString = '[Function]';

      expect(stringify(fnObj), 'to be', '{\n  "fn": ' + fnString + '\n}');
      expect(stringify(fn), 'to be', '[Function]');
    });

    it('should handle empty objects', function() {
      expect(stringify({}), 'to be', '{}');
      expect(stringify({foo: {}}), 'to be', '{\n  "foo": {}\n}');
    });

    it('should handle empty arrays', function() {
      expect(stringify([]), 'to be', '[]');
      expect(stringify({foo: []}), 'to be', '{\n  "foo": []\n}');
    });

    it('should handle non-empty arrays', function() {
      expect(stringify(['a', 'b', 'c']), 'to be', '[\n  "a"\n  "b"\n  "c"\n]');
    });

    it('should handle empty functions (with no properties)', function() {
      expect(stringify(function() {}), 'to be', '[Function]');
      expect(
        stringify({foo: function() {}}),
        'to be',
        '{\n  "foo": [Function]\n}'
      );
      expect(
        stringify({foo: function() {}, bar: 'baz'}),
        'to be',
        '{\n  "bar": "baz"\n  "foo": [Function]\n}'
      );
    });

    it('should handle functions w/ properties', function() {
      var fn = function() {};
      fn.bar = 'baz';
      expect(stringify(fn), 'to be', '{\n  "bar": "baz"\n}');
      expect(
        stringify({foo: fn}),
        'to be',
        '{\n  "foo": {\n    "bar": "baz"\n  }\n}'
      );
    });

    it('should handle undefined values', function() {
      expect(
        stringify({foo: undefined}),
        'to be',
        '{\n  "foo": [undefined]\n}'
      );
      expect(
        stringify({foo: 'bar', baz: undefined}),
        'to be',
        '{\n  "baz": [undefined]\n  "foo": "bar"\n}'
      );
      expect(stringify(), 'to be', '[undefined]');
    });

    it('should recurse', function() {
      expect(
        stringify({foo: {bar: {baz: {quux: {herp: 'derp'}}}}}),
        'to be',
        '{\n  "foo": {\n    "bar": {\n      "baz": {\n        "quux": {\n          "herp": "derp"\n        }\n      }\n    }\n  }\n}'
      );
    });

    it('might get confusing', function() {
      expect(stringify(null), 'to be', '[null]');
    });

    it('should not freak out if it sees a primitive twice', function() {
      expect(
        stringify({foo: null, bar: null}),
        'to be',
        '{\n  "bar": [null]\n  "foo": [null]\n}'
      );
      expect(
        stringify({foo: 1, bar: 1}),
        'to be',
        '{\n  "bar": 1\n  "foo": 1\n}'
      );
    });

    it('should stringify dates', function() {
      var date = new Date(0);
      expect(stringify(date), 'to be', '[Date: 1970-01-01T00:00:00.000Z]');
      expect(
        stringify({date: date}),
        'to be',
        '{\n  "date": [Date: 1970-01-01T00:00:00.000Z]\n}'
      );
    });

    it('should handle object without an Object prototype', function() {
      var a;
      if (Object.create) {
        a = Object.create(null);
      } else {
        a = {};
      }
      a.foo = 1;

      expect(stringify(a), 'to be', '{\n  "foo": 1\n}');
    });

    // In old version node.js, Symbol is not available by default.
    if (typeof global.Symbol === 'function') {
      it('should handle Symbol', function() {
        var symbol = Symbol('value');
        expect(stringify(symbol), 'to be', 'Symbol(value)');
        expect(
          stringify({symbol: symbol}),
          'to be',
          '{\n  "symbol": Symbol(value)\n}'
        );
      });
    }

    it('should handle length properties that cannot be coerced to a number', function() {
      expect(
        stringify({length: {nonBuiltinProperty: 0}}),
        'to be',
        '{\n  "length": {\n    "nonBuiltinProperty": 0\n  }\n}'
      );
      expect(
        stringify({length: 'a string where length should be'}),
        'to be',
        '{\n  "length": "a string where length should be"\n}'
      );
    });
  });

  describe('type', function() {
    /* eslint no-extend-native: off */

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

    it('should recognize various types', function() {
      expect(type({}), 'to be', 'object');
      expect(type([]), 'to be', 'array');
      expect(type(1), 'to be', 'number');
      expect(type(Infinity), 'to be', 'number');
      expect(type(null), 'to be', 'null');
      expect(type(undefined), 'to be', 'undefined');
      expect(type(new Date()), 'to be', 'date');
      expect(type(/foo/), 'to be', 'regexp');
      expect(type('type'), 'to be', 'string');
      expect(type(global), 'to be', 'domwindow');
      expect(type(true), 'to be', 'boolean');
    });

    describe('when toString on null or undefined stringifies window', function() {
      it('should recognize null and undefined', function() {
        expect(type(null), 'to be', 'null');
        expect(type(undefined), 'to be', 'undefined');
      });
    });

    afterEach(function() {
      Object.prototype.toString = toString;
    });
  });

  describe('parseQuery()', function() {
    var parseQuery = utils.parseQuery;
    it('should get queryString and return key-value object', function() {
      expect(parseQuery('?foo=1&bar=2&baz=3'), 'to equal', {
        foo: '1',
        bar: '2',
        baz: '3'
      });

      expect(parseQuery('?r1=^@(?!.*\\)$)&r2=m{2}&r3=^co.*'), 'to equal', {
        r1: '^@(?!.*\\)$)',
        r2: 'm{2}',
        r3: '^co.*'
      });
    });

    it('should parse "+" as a space', function() {
      expect(parseQuery('?grep=foo+bar'), 'to equal', {grep: 'foo bar'});
    });
  });

  describe('isPromise', function() {
    it('should return true if the value is Promise-ish', function() {
      expect(
        utils.isPromise({
          then: function() {}
        }),
        'to be',
        true
      );
    });

    it('should return false if the value is not an object', function() {
      expect(utils.isPromise(1), 'to be', false);
    });

    it('should return false if the value is an object w/o a "then" function', function() {
      expect(utils.isPromise({}), 'to be', false);
    });
  });

  describe('escape', function() {
    it('replaces the usual xml suspects', function() {
      expect(utils.escape('<a<bc<d<'), 'to be', '&#x3C;a&#x3C;bc&#x3C;d&#x3C;');
      expect(utils.escape('>a>bc>d>'), 'to be', '&#x3E;a&#x3E;bc&#x3E;d&#x3E;');
      expect(utils.escape('"a"bc"d"'), 'to be', '&#x22;a&#x22;bc&#x22;d&#x22;');
      expect(utils.escape('<>"&'), 'to be', '&#x3C;&#x3E;&#x22;&#x26;');

      expect(utils.escape('&a&bc&d&'), 'to be', '&#x26;a&#x26;bc&#x26;d&#x26;');
      expect(utils.escape('&amp;&lt;'), 'to be', '&#x26;amp;&#x26;lt;');
    });

    it('replaces invalid xml characters', function() {
      expect(
        utils.escape('\x1B[32mfoo\x1B[0m'),
        'to be',
        '&#x1B;[32mfoo&#x1B;[0m'
      );
      // Ensure we can handle non-trivial unicode characters as well
      expect(utils.escape('💩'), 'to be', '&#x1F4A9;');
    });
  });
});
