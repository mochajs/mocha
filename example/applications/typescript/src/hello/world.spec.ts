import world from './world';
import { equal } from "assert";

describe('#World', () => {
  it('should be able to execute a test', function() {
    equal(true, true);
  });
  it('should return expected string', function() {
    equal(world('first'), "firstadditional")
  });
});
