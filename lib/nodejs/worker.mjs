/* istanbul ignore file */
// worker process entrypoint; worker logic is tested through worker-core.mjs
/**
 * A worker process.  Consumes {@link module:reporters/parallel-buffered} reporter.
 * @module worker
 * @private
 */

import { startWorker } from "./worker-core.mjs";

const { run } = startWorker();

export { run };
