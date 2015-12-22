BROWSERIFY := node_modules/.bin/browserify
ESLINT := node_modules/.bin/eslint

REPORTER ?= spec
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
SUPPORT = $(wildcard support/*.js)

all: mocha.js

mocha.js: $(SRC) $(SUPPORT)
	@$(BROWSERIFY) ./support/browser-entry \
		--ignore 'fs' \
		--ignore 'glob' \
		--ignore 'jade' \
		--ignore 'path' \
		--ignore 'supports-color' \
		--exclude './lib-cov/mocha' > $@

clean:
	rm -f mocha.js
	rm -rf test-outputs
	rm -fr lib-cov
	rm -f coverage.html

test-cov: lib-cov
	@COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@rm -fr ./$@
	@jscoverage lib $@

lint:
	@$(ESLINT) $(SRC)

test: lint test-unit

test-all: lint test-bdd test-tdd test-qunit test-exports test-unit test-integration test-jsapi test-compilers test-glob test-requires test-reporters test-only

test-jsapi:
	@node test/jsapi

test-unit:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance/*.js \
		--growl \
		test/*.js

test-integration:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/integration/*.js

test-compilers:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script/register,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-requires:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script/register \
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
		test/acceptance/misc/only/bdd-require

	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/misc/only/qunit

test-mocha:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/mocha

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

.PHONY: test-cov test-jsapi test-compilers watch test test-all test-bdd test-tdd test-qunit test-exports test-unit test-integration non-tty tm clean
