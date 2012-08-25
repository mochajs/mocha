var Mocha = require('../../../../')
  , Suite = Mocha.Suite
  , Test = Mocha.Test;

module.exports = Mocha.interfaces.yoda = function(suite){
  var suites = [suite];

  suite.on('pre-require', function(context){

    context.hmmm = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn();
      suites.shift();
    };

    context.padawan = function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      suite.addTest(new Test(title, fn));
    };

  });
};