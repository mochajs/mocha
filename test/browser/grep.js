// numbers
describe('21', function() {
  it('1', function() {
    assert(true);
  });
  it('2', function() {
    assert(true);
  });
});
// symbols
describe('@Array', function() {
  it('.pop()', function() {
    assert(true);
  });
  it('.push()', function() {
    assert(true);
  });
  it('.length', function() {
    assert(true);
  });
});

describe('@Function', function() {
  it('.call()', function() {
    assert(true);
  });
  it('.apply()', function() {
    assert(true);
  });
  it('.length', function() {
    assert(true);
  });
  it('.name', function() {
    assert(true);
  });
  it('.prototype', function() {
    assert(true);
  });
});

//url with hashtags
describe('#Services',function() {
  describe('#http', function() {
    it('.createClient()', function() {
      assert(true);
    });
    it('.Server()', function() {
      assert(true);
    });
  });
  describe('#crypto', function() {
    it('.randomBytes()', function() {
      assert(true);
    });
    it('.Hmac()', function() {
      assert(true);
    });
  });
});

// Uppercase
describe('CONSTANTS', function() {
  it('.STATUS_CODES', function() {
    assert(true);
  });
});

// Dates
describe('Date:', function() {
  it('01/02/2015', function() {
    assert(true);
  });
  it('01/03/2015', function() {
    assert(true);
  });
  it('01/06/2015', function() {
    assert(true);
  });
});

// etc..
describe('booking/summary', function() {
  it('should be run last', function() {
    assert(true);
  });
});

describe('component/booking/summary', function() {
  it('should be run second', function() {
    assert(true);
  });
});

describe('component/booking/intro', function() {
  it('should be run first', function() {
    assert(true);
  });
});

describe('contains numbers', function() {
  it('should run if the number 92 matching', function() {
    assert(true);
  });

  it('should run if the number 8 matching', function() {
    assert(true);
  });
});