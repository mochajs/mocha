var path = require('path');
var Mocha = require('../');

describe('Taggable', function() {
  var opts = { tags: ['array'] };

  describe('tags', function() {
    it('should run and pass tests', function(done) {
      var testDir = 'test/acceptance/misc';
      var mocha = new Mocha(opts).ui('exports');
      mocha.addFile(path.join(testDir, 'tags_array.js'));
      mocha.addFile(path.join(testDir, 'tags_number.js'));
      mocha.run(function(failures) {
        failures.should.equal(0);
        done();
      });
    });
  });
});
