'use strict';

exports.mochaHooks = async() => ({
  beforeAll: [
    function() {
      console.log('beforeAll array 1');
    },
    function() {
      console.log('beforeAll array 2');
    }
  ],
  beforeEach: [
    function() {
      console.log('beforeEach array 1');
    },
    function() {
      console.log('beforeEach array 2');
    }
  ],
  afterAll: [
    function() {
      console.log('afterAll array 1');
    },
    function() {
      console.log('afterAll array 2');
    }
  ],
  afterEach: [
    function() {
      console.log('afterEach array 1');
    },
    function() {
      console.log('afterEach array 2');
    }
  ]
});
