
describe('bail', function(){
  it('should only display this error', function(done){
    throw new Error('this should be displayed');
  })

  it('should not display this error', function(done){
    throw new Error('this should not be displayed');
  })
})

describe('bail-2', function(){

	before(function(done){
    throw new Error('this hook should not be displayed');
	})

  it('should not display this error', function(done){
    throw new Error('this should not be displayed');
  })
})
