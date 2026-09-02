// Fixture: a spec whose worker dies via process.exit in after()
describe('worker death', () => {
  it('passes before crash', () => {});
  after(() => process.exit(1));
});
