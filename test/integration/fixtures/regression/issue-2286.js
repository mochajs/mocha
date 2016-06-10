describe('testception for issue 2286 meta test', function () {
  beforeEach('skips tests', function () { this.skip() })
  after('should run', function () { console.log('after in suite') })
  it('skipped by beforeEach', function () {})
})
