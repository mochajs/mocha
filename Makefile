
index.html: head.html foot.html index.md
	@markdown < index.md \
		| cat head.html - foot.html \
		> $@ 

clean:
	rm -f index.html

.PHONY: clean