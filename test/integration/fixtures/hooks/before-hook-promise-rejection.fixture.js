'use strict';

describe('mySuite', function() {
  var promise;

  before(function() {
    promise = Promise.reject(new Error());
  });

  it('myTest', function() {
    promise.catch(function() {});
  });
});
