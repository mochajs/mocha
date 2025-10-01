If you're here, you probably hit the deprecation notice. Sorry about that!

## Will it break?

This is a _soft_ deprecation, which means you get nagged about it, but it won't break (yet).

## Make it go away

To suppress this warning, execute `mocha` with the `--no-deprecation` flag (though you won't get notice of any _other_ deprecations you may encounter either).

## ... but why?

`--compilers` is redundant; we've yet to encounter a real-world situation in which the solution couldn't be expressed using `--require`.

## What should I use instead then?

Let's say you want to compile using CoffeeScript. Ensure that you have the coffeescript package installed as a dev dependency:

`npm install coffeescript --save-dev`

Then update your package.json with the relevant require statement: `--require coffeescript/register`.

Here's a list of popular compilers/transpilers:

- CoffeeScript: `--compilers coffee:coffee-script/register` becomes `--require coffeescript/register`
- Babel 6: `--compilers js:babel-core/register` becomes `--require babel-core/register`
- Babel 7: `--require babel-core/register` used if you are using Babel v6 becomes `--require @babel/register` with Babel v7.
- TypeScript: `--compilers ts:ts-node/register` becomes `--require ts-node/register`
- LiveScript: `--compilers ls:livescript` becomes `--require livescript`
- (feel free to add more examples!)

You'll have to handle file extensions as well. Mocha, by default, only loads `.js` files when given a directory (and the default directory is `test`). Therefore, to use a _different_ file extension (such as `.coffee` or `.ts`), you will need to supply a _glob_ instead of simply a directory. If this was how you ran Mocha pre-v4:

```bash
$ mocha --compilers coffee:coffee-script/register --recursive ./test
```

Then this is how you'd accomplish the same thing (`**` roughly means "recursive") in v4:

```bash
$ mocha --require coffeescript/register "test/**/*.js"
```

When you wrap a glob in quotes, file discovery is handed to the [glob](https://npm.im/glob) package.
It's _recommended_ to wrap in double-quotes, because the result should be the same regardless of your shell or environment (Windows/Linux/macOS, etc.).

[glob](https://npm.im/glob) is powerful. For instance, if your `test` dir has tests written in _both_ JS _and_ CoffeeScript, you could do this:

```bash
$ mocha --require coffeescript/register "test/**/*.{js,coffee}"
```

## How do I use this with `--watch`?

When using `--watch`, you will also need to specify the extension(s) to watch via `--watch-extensions`, e.g.:

```js
$ mocha --require coffeescript/register --watch --watch-extensions js,coffee "test/**/*.{js,coffee}"
```

## This isn't working

Any questions or trouble? Ask for help [in our Gitter chat room](https://gitter.im/mochajs/mocha)!
