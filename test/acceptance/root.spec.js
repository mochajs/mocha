var calls = [];

before(function(){
  calls.push('before');
})

describe('root', function(){
  it('should be a valid suite', function(){
    expect(calls).to.eql(['before']);
  })
})
