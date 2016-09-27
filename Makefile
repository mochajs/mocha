BROWSERIFY := "node_modules/.bin/browserify"
ESLINT := "node_modules/.bin/eslint"
KARMA := "node_modules/.bin/karma"
MOCHA := "bin/mocha"

REPORTER ?= spec
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
TESTS = $(shell find test -name "*.js" -type f | sort)

all: mocha.js

mocha.js: $(SRC) browser-entry.js
	@printf "==> [Browser :: build]\n"
	$(BROWSERIFY) ./browser-entry \
		--plugin ./scripts/dedefine \
		--ignore 'fs' \
		--ignore 'glob' \
		--ignore 'path' \
		--ignore 'supports-color' > $@

clean:
	@printf "==> [Clean]\n"
	rm -f mocha.js

lint:
	@printf "==> [Test :: Lint]\n"
	$(ESLINT) browser-entry.js index.js karma.conf.js bin/mocha bin/_mocha "lib/**/*.js" "scripts/**/*.js" test

test-node: test-bdd test-tdd test-qunit test-exports test-unit test-integration test-jsapi test-compilers test-glob test-requires test-reporters test-only test-global-only

test-browser: clean mocha.js test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports

test: lint test-node test-browser

test-browser-unit:
	@printf "==> [Test :: Browser]\n"
	NODE_PATH=. $(KARMA) start --single-run

test-browser-bdd:
	@printf "==> [Test :: Browser :: BDD]\n"
	MOCHA_UI=bdd $(MAKE) test-browser-unit

test-browser-qunit:
	@printf "==> [Test :: Browser :: QUnit]\n"
	MOCHA_UI=qunit $(MAKE) test-browser-unit

test-browser-tdd:
	@printf "==> [Test :: Browser :: TDD]\n"
	MOCHA_UI=tdd $(MAKE) test-browser-unit

test-jsapi:
	@printf "==> [Test :: JS API]\n"
	node test/jsapi

test-unit:
	@printf "==> [Test :: Unit]\n"
	$(MOCHA) --reporter $(REPORTER) \
		test/acceptance/*.js \
		--growl \
		test/*.js

test-integration:
	@printf "==> [Test :: Integrations]\n"
	$(MOCHA) --timeout 5000 \
		--reporter $(REPORTER) \
		test/integration/*.js

test-compilers:
	@printf "==> [Test :: Compilers]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--compilers coffee:coffee-script/register,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-requires:
	@printf "==> [Test :: Requires]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--compilers coffee:coffee-script/register \
		--require test/acceptance/require/a.js \
		--require test/acceptance/require/b.coffee \
		--require test/acceptance/require/c.js \
		--require test/acceptance/require/d.coffee \
		test/acceptance/require/require.spec.js

test-bdd:
	@printf "==> [Test :: BDD]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/interfaces/bdd.spec

test-tdd:
	@printf "==> [Test :: TDD]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/interfaces/tdd.spec

test-qunit:
	@printf "==> [Test :: QUnit]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/interfaces/qunit.spec

test-exports:
	@printf "==> [Test :: Exports]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui exports \
		test/acceptance/interfaces/exports.spec

test-glob:
	@printf "==> [Test :: Glob]\n"
	bash ./test/acceptance/glob/glob.sh

test-reporters:
	@printf "==> [Test :: Reporters]\n"
	$(MOCHA) --reporter $(REPORTER) \
		test/reporters/*.js

test-only:
	@printf "==> [Test :: Only]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/misc/only/tdd.spec

	$(MOCHA) --reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/misc/only/bdd.spec

	$(MOCHA) --reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/misc/only/bdd-require.spec

test-global-only:
	@printf "==> [Test :: Global Only]\n"
	$(MOCHA) --reporter $(REPORTER) \
		--ui tdd \
		test/acceptance/misc/only/global/tdd.spec

	$(MOCHA) --reporter $(REPORTER) \
		--ui bdd \
		test/acceptance/misc/only/global/bdd.spec

	$(MOCHA) --reporter $(REPORTER) \
		--ui qunit \
		test/acceptance/misc/only/global/qunit.spec

test-mocha:
	@printf "==> [Test :: Mocha]\n"
	$(MOCHA) --reporter $(REPORTER) \
		test/mocha

non-tty:
	@printf "==> [Test :: Non-TTY]\n"
	$(MOCHA) --reporter dot \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/dot.out

	@echo dot:
	@cat /tmp/dot.out

	$(MOCHA) --reporter list \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/list.out

	@echo list:
	@cat /tmp/list.out

	$(MOCHA) --reporter spec \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/spec.out

	@echo spec:
	@cat /tmp/spec.out

tm:
	@printf "==> [TM]\n"
	open editors/$(TM_BUNDLE)

.PHONY: test-jsapi test-compilers watch test test-node test-bdd test-tdd test-qunit test-exports test-unit test-integration non-tty tm clean test-browser test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports lint test-only test-global-only
