
var exportsTest = module.exports = {
  'Array': {
    '#indexOf()': {
      'should return -1 when the value is not present': function () {
        var arr = [1,2,3];
        assert(-1 == arr.indexOf(5));
      },
      'should return the correct index when the value is present': function () {
        var arr = [1,2,3];
          assert(0 == arr.indexOf(1)); // just to test indentation
        assert(1 == arr.indexOf(2));
      }
    },
    '#pop()': {
      'should remove and return the last value': function () {
        var arr = [1,2,3];
        assert(arr.pop() == 3);
      },
      'should adjust .length': function () {
        var arr = [1,2,3];
        arr.pop();
        assert(arr.length == 2);
      }
    }
  }
}