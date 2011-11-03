
TESTS = test/unit/*.js
REPORTER = list

test: test-unit

test-all: test-bdd test-tdd test-exports test-unit test-grep

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
		test/bdd

test-tdd:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui tdd \
		test/tdd

test-exports:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui exports \
		test/exports

test-grep:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  --grep fast \
	  test/grep

.PHONY: test test-all test-bdd test-tdd test-exports test-unit test-grep