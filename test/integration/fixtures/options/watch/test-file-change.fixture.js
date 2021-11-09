// This will be replaced in the tests
const testShouldFail = true;

it('checks dependency', () => {
  if (testShouldFail === true) {
    throw new Error('test failed');
  }
});
