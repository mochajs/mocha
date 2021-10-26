'use strict';

var parseQuery = require('../../lib/browser/parse-query');

describe('parseQuery()', function () {
  it('should get queryString and return key-value object', function () {
    expect(parseQuery('?foo=1&bar=2&baz=3'), 'to equal', {
      foo: '1',
      bar: '2',
      baz: '3'
    });

    expect(parseQuery('?r1=^@(?!.*\\)$)&r2=m{2}&r3=^co.*'), 'to equal', {
      r1: '^@(?!.*\\)$)',
      r2: 'm{2}',
      r3: '^co.*'
    });
  });

  it('should parse "+" as a space', function () {
    expect(parseQuery('?grep=foo+bar'), 'to equal', {grep: 'foo bar'});
  });
});
