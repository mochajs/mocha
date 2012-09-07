
REPORTER ?= dot
TM_DEST = ~/Library/Application\ Support/TextMate/Bundles
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
SUPPORT = $(wildcard support/*.js)

all: mocha.js

mocha.js: $(SRC) $(SUPPORT)
	@node support/compile $(SRC)
	@cat \
	  support/head.js \
	  _mocha.js \
	  support/tail.js \
	  support/foot.js \
	  > mocha.js

clean:
	rm -f mocha.js
	rm -fr lib-cov
	rm -f coverage.html

test-cov: lib-cov
	@COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -fr ./$@
	@jscoverage lib $@

test: test-unit

test-all: test-bdd test-tdd test-qunit test-exports test-unit test-grep test-jsapi test-compilers

test-jsapi:
	@node test/jsapi

test-unit:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance/*.js \
		test/*.js

test-compilers:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-bdd:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/interfaces/bdd

test-tdd:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/interfaces/tdd

test-qunit:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/interfaces/qunit

test-exports:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui exports \
		test/acceptance/interfaces/exports

test-grep:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  --grep fast \
	  test/acceptance/misc/grep

test-invert:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  --grep slow \
	  --invert \
	  test/acceptance/misc/grep

test-bail:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--bail \
		test/acceptance/misc/bail

non-tty:
	@./bin/mocha \
		--reporter dot \
		test/acceptance/interfaces/bdd 2>&1 > /tmp/dot.out

	@echo dot:
	@cat /tmp/dot.out

	@./bin/mocha \
		--reporter list \
		test/acceptance/interfaces/bdd 2>&1 > /tmp/list.out

	@echo list:
	@cat /tmp/list.out

	@./bin/mocha \
		--reporter spec \
		test/acceptance/interfaces/bdd 2>&1 > /tmp/spec.out

	@echo spec:
	@cat /tmp/spec.out

tm:
	mkdir -p $(TM_DEST)
	cp -fr editors/$(TM_BUNDLE) $(TM_DEST)

.PHONY: test-cov test-jsapi test-compilers watch test test-all test-bdd test-tdd test-qunit test-exports test-unit non-tty test-grep tm clean
