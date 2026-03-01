import BrowserStdout from "browser-stdout";
import unexpected from 'unexpected'
import unexpectedSet from 'unexpected-set'
import unexpectedMap from 'unexpected-map'
import unexpectedSinon from 'unexpected-sinon'
import unexpectedEventEmitter from 'unexpected-eventemitter'

process.stdout = BrowserStdout();

global.expect = unexpected
  .clone()
  .use(unexpectedSet)
  .use(unexpectedMap)
  .use(unexpectedSinon)
  .use(unexpectedEventEmitter)
