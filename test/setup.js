import unexpected from "unexpected";
import unexpectedSinon from "unexpected-sinon";
import unexpectedEventemitter from "unexpected-eventemitter";
import unexpectedMap from "unexpected-map";
import unexpectedSet from "unexpected-set";
import assertions from "./assertions.js";

global.expect = unexpected
  .clone()
  .use(unexpectedSinon)
  .use(unexpectedEventemitter)
  .use(unexpectedMap)
  .use(unexpectedSet)
  .use(assertions);
