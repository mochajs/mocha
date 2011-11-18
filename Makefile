
REPORTER = dot
TM_DEST = ~/Library/Application\ Support/TextMate/Bundles
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f)

all: mocha.js mocha.css

mocha.css: test/browser/style.css
	cp -f $< $@

mocha.js: $(SRC)
	@node support/compile $^
	@cat support/tail.js >> mocha.js

clean:
	rm -f mocha.js

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

watch:
	watch --interval=1 $(MAKE) mocha.js

tm:
	cp -fr editors/$(TM_BUNDLE) $(TM_DEST)/$(TM_BUNDLE)

.PHONY: watch test test-all test-bdd test-tdd test-exports test-unit test-grep tm clean