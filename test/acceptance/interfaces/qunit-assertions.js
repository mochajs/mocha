suite("QUnit Assertion Types Tests");

test( "deepEqual test", function() {
  var obj = { foo: "bar" };
  deepEqual( obj, { foo: "bar" }, "Two objects can be the same in value" );
});

test( "equal test", function() {
  equal( 1, "1", "String '1' and number 1 have the same value" );
});

test( "notDeepEqual test", function() {
  var obj = { foo: "bar" };
  notDeepEqual( obj, { foo: "bla" }, "Different object, same key, different value, not equal" );
});

test( "notEqual test", function() {
  notEqual( 1, "2", "String '2' and number 1 don't have the same value" );
});

test( "notStrictEqual test", function() {
  notStrictEqual( 1, "1", "String '1' and number 1 don't have the same value" );
});

test( "ok test", function() {
  ok( true, "true succeeds" );
  ok( "non-empty", "non-empty string succeeds" );
});

test( "strictEqual test", function() {
  strictEqual( 1, 1, "1 and 1 are the same value and type" );
});

test( "throws", function() {
  function CustomError( message ) {
    this.message = message;
  }
  CustomError.prototype.toString = function() {
    return this.message;
  };
  throws(
    function() {
        throw "error"
    },
    "throws with just a message, no expected"
  );
  throws(
    function() {
        throw new CustomError();
    },
    CustomError,
    "raised error is an instance of CustomError"
  );
  throws(
    function() {
        throw new CustomError("some error description");
    },
    /description/,
    "raised error message contains 'description'"
  );
});