/**
 * A worker process.  Consumes {@link module:reporters/parallel-buffered} reporter.
 * @module worker
 * @private
 */

import { startWorker } from "./worker-core.mjs";

const worker = startWorker();
const { run } = worker;

export { run };
