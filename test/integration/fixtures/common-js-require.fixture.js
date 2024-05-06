const { afterEach,
  after,
  beforeEach,
  before,
  describe,
  xdescribe,
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
    }).timeout(1000);
    xit('it', () => {
      console.log('running xit');
    });
    it.only('it.only', () => {
      console.log('running it.only');
    }).retries(2);
    it.skip('it.skip', () => {
      console.log('running it.skip');
    });
    test('test', () => {
      console.log('running test');
    });
  });

  describe('describe', () => {});

  xdescribe('xdescribe', () => {});

  describe.skip('describe.skip', () => {});

  suite.only('suite only', () => {});

  suite.skip('suite.skip', () => {});

});

// using `run` here makes it so this suite needs to be run with `--delay` mode.
// adding it here to test that `run` is correctly exported from mocha.
setTimeout(run, 0);
