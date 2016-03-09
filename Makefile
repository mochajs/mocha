BROWSERIFY := "node_modules/.bin/browserify"
ESLINT := "node_modules/.bin/eslint"
KARMA := "node_modules/.bin/karma"

REPORTER ?= spec
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
TESTS = $(shell find test -name "*.js" -type f | sort)
SUPPORT = $(wildcard support/*.js)

all: mocha.js

mocha.js: $(SRC) $(SUPPORT)
	@printf "==> [Browser :: build]\n"
	@$(BROWSERIFY) ./browser-entry \
		--ignore 'fs' \
		--ignore 'glob' \
		--ignore 'jade' \
		--ignore 'path' \
		--ignore 'supports-color' \
		--exclude './lib-cov/mocha' > $@

clean:
	@printf "==> [Clean]\n"
	rm -f mocha.js
	rm -rf test-outputs
	rm -rf lib-cov
	rm -f coverage.html

test-cov: lib-cov
	@printf "==> [Test :: Coverage]\n"
	@COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	@printf "==> [Coverage]\n"
	@rm -fr ./$@
	@jscoverage lib $@

lint:
	@printf "==> [Test :: Lint]\n"
	@$(ESLINT) $(SRC)

test-node: test-bdd test-tdd test-qunit test-exports test-unit test-integration test-jsapi test-compilers test-glob test-requires test-reporters test-only test-global-only

test-browser: test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports

test: lint test-node test-browser

test-browser-unit: mocha.js
	@printf "==> [Test :: Browser]\n"
	@NODE_PATH=. $(KARMA) start

test-browser-bdd:
	@printf "==> [Test :: Browser :: BDD]\n"
	@MOCHA_UI=bdd $(MAKE) test-browser-unit

test-browser-qunit:
	@printf "==> [Test :: Browser :: QUnit]\n"
	@MOCHA_UI=qunit $(MAKE) test-browser-unit

test-browser-tdd:
	@printf "==> [Test :: Browser :: TDD]\n"
	@MOCHA_UI=tdd $(MAKE) test-browser-unit

test-jsapi:
	@printf "==> [Test :: JS API]\n"
	@node test/jsapi

test-unit:
	@printf "==> [Test :: Unit]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance/*.js \
		--growl \
		test/*.js

test-integration:
	@printf "==> [Test :: Integrations]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/integration/*.js

test-compilers:
	@printf "==> [Test :: Compilers]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script/register,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-requires:
	@printf "==> [Test :: Requires]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--compilers coffee:coffee-script/register \
		--require test/acceptance/require/a.js \
		--require test/acceptance/require/b.coffee \
		--require test/acceptance/require/c.js \
		--require test/acceptance/require/d.coffee \
		test/acceptance/require/require.js

test-bdd:
	@printf "==> [Test :: BDD]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/interfaces/bdd

test-tdd:
	@printf "==> [Test :: TDD]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/interfaces/tdd

test-qunit:
	@printf "==> [Test :: QUnit]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/interfaces/qunit

test-exports:
	@printf "==> [Test :: Exports]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui exports \
		test/acceptance/interfaces/exports

test-glob:
	@printf "==> [Test :: Glob]\n"
	@./test/acceptance/glob/glob.sh

test-reporters:
	@printf "==> [Test :: Reporters]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/reporters/*.js

test-only:
	@printf "==> [Test :: Only]\n"
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

test-global-only:
	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/misc/only/global/tdd

	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/misc/only/global/bdd

	@./bin/mocha \
		--reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/misc/only/global/qunit

test-mocha:
	@printf "==> [Test :: Mocha]\n"
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/mocha

non-tty:
	@printf "==> [Test :: Non-TTY]\n"
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
	@printf "==> [TM]\n"
	@open editors/$(TM_BUNDLE)

.PHONY: test-cov test-jsapi test-compilers watch test test-node test-bdd test-tdd test-qunit test-exports test-unit test-integration non-tty tm clean test-browser test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports lint
