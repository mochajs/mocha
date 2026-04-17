'use strict';

const {expect} = require('chai');

describe('Diff hang protection', function () {
  it('should not hang when comparing large buffers', function () {
    // Create two large buffers that differ
    const buf1 = Buffer.alloc(50000, 'a');
    const buf2 = Buffer.alloc(50000, 'b');
    
    // This should fail without hanging
    expect(buf1).to.deep.equal(buf2);
  });
  
  it('should not hang when comparing deeply nested objects', function () {
    // Create deeply nested object structure
    let obj1 = {value: 1};
    let obj2 = {value: 2};
    
    for (let i = 0; i < 100; i++) {
      obj1 = {nested: obj1, extra: obj1};
      obj2 = {nested: obj2, extra: obj2};
    }
    
    // This should fail without hanging
    expect(obj1).to.deep.equal(obj2);
  });
  
  it('should not hang when comparing objects with many keys', function () {
    const obj1 = {};
    const obj2 = {};
    
    for (let i = 0; i < 5000; i++) {
      obj1['key' + i] = 'value' + i;
      obj2['key' + i] = 'different' + i;
    }
    
    // This should fail without hanging
    expect(obj1).to.deep.equal(obj2);
  });
});
