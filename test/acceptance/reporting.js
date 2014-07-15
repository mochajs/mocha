describe('reporting', function() {
  it('reports diffs of circular structures without crashing', function() {
    var error = new Error();
    var actual = error.actual = {};
    var expected = error.expected = {};
    error.showDiff = true;
    actual.self = actual;
    expected.self = expected;

    // uncomment
    // throw error;
  })
})
