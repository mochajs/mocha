import {describe,it} from "../../../../index.js";

describe('test1', () => {
  it('test', () => {
    const error = new Error('Foo');
    error.foo = { props: [] };
    error.foo.props.push(error.foo);
    throw error;
  });
});
