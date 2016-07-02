before(function () {
  console.log('root before');
});
beforeEach(function () {
  console.log('root before each');
});
describe('1', function () {
  beforeEach(function () {
    console.log('1 before each');
  });

  describe('1-1', function () {
    before(function () {
      console.log('1-1 before');
    });
    beforeEach(function () {
      console.log('1-1 before each');
      throw new Error('1-1 before each hook failed');
    });
    it('1-1 test 1', function () {
      console.log('1-1 test 1');
    });
    it('1-1 test 2', function () {
      console.log('1-1 test 2');
    });
    afterEach(function () {
      console.log('1-1 after each');
    });
    after(function () {
      console.log('1-1 after');
      throw new Error('1-1 after hook failed');
    });
  });

  describe('1-2', function () {
    before(function () {
      console.log('1-2 before');
    });
    beforeEach(function () {
      console.log('1-2 before each');
    });
    it('1-2 test 1', function () {
      console.log('1-2 test 1');
    });
    it('1-2 test 2', function () {
      console.log('1-2 test 2');
    });
    afterEach(function () {
      console.log('1-2 after each');
      throw new Error('1-2 after each hook failed');
    });
    after(function () {
      console.log('1-2 after');
    });
  });

  afterEach(function () {
    console.log('1 after each');
  });

  after(function () {
    console.log('1 after');
  });
});

describe('2', function () {
  beforeEach(function () {
    console.log('2 before each');
    throw new Error('2 before each hook failed');
  });

  describe('2-1', function () {
    before(function () {
      console.log('2-1 before');
    });
    beforeEach(function () {
      console.log('2-1 before each');
    });
    it('2-1 test 1', function () {
      console.log('2-1 test 1');
    });
    it('2-1 test 2', function () {
      console.log('2-1 test 2');
    });
    afterEach(function () {
      console.log('2-1 after each');
    });
    after(function () {
      console.log('2-1 after');
    });
  });

  describe('2-2', function () {
    before(function () {
      console.log('2-2 before');
    });
    beforeEach(function () {
      console.log('2-2 before each');
    });
    it('2-2 test 1', function () {
      console.log('2-2 test 1');
    });
    it('2-2 test 2', function () {
      console.log('2-2 test 2');
    });
    afterEach(function () {
      console.log('2-2 after each');
    });
    after(function () {
      console.log('2-2 after');
    });
  });

  afterEach(function () {
    console.log('2 after each');
    throw new Error('2 after each hook failed');
  });

  after(function () {
    console.log('2 after');
  });
});

after(function () {
  console.log('root after');
});
afterEach(function () {
  console.log('root after each');
});
