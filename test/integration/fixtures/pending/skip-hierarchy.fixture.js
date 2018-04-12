'use strict';

describe('a suite', function(){
  describe.skip('skipped suite 1');
  describe.skip('skipped suite 2');
  describe('another suite', function(){
    it('a test', function(){})
  })
});
