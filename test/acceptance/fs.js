var fs = require('fs');
var path = require('path');
var osTmpDir = require('os-tmpdir');

describe('fs.readFile()', function(){
  describe('when the file exists', function(){
    it('should succeed', function(done){
      fs.writeFile(path.join(osTmpDir(), 'mocha'), 'wahoo', done)
    })
  })

  describe('when the file does not exist', function(){
    it('should fail', function(done){
      // uncomment
      // fs.readFile('/tmp/does-not-exist', done);
      done();
    })
  })
})
