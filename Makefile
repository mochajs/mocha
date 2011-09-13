
TESTS = test/*.js
REPORTER = list

test:
	@./bin/mocha \
		--require should \
		--reporter $(REPORTER) \
		--ui bdd \
		$(TESTS)

.PHONY: test