# BDD Interface
## Enabled Test Case:

	it("A test case", function() {
		...
	});

## Ignored Test Case:

	xit("An ignored test case", function() {
		...
	});
	
# TDD Interface
## Enabled Test Case:

	test("A test case", function() {
		...
	});

## Ignored Test Case:

	xtest("An ignored test case", function() {
		...
	});

# qUnit Interface
## Enabled Test Case:

	test("A test case", function() {
		...
	});

## Ignored Test Case:

	xtest("An Ignored test case", function() {
		...
	});
	
# Exports Interface
	exports.Array = {
		'#Some Aspect': {
			'A test case': function() {
				...
			},
			'; An ignored test case': function() {
				...
			}
		}
	}

