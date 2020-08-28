'use strict';

exports.mochaHooks = {
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
};
