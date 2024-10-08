import './fixtures/esm-build.fixture.mjs';

it('should register a global if it did not fail', function () {
  expect(window.MOCHA_IS_OK, 'to be ok');
});

it('should have a global mocha', function () {
  expect(window.mocha, 'not to be', undefined);
});

it('should have a global Mocha', function () {
  expect(window.Mocha, 'not to be', undefined);
});
