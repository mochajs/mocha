var Mocha = require('../../../');
var Taggable = Mocha.Taggable;

module.exports = Taggable(['number'], {
  Number: {
    '#isNaN() && ===': {
      'should return the correct index': function() {
        isNaN(1).should.equal(true);
        isNaN(2).should.equal(true);
        (1 === 2).should.equal(true);
      }
    }
  }
});
