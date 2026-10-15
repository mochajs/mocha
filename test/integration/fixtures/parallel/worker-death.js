// Fixture: a spec whose worker dies via SIGKILL in after()
// (process.exit is intercepted by the runner during a run)
describe('worker death', () => {
  it('passes before crash', () => {});
  after(() => process.kill(process.pid, 'SIGKILL'));
});
