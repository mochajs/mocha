describe('pending', function(){
  it('should be allowed')
})

describe('skip in test', function(){
  it('should skip immediately', function(){
    this.skip();
    throw new Error('never thrown');
  })

  it('should run other tests in the suite', function(){
  })
})

describe('skip in before', function(){
  before(function(){
    this.skip();
  })

  it('should never run this test', function(){
    throw new Error('never thrown');
  })

  it('should never run this test', function(){
    throw new Error('never thrown');
  })
})

describe('skip in beforeEach', function(){
  beforeEach(function(){
    this.skip();
  })

  it('should never run this test', function(){
    throw new Error('never thrown');
  })

  it('should never run this test', function(){
    throw new Error('never thrown');
  })
})
