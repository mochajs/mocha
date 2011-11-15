
REPORTER = dot

test: test-unit

test-all: test-bdd test-tdd test-exports test-unit test-grep

test-unit:
	@./bin/mocha \
		--reporter $(REPORTER)

test-bdd:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/interfaces/bdd

test-tdd:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd \
		test/interfaces/tdd

test-exports:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui exports \
		test/interfaces/exports

test-grep:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  --grep fast \
	  test/misc/grep

.PHONY: test test-all test-bdd test-tdd test-exports test-unit test-grep