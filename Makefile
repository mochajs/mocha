
TESTS = test/*.js

test:
	@./bin/mocha \
		--require should \
		--reporter list \
		--ui bdd \
		$(TESTS)

.PHONY: test