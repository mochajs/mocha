import { equal } from "assert";
import world from './world';

describe('#World', () => {
  it('should be able to execute a test', function() {
    equal(true, true);
  });
  it('should return expected string', function() {
    equal(world('incoming'), "incoming-static")
  });
});
