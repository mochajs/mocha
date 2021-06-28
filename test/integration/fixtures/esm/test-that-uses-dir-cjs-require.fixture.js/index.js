// See https://github.com/mochajs/mocha/issues/4665 for an explanation of this test
it('should require a dir import', () => {
  expect(global.testPassesIfThisVariableIsDefined, 'to be', true)
})
