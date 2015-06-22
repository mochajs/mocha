var utils = require('../../lib/utils');

describe('lib/utils', function () {
  describe('clean', function () {
    it("should format a single line test function", function () {
      var fn = [
        "function () {"
        , "  var a = 1;"
        , "}"
      ].join("\n");
      utils.clean(fn).should.equal("var a = 1;");
    });

    it("should format a multi line test indented with spaces", function () {
      // and no new lines after curly braces, shouldn't matter
      var fn = [
        "function(){  var a = 1;"
        , "    var b = 2;" // this one has more spaces
        , "  var c = 3;  }"
      ].join("\n");
      utils.clean(fn).should.equal("var a = 1;\n  var b = 2;\nvar c = 3;");
    });

    it("should format a multi line test indented with tabs", function () {
      var fn = [
        "function (arg1, arg2)   {"
        , "\tif (true) {"
        , "\t\tvar a = 1;"
        , "\t}"
        , "}"
      ].join("\n");
      utils.clean(fn).should.equal("if (true) {\n\tvar a = 1;\n}");
    });

    it("should format functions saved in windows style - spaces", function () {
      var fn = [
        "function (one) {"
        , "   do {"
        , '    "nothing";'
        , "   } while (false);"
        , ' }'
      ].join("\r\n");
      utils.clean(fn).should.equal('do {\n "nothing";\n} while (false);');
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
      utils.clean(fn).should.equal("if (false) {\n\tvar json = {\n\t\tone : 1\n\t};\n}");
    });

    it("should format es6 arrow functions", function () {
      var fn = [
        "() => {",
        "  var a = 1;",
        "}"
      ].join("\n");
      utils.clean(fn).should.equal("var a = 1;");
    });

    it("should format es6 arrow functions with implicit return", function () {
      var fn = "() => foo()";
      utils.clean(fn).should.equal("foo()");
    });
  });

  describe('stringify', function(){

    var stringify = utils.stringify;

    it('should return Buffer with .toJSON representation', function() {
      stringify(new Buffer([0x01])).should.equal('[\n  1\n]');
      stringify(new Buffer([0x01, 0x02])).should.equal('[\n  1\n  2\n]');

      stringify(new Buffer('ABCD')).should.equal('[\n  65\n  66\n  67\n  68\n]');
    });

    it('should return Date object with .toISOString() + string prefix', function() {
      stringify(new Date(0)).should.equal('[Date: ' + new Date(0).toISOString() + ']');

      var date = new Date(); // now
      stringify(date).should.equal('[Date: ' + date.toISOString() + ']');
    });

    it('should return invalid Date object with .toString() + string prefix', function() {
      stringify(new Date('')).should.equal('[Date: ' + new Date('').toString() + ']');
    });

    describe('#Number', function() {
      it('should show the handle -0 situations', function() {
        stringify(-0).should.eql('-0');
        stringify(0).should.eql('0');
        stringify('-0').should.eql('"-0"');
      });

      it('should work well with `NaN` and `Infinity`', function() {
        stringify(NaN).should.equal('NaN');
        stringify(Infinity).should.equal('Infinity');
        stringify(-Infinity).should.equal('-Infinity');
      });

      it('floats and ints', function() {
        stringify(1).should.equal('1');
        stringify(1.2).should.equal('1.2');
        stringify(1e9).should.equal('1000000000');
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
        stringify(expected).should.equal(actual);
      });
    });

    it('should canonicalize the object', function(){
      var travis = { name: 'travis', age: 24 };
      var travis2 = { age: 24, name: 'travis' };

      stringify(travis).should.equal(stringify(travis2));
    });

    it('should handle circular structures in objects', function(){
      var travis = { name: 'travis' };
      travis.whoami = travis;

      stringify(travis).should.equal('{\n  "name": "travis"\n  "whoami": [Circular]\n}');
    });

    it('should handle circular structures in arrays', function(){
      var travis = ['travis'];
      travis.push(travis);

      stringify(travis).should.equal('[\n  "travis"\n  [Circular]\n]');
    });

    it('should handle circular structures in functions', function(){
      var travis = function () {};
      travis.fn = travis;

      stringify(travis).should.equal('{\n  "fn": [Circular]\n}');
    });


    it('should handle various non-undefined, non-null, non-object, non-array, non-date, and non-function values', function () {
      var regexp = new RegExp("(?:)"),
        regExpObj = { regexp: regexp },
        regexpString = '/(?:)/';

      stringify(regExpObj).should.equal('{\n  "regexp": ' + regexpString + '\n}');
      stringify(regexp).should.equal(regexpString);

      var number = 1,
        numberObj = { number: number },
        numberString = '1';

      stringify(numberObj).should.equal('{\n  "number": ' + number + '\n}');
      stringify(number).should.equal(numberString);

      var boolean = false,
        booleanObj = { boolean: boolean },
        booleanString = 'false';

      stringify(booleanObj).should.equal('{\n  "boolean": ' + boolean + '\n}');
      stringify(boolean).should.equal(booleanString);

      var string = 'sneepy',
        stringObj = { string: string };

      stringify(stringObj).should.equal('{\n  "string": "' + string + '"\n}');
      stringify(string).should.equal(JSON.stringify(string));

      var nullValue = null,
        nullObj = { 'null': null },
        nullString = '[null]';

      stringify(nullObj).should.equal('{\n  "null": [null]\n}');
      stringify(nullValue).should.equal(nullString);
    });

    it('should handle arrays', function () {
      var array = ['dave', 'dave', 'dave', 'dave'],
        arrayObj = {array: array},
        arrayString = array.map(function () {
          return '    "dave"';
        }).join('\n');

      stringify(arrayObj).should.equal('{\n  "array": [\n' + arrayString + '\n  ]\n}');
      stringify(array).should.equal('[' + arrayString.replace(/\s+/g, '\n  ') + '\n]');
    });

    it('should handle functions', function () {
      var fn = function() {},
        fnObj = {fn: fn},
        fnString = '[Function]';

      stringify(fnObj).should.equal('{\n  "fn": ' + fnString + '\n}');
      stringify(fn).should.equal('[Function]');
    });

    it('should handle empty objects', function () {
      stringify({}).should.equal('{}');
      stringify({foo: {}}).should.equal('{\n  "foo": {}\n}');
    });

    it('should handle empty arrays', function () {
      stringify([]).should.equal('[]');
      stringify({foo: []}).should.equal('{\n  "foo": []\n}');
    });

    it('should handle non-empty arrays', function () {
      stringify(['a', 'b', 'c']).should.equal('[\n  "a"\n  "b"\n  "c"\n]')
    });

    it('should handle empty functions (with no properties)', function () {
      stringify(function(){}).should.equal('[Function]');
      stringify({foo: function() {}}).should.equal('{\n  "foo": [Function]\n}');
      stringify({foo: function() {}, bar: 'baz'}).should.equal('{\n  "bar": "baz"\n  "foo": [Function]\n}');
    });

    it('should handle functions w/ properties', function () {
      var fn = function(){};
      fn.bar = 'baz';
      stringify(fn).should.equal('{\n  "bar": "baz"\n}');
      stringify({foo: fn}).should.equal('{\n  "foo": {\n    "bar": "baz"\n  }\n}');
    });

    it('should handle undefined values', function () {
      stringify({foo: undefined}).should.equal('{\n  "foo": [undefined]\n}');
      stringify({foo: 'bar', baz: undefined}).should.equal('{\n  "baz": [undefined]\n  "foo": "bar"\n}');
      stringify().should.equal('[undefined]');
    });

    it('should recurse', function () {
      stringify({foo: {bar: {baz: {quux: {herp: 'derp'}}}}}).should.equal('{\n  "foo": {\n    "bar": {\n      "baz": {\n        "quux": {\n          "herp": "derp"\n        }\n      }\n    }\n  }\n}');
    });

    it('might get confusing', function () {
      stringify(null).should.equal('[null]');
    });

    it('should not freak out if it sees a primitive twice', function () {
      stringify({foo: null, bar: null}).should.equal('{\n  "bar": [null]\n  "foo": [null]\n}');
      stringify({foo: 1, bar: 1}).should.equal('{\n  "bar": 1\n  "foo": 1\n}');
    });

    it('should stringify dates', function () {
      var date = new Date(0);
      stringify(date).should.equal('[Date: 1970-01-01T00:00:00.000Z]');
      stringify({date: date}).should.equal('{\n  "date": [Date: 1970-01-01T00:00:00.000Z]\n}');
    });

    it('should handle object without an Object prototype', function () {
      var a = Object.create(null);
      a.foo = 1;

      stringify(a).should.equal('{\n  "foo": 1\n}');
    });
  });

  describe('type', function () {
    var type = utils.type;
    it('should recognize various types', function () {
      type({}).should.equal('object');
      type([]).should.equal('array');
      type(1).should.equal('number');
      type(Infinity).should.equal('number');
      type(null).should.equal('null');
      type(undefined).should.equal('undefined');
      type(new Date()).should.equal('date');
      type(/foo/).should.equal('regexp');
      type('type').should.equal('string');
      type(global).should.equal('global');
      type(true).should.equal('boolean');
    });

    describe('when toString on null or undefined stringifies window', function () {
      var toString = Object.prototype.toString;

      beforeEach(function () {
        // some JS engines such as PhantomJS 1.x exhibit this behavior
        Object.prototype.toString = function () {
          return '[object DOMWindow]';
        };
      });

      it('should recognize null and undefined', function () {
        type(null).should.equal('null');
        type(undefined).should.equal('undefined');
      });

      afterEach(function () {
        Object.prototype.toString = toString;
      });
    });
  });

  describe('lookupFiles', function () {
    var fs = require('fs'),
      path = require('path'),
      existsSync = fs.existsSync || path.existsSync;

    beforeEach(function () {
      fs.writeFileSync('/tmp/mocha-utils.js', 'yippy skippy ying yang yow');
      fs.symlinkSync('/tmp/mocha-utils.js', '/tmp/mocha-utils-link.js');
    });

    it('should not choke on symlinks', function () {
      utils.lookupFiles('/tmp', ['js'], false)
        .should.containEql('/tmp/mocha-utils-link.js')
        .and.containEql('/tmp/mocha-utils.js')
        .and.have.lengthOf(2);
      existsSync('/tmp/mocha-utils-link.js').should.be.true;
      fs.renameSync('/tmp/mocha-utils.js', '/tmp/bob');
      existsSync('/tmp/mocha-utils-link.js').should.be.false;
      utils.lookupFiles('/tmp', ['js'], false).should.eql([]);
    });

    afterEach(function () {
      ['/tmp/mocha-utils.js', '/tmp/mocha-utils-link.js', '/tmp/bob'].forEach(function (path) {
        try {
          fs.unlinkSync(path);
        }
        catch (ignored) {}
      });
    });
  });
});
