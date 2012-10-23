var setup = function(assert, callback) {
  var initialValue = 32;
  assert.equal(initialValue, 32);
  initialValue = 42;
  callback(initialValue);
  assert.equal(initialValue, 42);
}

exports['test Array'] = {
  'test #indexOf()': {

    'test should return -1 when the value is not present': function(assert) {
      setup(assert, function(initialValue) {
        assert.equal(initialValue, 42);
        assert.equal([1,2,3].indexOf(5), -1);
        assert.equal([1,2,3].indexOf(0), -1);
      });
    },

    'test should return the correct index when the value is present': function(assert) {
      setup(assert, function(initialValue) {
        assert.equal(initialValue, 42);
        assert.equal([1,2,3].indexOf(1), 0);
        assert.equal([1,2,3].indexOf(2), 1);
        assert.equal([1,2,3].indexOf(3), 2);
      });
    }

  } // end #indexOf() suite
} // end Array suite

exports['test async tests use the done() callback'] = function(assert, done) {
  assert.ok(typeof done === 'function' ? true : false);
  done();
}