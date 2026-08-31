'use strict';
const assert = require('assert');

describe('uncaught', function() {
  var hookOrder = [];
  it('throw delayed error', (done) => {
    setTimeout(() => {
      throw new Error('Whoops!');
    }, 10)
    setTimeout(done, 10);
  });
  it('should wait 15ms', (done) => {      
    setTimeout(done, 15);
  });
  it('test 3', () => { });

  afterEach(function() {
    hookOrder.push(this.currentTest.title);
  });
  after(function() {
    hookOrder.push('after');
    assert.deepEqual(
      hookOrder,
      ['throw delayed error', 'should wait 15ms', 'test 3', 'after']
    );
    throw new Error('should get upto here and throw');
  });
});
