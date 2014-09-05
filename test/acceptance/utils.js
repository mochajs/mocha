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
        , "   do {",
        , '    "nothing";',
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
    it('should canoncalize the object', function(){
      var travis = { name: 'travis', age: 24 };
      var travis2 = { age: 24, name: 'travis' };

      utils.stringify(travis).should.equal(utils.stringify(travis2));
    });

    it('should handle circular structures', function(){
      var travis = { name: 'travis' };
      travis.whoami = travis;

      utils.stringify(travis).should.equal('{\n  "name": "travis"\n  "whoami": "[Circular]"\n}');
    });
  });

  describe('lookupFiles', function () {
    var fs = require('fs');

    beforeEach(function () {
      fs.writeFileSync('/tmp/mocha-utils.js', 'yippy skippy ying yang yow');
      fs.symlinkSync('/tmp/mocha-utils.js', '/tmp/mocha-utils-link.js');
    });

    it('should not choke on symlinks', function () {
      utils.lookupFiles('/tmp', ['js'], false).should.eql(['/tmp/mocha-utils-link.js', '/tmp/mocha-utils.js']);
      fs.existsSync('/tmp/mocha-utils-link.js').should.be.true;
      fs.rename('/tmp/mocha-utils.js', '/tmp/bob');
      fs.existsSync('/tmp/mocha-utils-link.js').should.be.true;
      utils.lookupFiles('/tmp', ['js'], false).should.eql([]);
    });

    afterEach(function () {
      ['/tmp/mocha-utils.js', '/tmp/mocha-utils-link.js', '/tmp/bob'].forEach(function (path) {
        try {
          fs.unlinkSync(path);
        }
        catch (ignored) {}
      });
    })
  });
});
