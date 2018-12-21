'use strict';

describe('mySuite', function() {
  var promise;

  beforeEach(function() {
    promise = Promise.reject(new Error());
  });

  it('myTest', function() {
    promise.catch(function() {});
  });
});
