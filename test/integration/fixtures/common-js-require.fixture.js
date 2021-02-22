const { afterEach,
  after,
  beforeEach,
  before,
  describe,
  it,
  xit,
  setup,
  suiteSetup,
  suiteTeardown,
  suite,
  teardown,
  test,
  run } = require('../../..');


suite('root suite', () => {
  setup(() => {
    console.log('running setup');
  })
  before(() => {
    console.log('running before');
  });
  beforeEach(() => {
    console.log('running beforeEach');
  });
  afterEach(() => {
    console.log('running afterEach');
  });
  after(() => {
    console.log('running after');
  });
  teardown(() => {
    console.log('running teardown');
  });
  suiteSetup(() => {
    console.log('running suiteSetup');
  });
  suiteTeardown(() => {
    console.log('running suiteTeardown');
  });

  describe.only('describe only', () => {
    it('it', () => {
      console.log('running it');
    });
    xit('it', () => {
      console.log('running xit');
    });
    it.only('it.only', () => {
      console.log('running it.only');
    });
    it.skip('it.skip', () => {
      console.log('running it.skip');
    });
    test('test', () => {
      console.log('running test');
    });
  });

  describe('describe', () => {});

  describe.skip('describe.skip', () => {});

  suite.only('suite only', () => {});

  suite.skip('suite.skip', () => {});
});
setTimeout(run, 0);
