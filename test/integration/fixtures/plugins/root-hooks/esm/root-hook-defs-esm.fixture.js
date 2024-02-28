export const mochaHooks = () => ({
  beforeEach() {
    console.log('esm beforeEach');
  },
  afterEach() {
    console.log('esm afterEach');
  },
});
