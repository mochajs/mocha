/*
 Stripped down version of this error from ts-node:
 https://github.com/TypeStrong/ts-node/blob/ddb05ef23be92a90c3ecac5a0220435c65ebbd2a/src/index.ts#L435
 It's thrown when ts-node hits a compilation error.
 */
class TSError extends Error {
  constructor(...args) {
    super(...args);

    this.name = 'TSError';
  }
}
throw new TSError('A TS compilation error');
