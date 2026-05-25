/**
 * A worker process.  Consumes {@link module:reporters/parallel-buffered} reporter.
 * @module worker
 * @private
 */

import { startWorker } from "./worker-core.mjs";

/* istanbul ignore next */
const { run } = startWorker();

export { run };
