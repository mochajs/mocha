
describe('global leaks', function(){
  before(function(){
    // uncomment to test
    // foo = 'hey';
    // bar = 'hey';
  })
  
  beforeEach(function(){
    // uncomment to test
    // foo = 'bar'
  });

  it('should cause tests to fail', function(){
    // uncomment to test
    // foo = 'bar';
    // bar = 'baz';
    // baz = 'raz';
  });

  it('should pass when accepted', function(){
    global.okGlobalA = 1;
    global.okGlobalB = 1;
    global.okGlobalC = 1;
  })

  it('should pass with wildcard', function(){
    global.callback123 = 'foo';
    global.callback345 = 'bar';
  })

  afterEach(function(){
    // uncomment to test
    // foo = 'bar'
  });
});