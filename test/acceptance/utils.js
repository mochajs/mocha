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
  });
});