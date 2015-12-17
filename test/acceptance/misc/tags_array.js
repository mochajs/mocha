var Mocha = require('../../../');
var Taggable = Mocha.Taggable;

module.exports = Taggable(['array'], {
  Array: {
    '#indexOf()': {
      'should return the correct index': function() {
        [1, 2, 3].indexOf(1).should.equal(0);
        [1, 2, 3].indexOf(2).should.equal(1);
        [1, 2, 3].indexOf(3).should.equal(2);
      }
    }
  }
});
