
REPORTER ?= dot
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
SUPPORT = $(wildcard support/*.js)

all: mocha.js

lib/browser/diff.js: node_modules/diff/diff.js
	cp node_modules/diff/diff.js lib/browser/diff.js

mocha.js: $(SRC) $(SUPPORT) lib/browser/diff.js
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

test-all: test-bdd test-tdd test-qunit test-exports test-unit test-grep test-dry-run test-jsapi test-compilers test-sort test-glob test-requires test-reporters test-only

test-jsapi:
	@node test/jsapi

test-unit:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance/*.js \
		--growl \
		test/*.js

test-compilers:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-requires:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script \
		--require test/acceptance/require/a.js \
		--require test/acceptance/require/b.coffee \
		--require test/acceptance/require/c.js \
		--require test/acceptance/require/d.coffee \
		test/acceptance/require/require.js

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

test-dry-run:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  test/acceptance/misc/dry-run

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

test-async-only:
	@./bin/mocha \
	  --reporter $(REPORTER) \
	  --async-only \
	  test/acceptance/misc/asyncOnly

test-glob:
	@./test/acceptance/glob/glob.sh

test-reporters:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/reporters/*.js

test-only:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/misc/only/tdd

	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/misc/only/bdd

	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/misc/only/qunit

test-sort:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--sort \
		test/acceptance/sort

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
	@open editors/$(TM_BUNDLE)

.PHONY: test-cov test-jsapi test-compilers watch test test-all test-bdd test-tdd test-qunit test-exports test-unit non-tty test-grep test-dry-run tm clean
