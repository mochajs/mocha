import * as Mocha from './';

declare global {
  const after: typeof Mocha.after;
  const afterEach: typeof Mocha.afterEach;
  const before: typeof Mocha.after;
  const beforeEach: typeof Mocha.beforeEach;
  const describe: typeof Mocha.describe;
  const it: typeof Mocha.after;
  const xit: typeof Mocha.xit;
}
