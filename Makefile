PORT ?= 3000
bundle := bundle

start: toc bundle
	${bundle} exec jekyll serve --safe --drafts --watch --port ${PORT}


build: toc bundle
	${bundle} exec jekyll build --safe

toc:
	./node_modules/.bin/toc-idx -i index.md --max-depth 1 --bullet "\- " index.md

bundle:
	${bundle}
