'use strict';

exports.mochaHooks = async () => ({
  beforeAll() {
    console.log('beforeAll');
  },
  beforeEach() {
    console.log('beforeEach');
  },
  afterAll() {
    console.log('afterAll');
  },
  afterEach() {
    console.log('afterEach');
  }
});
