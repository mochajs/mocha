/**
 * TestCase-style interface:
 *
 * TestCase('foo', {
 *  setUp: function() { },
 *  'test bar': function() { }
 * });
 *
 *
 * this file tries to accurately replicate JsTestDriver's TestCase behavior
 * and thus is based on Asserts.js from JsTestDriver project
 * (c) 2009 by Google Inc. released under Apache-2.0 license
 *
 *
 *  adlan dot elm at g mail dot com
 **/

var Suite = require('../suite');
var Test = require('../test');
var assert = require('assert');

module.exports = function(suite) {
	var suites = [suite];

	suite.on('pre-require', function(context) {

		var root = context;
		var isInBrowser = (typeof document != 'undefined')
		var assertCount;

		context.TestCase = function(title, obj) {
			var suite = Suite.create(suites[0], title);
			suites.unshift(suite);
			for (var name in obj) {
				switch (name) {
				case 'setUp':
					suites[0].beforeAll(obj[name]);
					break;
				case 'tearDown':
					suites[0].afterAll(obj[name]);
					break;
				default:
					suites[0].addTest(new Test(name.replace('test ', ''), obj[name]));
				}
			}
			suites.shift();
		};

		/****** here goes the adaptation of Asserts.js, don't blame me for the ugly code :) ******/

		context.expectAsserts = function expectAsserts(count) {
			root.expectedAssertCount = count;
		}

		context.fail = function fail(msg) {
			var err = new Error(msg);
			err.name = 'AssertError';

			if (!err.message) {
				err.message = msg;
			}

			throw err;
		};

		function isBoolean_(bool) {
			if (typeof(bool) != 'boolean') {
				fail('Not a boolean: ' + prettyPrintEntity_(bool));
			}
		}

		var isElement_ = (function() {
			if (!isInBrowser) return function() {
				return true;
			};
			var div = document.createElement('div');

			function isNode(obj) {
				try {
					div.appendChild(obj);
					div.removeChild(obj);
				} catch(e) {
					return false;
				}

				return true;
			}

			return function isElement(obj) {
				return obj && obj.nodeType === 1 && isNode(obj);
			};
		} ());

		function formatElement_(el) {
			var tagName;

			try {
				tagName = el.tagName.toLowerCase();
				var str = '<' + tagName;
				var attrs = el.attributes,
				attribute;

				for (var i = 0, l = attrs.length; i < l; i++) {
					attribute = attrs.item(i);

					if ( !! attribute.nodeValue) {
						str += ' ' + attribute.nodeName + '=\"' + attribute.nodeValue + '\"';
					}
				}

				return str + '>...</' + tagName + '>';
			} catch(e) {
				return '[Element]' + ( !! tagName ? ' ' + tagName: '');
			}
		}

		function prettyPrintEntity_(entity) {
			if (isElement_(entity)) {
				return formatElement_(entity);
			}

			var str;

			if (typeof entity == 'function') {
				try {
					str = entity.toString().match(/(function [^\(]+\(\))/)[1];
				} catch(e) {}

				return str || '[function]';
			}

			try {
				str = JSON.stringify(entity);
			} catch(e) {}

			return str || '[' + typeof entity + ']';
		}

		function argsWithOptionalMsg_(args, length) {
			var copyOfArgs = [];
			// make copy because it's bad practice to change a passed in mutable
			// And to ensure we aren't working with an arguments array. IE gets bitchy.
			for (var i = 0; i < args.length; i++) {
				copyOfArgs.push(args[i]);
			}
			var min = length - 1;

			if (args.length < min) {
				fail('expected at least ' + min + ' arguments, got ' + args.length);
			} else if (args.length == length) {
				copyOfArgs[0] += ' ';
			} else {
				copyOfArgs.unshift('');
			}
			return copyOfArgs;
		}

		context.assertTrue = function assertTrue(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			isBoolean_(args[1]);
			if (args[1] != true) {
				fail(args[0] + 'expected true but was ' + prettyPrintEntity_(args[1]));
			}
			return true;
		}

		context.assertFalse = function assertFalse(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			isBoolean_(args[1]);
			if (args[1] != false) {
				fail(args[0] + 'expected false but was ' + prettyPrintEntity_(args[1]));
			}
			return true;
		}

		context.assertEquals = function assertEquals(msg, expected, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;
			msg = args[0];
			expected = args[1];
			actual = args[2];

			if (!compare_(expected, actual)) {
				fail(msg + 'expected ' + prettyPrintEntity_(expected) + ' but was ' + prettyPrintEntity_(actual) + '');
			}
			return true;
		}

		function compare_(expected, actual) {
			if (expected === actual) {
				return true;
			}

			if (typeof expected != 'object' || typeof actual != 'object' || ! expected || ! actual) {
				return expected == actual;
			}

			if (isElement_(expected) || isElement_(actual)) {
				return false;
			}

			var key = null;
			var actualLength = 0;
			var expectedLength = 0;

			try {
				// If an array is expected the length of actual should be simple to
				// determine. If it is not it is undefined.
				if (Array.isArray(actual)) {
					actualLength = actual.length;
				} else {
					// In case it is an object it is a little bit more complicated to
					// get the length.
					for (key in actual) {
						if (actual.hasOwnProperty(key)) {++actualLength;
						}
					}
				}

				// Arguments object
				if (actualLength == 0 && typeof actual.length == 'number') {
					actualLength = actual.length;

					for (var i = 0, l = actualLength; i < l; i++) {
						if (! (i in actual)) {
							actualLength = 0;
							break;
						}
					}
				}

				for (key in expected) {
					if (expected.hasOwnProperty(key)) {
						if (!compare_(expected[key], actual[key])) {
							return false;
						}

						++expectedLength;
					}
				}

				if (expectedLength != actualLength) {
					return false;
				}

				return expectedLength == 0 ? expected.toString() == actual.toString() : true;
			} catch(e) {
				return false;
			}
		}

		context.assertNotEquals = function assertNotEquals(msg, expected, actual) {
			try {
				assertEquals.apply(this, arguments);
			} catch(e) {
				if (e.name == 'AssertError') {
					return true;
				}

				throw e;
			}

			var args = argsWithOptionalMsg_(arguments, 3);

			fail(args[0] + 'expected ' + prettyPrintEntity_(args[1]) + ' not to be equal to ' + prettyPrintEntity_(args[2]));
		}

		context.assertSame = function assertSame(msg, expected, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;

			if (!isSame_(args[2], args[1])) {
				fail(args[0] + 'expected ' + prettyPrintEntity_(args[1]) + ' but was ' + prettyPrintEntity_(args[2]));
			}
			return true;
		}

		context.assertNotSame = function assertNotSame(msg, expected, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;

			if (isSame_(args[2], args[1])) {
				fail(args[0] + 'expected not same as ' + prettyPrintEntity_(args[1]) + ' but was ' + prettyPrintEntity_(args[2]));
			}
			return true;
		}

		function isSame_(expected, actual) {
			return actual === expected;
		}

		context.assertNull = function assertNull(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (args[1] !== null) {
				fail(args[0] + 'expected null but was ' + prettyPrintEntity_(args[1]));
			}
			return true;
		}

		context.assertNotNull = function assertNotNull(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (args[1] === null) {
				fail(args[0] + 'expected not null but was null');
			}

			return true;
		}

		context.assertUndefined = function assertUndefined(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (typeof args[1] != 'undefined') {
				fail(args[2] + 'expected undefined but was ' + prettyPrintEntity_(args[1]));
			}
			return true;
		}

		context.assertNotUndefined = function assertNotUndefined(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (typeof args[1] == 'undefined') {
				fail(args[0] + 'expected not undefined but was undefined');
			}
			return true;
		}

		context.assertNaN = function assertNaN(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (!isNaN(args[1])) {
				fail(args[0] + 'expected to be NaN but was ' + args[1]);
			}

			return true;
		}

		context.assertNotNaN = function assertNotNaN(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (isNaN(args[1])) {
				fail(args[0] + 'expected not to be NaN');
			}

			return true;
		}

		context.assertException = function assertException(msg, callback, error) {
			if (arguments.length == 1) {
				// assertThrows(callback)
				callback = msg;
				msg = '';
			} else if (arguments.length == 2) {
				if (typeof callback != 'function') {
					// assertThrows(callback, type)
					error = callback;
					callback = msg;
					msg = '';
				} else {
					// assertThrows(msg, callback)
					msg += ' ';
				}
			} else {
				// assertThrows(msg, callback, type)
				msg += ' ';
			}

			assertCount++;

			try {
				callback();
			} catch(e) {
				if (e.name == 'AssertError') {
					throw e;
				}

				if (error && e.name != error) {
					fail(msg + 'expected to throw ' + error + ' but threw ' + e.name);
				}

				return true;
			}

			fail(msg + 'expected to throw exception');
		}

		context.assertNoException = function assertNoException(msg, callback) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			try {
				args[1]();
			} catch(e) {
				fail(args[0] + 'expected not to throw exception, but threw ' + e.name + ' (' + e.message + ')');
			}
		}

		context.assertArray = function assertArray(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			assertCount++;

			if (!Array.isArray(args[1])) {
				fail(args[0] + 'expected to be array, but was ' + prettyPrintEntity_(args[1]));
			}
		}

		context.assertTypeOf = function assertTypeOf(msg, expected, value) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;
			var actual = typeof args[2];

			if (actual != args[1]) {
				fail(args[0] + 'expected to be ' + args[1] + ' but was ' + actual);
			}

			return true;
		}

		context.assertBoolean = function assertBoolean(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			return assertTypeOf(args[0], 'boolean', args[1]);
		}

		context.assertFunction = function assertFunction(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			return assertTypeOf(args[0], 'function', args[1]);
		}

		context.assertObject = function assertObject(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			return assertTypeOf(args[0], 'object', args[1]);
		}

		context.assertNumber = function assertNumber(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			return assertTypeOf(args[0], 'number', args[1]);
		}

		context.assertString = function assertString(msg, actual) {
			var args = argsWithOptionalMsg_(arguments, 2);
			return assertTypeOf(args[0], 'string', args[1]);
		}

		context.assertMatch = function assertMatch(msg, regexp, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			var isUndef = typeof args[2] == 'undefined';
			assertCount++;
			var _undef;

			if (isUndef || ! args[1].test(args[2])) {
				actual = (isUndef ? _undef: prettyPrintEntity_(args[2]));
				fail(args[0] + 'expected ' + actual + ' to match ' + args[1]);
			}

			return true;
		}

		context.assertNoMatch = function assertNoMatch(msg, regexp, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;

			if (args[1].test(args[2])) {
				fail(args[0] + 'expected ' + prettyPrintEntity_(args[2]) + ' not to match ' + args[1]);
			}

			return true;
		}

		context.assertTagName = function assertTagName(msg, tagName, element) {
			var args = argsWithOptionalMsg_(arguments, 3);
			var actual = args[2] && args[2].tagName;

			if (String(actual).toUpperCase() != args[1].toUpperCase()) {
				fail(args[0] + 'expected tagName to be ' + args[1] + ' but was ' + actual);
			}
			return true;
		}

		context.assertClassName = function assertClassName(msg, className, element) {
			var args = argsWithOptionalMsg_(arguments, 3);
			var actual = args[2] && args[2].className;
			var regexp = new RegExp('(^|\\s)' + args[1] + '(\\s|$)');

			try {
				assertMatch(args[0], regexp, actual);
			} catch(e) {
				actual = prettyPrintEntity_(actual);
				fail(args[0] + 'expected class name to include ' + prettyPrintEntity_(args[1]) + ' but was ' + actual);
			}

			return true;
		}

		context.assertElementId = function assertElementId(msg, id, element) {
			var args = argsWithOptionalMsg_(arguments, 3);
			var actual = args[2] && args[2].id;
			assertCount++;

			if (actual !== args[1]) {
				fail(args[0] + 'expected id to be ' + args[1] + ' but was ' + actual);
			}

			return true;
		}

		context.assertInstanceOf = function assertInstanceOf(msg, constructor, actual) {
			assertCount++;
			var args = argsWithOptionalMsg_(arguments, 3);
			var pretty = prettyPrintEntity_(args[2]);
			var expected = args[1] && args[1].name || args[1];

			if (args[2] == null) {
				fail(args[0] + 'expected ' + pretty + ' to be instance of ' + expected);
			}

			if (! (Object(args[2]) instanceof args[1])) {
				fail(args[0] + 'expected ' + pretty + ' to be instance of ' + expected);
			}

			return true;
		}

		context.assertNotInstanceOf = function assertNotInstanceOf(msg, constructor, actual) {
			var args = argsWithOptionalMsg_(arguments, 3);
			assertCount++;

			if (Object(args[2]) instanceof args[1]) {
				var expected = args[1] && args[1].name || args[1];
				var pretty = prettyPrintEntity_(args[2]);
				fail(args[0] + 'expected ' + pretty + ' not to be instance of ' + expected);
			}

			return true;
		}

		/**
 * Asserts that two doubles, or the elements of two arrays of doubles,
 * are equal to within a positive delta.
 */
		context.assertEqualsDelta = function assertEqualsDelta(msg, expected, actual, epsilon) {
			var args = this.argsWithOptionalMsg_(arguments, 4);
			assertCount++;
			msg = args[0];
			expected = args[1];
			actual = args[2];
			epsilon = args[3];

			if (!compareDelta_(expected, actual, epsilon)) {
				this.fail(msg + 'expected ' + epsilon + ' within ' + this.prettyPrintEntity_(expected) + ' but was ' + this.prettyPrintEntity_(actual) + '');
			}
			return true;
		};

		function compareDelta_(expected, actual, epsilon) {
			var compareDouble = function(e, a, d) {
				return Math.abs(e - a) <= d;
			}
			if (expected === actual) {
				return true;
			}

			if (typeof expected == "number" || typeof actual == "number" || ! expected || ! actual) {
				return compareDouble(expected, actual, epsilon);
			}

			if (isElement_(expected) || isElement_(actual)) {
				return false;
			}

			var key = null;
			var actualLength = 0;
			var expectedLength = 0;

			try {
				// If an array is expected the length of actual should be simple to
				// determine. If it is not it is undefined.
				if (Array.isArray(actual)) {
					actualLength = actual.length;
				} else {
					// In case it is an object it is a little bit more complicated to
					// get the length.
					for (key in actual) {
						if (actual.hasOwnProperty(key)) {++actualLength;
						}
					}
				}

				// Arguments object
				if (actualLength == 0 && typeof actual.length == "number") {
					actualLength = actual.length;

					for (var i = 0, l = actualLength; i < l; i++) {
						if (! (i in actual)) {
							actualLength = 0;
							break;
						}
					}
				}

				for (key in expected) {
					if (expected.hasOwnProperty(key)) {
						if (!compareDelta_(expected[key], actual[key], epsilon)) {
							return false;
						}

						++expectedLength;
					}
				}

				if (expectedLength != actualLength) {
					return false;
				}

				return expectedLength == 0 ? expected.toString() == actual.toString() : true;
			} catch(e) {
				return false;
			}
		}

		context.assert = assertTrue;

	});
};

