'use strict';

var toISOString = require('../../lib/to-iso-string');

describe('toISOString', function () {
  it('should turn a date into an ISO string', function () {
    var isoString = '2017-02-07T20:44:15.496Z';
    var date = new Date(isoString);
    toISOString(date).should.equal(isoString);
  });
});
