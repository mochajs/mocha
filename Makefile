
GRUNT = node_modules/.bin/grunt
REPORTER ?= dot
TM_BUNDLE = JavaScript\ mocha.tmbundle
SRC = $(shell find lib -name "*.js" -type f | sort)
SUPPORT = $(wildcard support/*.js)

all: mocha.js

lib/browser/diff.js: node_modules/diff/diff.js
	$(GRUNT) copy:lib/browser/diff.js

mocha.js: $(SRC) $(SUPPORT) lib/browser/diff.js
	$(GRUNT) shell:build

clean:
	$(GRUNT) clean

test-cov: lib-cov
	@COV=1 $(MAKE) test REPORTER=html-cov > coverage.html

lib-cov:
	$(GRUNT) lib-cov

test: test-unit

test-all:
	$(GRUNT) test-all

test-jsapi:
	$(GRUNT) test-jsapi

test-unit:
	@./bin/mocha \
		--reporter $(REPORTER) \
		test/acceptance/*.js \
		--growl \
		test/*.js

test-compilers:
	$(GRUNT) test-compilers

test-requires:
	$(GRUNT) test-requires

test-bdd:
	$(GRUNT) test-bdd

test-tdd:
	$(GRUNT) test-tdd

test-qunit:
	$(GRUNT) test-qunit

test-exports:
	$(GRUNT) test-exports

test-grep:
	$(GRUNT) test-grep

test-invert:
	$(GRUNT) test-invert

test-bail:
	$(GRUNT) test-bail

test-async-only:
	$(GRUNT) test-only

test-glob:
	$(GRUNT) test-glob

non-tty:
	$(GRUNT) non-tty

tm:
	@open editors/$(TM_BUNDLE)

.PHONY: test-cov test-jsapi test-compilers watch test test-all test-bdd test-tdd test-qunit test-exports test-unit non-tty test-grep tm clean
