
describe('pending', function(){
  it('should be allowed')
})

describe('with options.pending = true', function() {
  it('should not invoke the callback', function(done){
    throw new Error('should not be called');
  }, {pending: true})
})
