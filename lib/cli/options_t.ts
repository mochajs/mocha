export interface MochaArgs {
  /** Path to `package.json` or `false` to skip */
  config?: string | false;
  package?: boolean;
  /** Filepath to mocha.opts; defaults to whatever's in `mocharc.opts`, or `false` to skip */
  opts?: string | false;
}
