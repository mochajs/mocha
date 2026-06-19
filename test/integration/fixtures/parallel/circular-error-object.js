import {describe,it} from "../../../../index.js";

describe('test1', () => {
  it('test', () => {
    const errorA = {};
    const objectB = {toA: errorA};
    errorA.toB = objectB;

    const error = new Error("Oh no!");
    error.error = errorA;
    error.values = [errorA];

    throw error;
  });
});
