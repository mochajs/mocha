
var calls = [];

before(function(){
  calls.push('before');
})

describe('root', function(){
  it('should be a valid suite', function(){
    calls.should.eql(['before']);
  })
})