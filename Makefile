BROWSERIFY := "node_modules/.bin/browserify"
KARMA := "node_modules/.bin/karma"
MOCHA := "bin/mocha"
NYC := "node_modules/.bin/nyc"

ifdef COVERAGE
define test_node
	$(NYC) --report-dir coverage/reports/$(1) $(MOCHA)
endef
else
	test_node := $(MOCHA)
endif

TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | LC_ALL=C sort)
TESTS = $(shell find test -name "*.js" -type f | sort)

all: mocha.js

mocha.js BUILDTMP/mocha.js: $(SRC) browser-entry.js
	@printf "==> [Browser :: build]\n"
	mkdir -p ${@D}
	$(BROWSERIFY) ./browser-entry \
		--plugin ./scripts/dedefine \
		--ignore 'fs' \
		--ignore 'glob' \
		--ignore 'path' \
		--ignore 'supports-color' > $@

clean:
	@printf "==> [Clean]\n"
	rm -rf BUILDTMP

lint:
	@printf "==> [Test :: Lint]\n"
	npm run lint

test-node: test-bdd test-tdd test-qunit test-exports test-unit test-integration test-jsapi test-compilers test-glob test-requires test-reporters test-only test-global-only

test-browser: clean BUILDTMP/mocha.js test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports

test: lint test-node test-browser

test-browser-unit:
	@printf "==> [Test :: Browser]\n"
	NODE_PATH=BUILDTMP $(KARMA) start --single-run

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
	$(call test_node,unit) test/acceptance/*.js \
		--growl \
		test/*.js

test-integration:
	@printf "==> [Test :: Integrations]\n"
	$(call test_node,integration) --timeout 5000 \
		test/integration/*.js

test-compilers:
	@printf "==> [Test :: Compilers]\n"
	$(call test_node,compilers) --compilers coffee:coffee-script/register,foo:./test/compiler/foo \
		test/acceptance/test.coffee \
		test/acceptance/test.foo

test-requires:
	@printf "==> [Test :: Requires]\n"
	$(call test_node,requires) --compilers coffee:coffee-script/register \
		--require test/acceptance/require/a.js \
		--require test/acceptance/require/b.coffee \
		--require test/acceptance/require/c.js \
		--require test/acceptance/require/d.coffee \
		test/acceptance/require/require.spec.js

test-bdd:
	@printf "==> [Test :: BDD]\n"
	$(call test_node,bdd) --ui bdd \
		test/acceptance/interfaces/bdd.spec

test-tdd:
	@printf "==> [Test :: TDD]\n"
	$(call test_node,tdd) --ui tdd \
		test/acceptance/interfaces/tdd.spec

test-qunit:
	@printf "==> [Test :: QUnit]\n"
	$(call test_node,qunit) --ui qunit \
		test/acceptance/interfaces/qunit.spec

test-exports:
	@printf "==> [Test :: Exports]\n"
	$(call test_node,exports) --ui exports \
		test/acceptance/interfaces/exports.spec

test-glob:
	@printf "==> [Test :: Glob]\n"
	bash ./test/acceptance/glob/glob.sh

test-reporters:
	@printf "==> [Test :: Reporters]\n"
	$(call test_node,reporters) test/reporters/*.js

test-only:
	@printf "==> [Test :: Only]\n"
	$(call test_node,only-tdd) --ui tdd \
		test/acceptance/misc/only/tdd.spec

	$(call test_node,only-bdd) --ui bdd \
		test/acceptance/misc/only/bdd.spec

	$(call test_node,only-bdd-require) --ui qunit \
		test/acceptance/misc/only/bdd-require.spec

test-global-only:
	@printf "==> [Test :: Global Only]\n"
	$(call test_node,global-only-tdd) --ui tdd \
		test/acceptance/misc/only/global/tdd.spec

	$(call test_node,global-only-bdd) --ui bdd \
		test/acceptance/misc/only/global/bdd.spec

	$(call test_node,global-only-qunit) --ui qunit \
		test/acceptance/misc/only/global/qunit.spec

test-mocha:
	@printf "==> [Test :: Mocha]\n"
	$(call test_node,mocha) test/mocha

non-tty:
	@printf "==> [Test :: Non-TTY]\n"
	$(call test_node,non-tty-dot) --reporter dot \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/dot.out

	@echo dot:
	@cat /tmp/dot.out

	$(call test_node,non-tty-list) --reporter list \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/list.out

	@echo list:
	@cat /tmp/list.out

	$(call test_node,non-tty-spec) --reporter spec \
		test/acceptance/interfaces/bdd.spec 2>&1 > /tmp/spec.out

	@echo spec:
	@cat /tmp/spec.out

tm:
	@printf "==> [TM]\n"
	open editors/$(TM_BUNDLE)

.PHONY: test-jsapi test-compilers watch test test-node test-bdd test-tdd test-qunit test-exports test-unit test-integration non-tty tm clean test-browser test-browser-unit test-browser-bdd test-browser-qunit test-browser-tdd test-browser-exports lint test-only test-global-only
