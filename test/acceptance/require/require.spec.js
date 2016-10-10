'use strict';

describe('require test', function () {
  it('should require args in order', function () {
    var req = global.required;
    expect(req.indexOf('a.js')).to.equal(0);
    expect(req.indexOf('b.coffee')).to.equal(1);
    expect(req.indexOf('c.js')).to.equal(2);
    expect(req.indexOf('d.coffee')).to.equal(3);
  });
});
