
REPORTER = dot
TM_DEST = ~/Library/Application\ Support/TextMate/Bundles
TM_BUNDLE = JavaScript\ mocha.tmbundle

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

tm:
	cp -fr editors/$(TM_BUNDLE) $(TM_DEST)/$(TM_BUNDLE)

.PHONY: test test-all test-bdd test-tdd test-exports test-unit test-grep tm