/* istanbul ignore file */
/**
 * A worker process.  Consumes {@link module:reporters/parallel-buffered} reporter.
 * @module worker
 * @private
 */

import { startWorker } from "./worker-core.js";

const { run } = startWorker();

export { run };
