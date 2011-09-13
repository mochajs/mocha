
TESTS = test/*.js

test:
	@./bin/mocha \
		--require should \
		--reporter spec \
		--ui bdd \
		$(TESTS)

.PHONY: test