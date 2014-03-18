var ui = require('../../../lib/interfaces/exports'),
    Suite = require('../../../lib/suite'),
    should = require('should');

function testTimeoutValueFactory(value, expected) {
    return function() {
        var time = 0
          , suite = new Suite("no-such-suite", {})
          ;
        ui(suite);
        suite.emit('require', {
          'some test with timeout' : {
            timeout: value
          }
        }, 'no-such-file.js', {});
        
        suite.suites.length.should.equal(1);
        suite.suites[0]._timeout.should.equal(expected);
    }
}

module.exports.testTimeouts = {
  'suite with key \'timeout\'': {
    'with numeric value' : {
      'should call this.timeout(..) on the suite with the numeric value' : testTimeoutValueFactory(42,42)
    },
      'with string value usign postfix' : {
      "'ms' should call this.timeout(..) on the suite with the numeric part of the value" : testTimeoutValueFactory("43ms", 43),
      "'s' should parsed as second" : testTimeoutValueFactory("0.42s", 420),
      "'m' should parse as minutes" : testTimeoutValueFactory("0.1m", 6000),
      "'h' should parse as hours"   : testTimeoutValueFactory("1h", 1000 * 60 * 60 ),
      "that is not supported should throw" : function(){
          should( testTimeoutValueFactory("0x", 6000) ).throw( /wrong format in timeout specification/ );
      }
    }
  }
};
