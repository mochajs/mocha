
TESTS = test/unit/*.js
REPORTER = list

test: test-unit

test-all: test-bdd test-tdd test-exports test-unit

test-unit:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui bdd \
		$(TESTS)

test-bdd:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui bdd \
		test/bdd.js

test-tdd:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui tdd \
		test/tdd.js

test-exports:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui exports \
		test/exports.js

.PHONY: test test-all test-bdd test-tdd test-exports test-unit