
describe('one', function(){
  before(function(){
    mconsole.log('before one');
  })
  
  after(function(){
    mconsole.log('after one');
  })
  
  beforeEach(function(){
    mconsole.log('  before each one');
  })

  afterEach(function(){
    mconsole.log('  after each one');
  })

  describe('two', function(){
    before(function(){
      mconsole.log('  before two');
    })
    
    after(function(){
      mconsole.log('  after two');
    })
    
    beforeEach(function(){
      mconsole.log('    before each two');
    })
    
    afterEach(function(){
      mconsole.log('    after each two');
    })
    
    describe('three', function(){
      before(function(){
        mconsole.log('    before three');
      })
      
      after(function(){
        mconsole.log('    after three');
      })

      beforeEach(function(){
        mconsole.log('    before each three');
      })
      
      afterEach(function(){
        mconsole.log('    after each three');
      })

      it('should three', function(){
        mconsole.log('      TEST three');
      })
    })
  })
})
