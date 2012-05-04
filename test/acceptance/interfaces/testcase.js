TestCase('JsTD assertions', {
	setUp: function() {
		this.setupHasbeenInvoked = true;
	},

	tearDown: function() {
		assertTrue(this.setupHasbeenInvoked);
	},

	'test assertTrue': function() {
		assertTrue(true);
	},

	'test assert': function() {
		assert(true);
	},

	'test assertEquals': function() {
		assertEquals('foo', 'foo');
	},

	'test assertNotEquals': function() {
		assertNotEquals(0, 1);
	},

	'test assertSame': function() {
		var foo = {};
		assertSame(foo, foo);
	},

	'test assertNotSame': function() {
		assertNotSame(0, 1);
	},

	'test assertNull': function() {
		assertNull(null);
	},

	'test assertNotNull': function() {
		assertNotNull({});
	},

	'test assertUndefined': function() {
		assertUndefined(undefined);
	},

	'test assertNotUndefined': function() {
		assertNotUndefined({});
	},

	'test assertNaN': function() {
		assertNaN(NaN);
	},

	'test assertNotNaN': function() {
		assertNotNaN(1);
	},

	'test assertException': function() {
		var callback = function() {
			throw new Error();
		};
		assertException(callback, "Error");
	},

	'test assertNoException': function() {
		assertNoException(function() {},
		Error);
	},

	'test assertTypeOf': function() {
		assertTypeOf('number', 1);
	},

	'test assertArray': function() {
		assertArray([]);
	},

	'test assertBoolean': function() {
		assertBoolean(true);
	},

	'test assertFunction': function() {
		assertFunction(function() {});
	},

	'test assertNumber': function() {
		assertNumber(4);
	},

	'test assertObject': function() {
		assertObject({});
	},

	'test assertString': function() {
		assertString('foo');
	},

	'test assertMatch': function() {
		assertMatch(/foo/, 'foo');
	},

	'test assertNoMatch': function() {
		assertNoMatch(/foo/, 'bar');
	},

	'test assertTagName': function() {
		assertTagName('foo', {
			tagName: 'foo'
		});
	},

	'test assertClassName': function() {
		assertClassName('foo', {
			className: 'foo'
		});
	},

	'test assertElementId': function() {
		assertElementId('foo', {
			id: 'foo'
		});
	},

	'test assertInstanceOf': function() {
		assertInstanceOf(Array, []);
	},

	'test assertNotInstanceOf': function() {
		assertNotInstanceOf(Array, {});
	}

});

