# Mocha repros

This folder is completely separate from the Mocha project
so that you can test Mocha behavior in-repo
but in a way similar to an end-user.

Using this folder is completely optional.
If you prefer your own Git repo or some other method, go ahead!

## Usage

### Getting started

This is a minimal Node project.
`cd` to this directory, run `npm i`, then run `npm test` to make sure things work as expected.
Below is sample output; your versions of Mocha and Node may be different,
but the exit code should be 0.

```log
$ npm test

> test
> mocha; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)



  ✔ works

  1 passing (1ms)

Exit code 0
Mocha 12.0.1
Node v22.21.1
```

### Reproducing an issue

You can modify `package.json`, `test/hello.spec.js`,
and any other file in this folder to make this project into a bug reproduction.
You can add new files if needed!
Maintainers appreciate comprehensive console logs like the one seen above
pasted as plain text for easy copy-pasting.

You can modify this README.md with bug details and repro logs here,
or you can create a new `repro.md` if you prefer.

If you need any support, feel free to [reach out on Discord](https://discord.gg/KeDn2uXhER) or [create an issue](https://github.com/mochajs/mocha/issues/new/choose).

Below you'll find more details about this folder.

#### Repro logs

https://github.com/mochajs/mocha/issues/1948

Reproduced.

The run hangs until I send SIGKILL via Ctrl+C, exits with `130` (`echo $?`).
Node 26.5.0, Linux Mint 22.1 Cinnamon, Bash.

```
$ npm t

> test
> mocha --watch --check-leaks; echo Exit code $?; echo Mocha $(mocha --version);echo Node $(node --version)



  ✔ leaks a global
  1) leaks a global

  1 passing (2ms)
  1 failing

  1) leaks a global:
     Error: global leak(s) detected: 'leakedVar'
      at Runner.checkGlobals (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:441:21)
      at Runner.<anonymous> (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:208:12)
      at Runner.emit (node:events:521:24)
      at file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:982:14
      at done (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runnable.js:304:7)
      at callFn (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runnable.js:385:9)
      at Test.run (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runnable.js:348:7)
      at Runner.runTest (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:809:10)
      at file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:949:12
      at next (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:724:14)
      at file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:734:7
      at next (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:595:14)
      at Immediate._onImmediate (file:///home/markw/my-stuff/hello-hello/packages/mocha/packages/mocha/lib/runner.js:702:5)
      at process.processImmediate (node:internal/timers:534:21)



ℹ [mocha] waiting for changes...
^C⚠ [mocha] cleaning up, please wait...
```

### Debug logs

For debug logs, use `npm run test:debug`.
Below are sample abbreviated logs.
Mocha uses [the `debug` project](https://npmx.dev/package/debug) for these logs.

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:* npm test


> test
> mocha; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:parse-args starting splitArgs() +0ms
  mocha:cli:parse-args splitArgs took in array, returning argument unchanged +0ms
  mocha:cli:parse-args starting splitArgs() +1ms
  mocha:cli:parse-args splitArgs took in falsy value, returning empty array +0ms
  mocha:cli:config findConfig: found config file /.../mocha/repro/.mocharc.yml +0ms
  mocha:cli:config loadConfig: trying to parse config at /.../mocha/repro/.mocharc.yml +0ms

  ...

  mocha:runner _addEventListener(): adding for event unhandledRejection; 0 current listeners +0ms
  mocha:runner run(): starting +0ms
  mocha:runner run(): emitting start +0ms

  mocha:runner run(): emitted start +1ms
  mocha:runner runSuite(): running  +0ms

  mocha:runner _addEventListener(): adding for event error; 0 current listeners +0ms
  ✔ works
  mocha:runner run(): root suite completed; emitting end +0ms

  1 passing (1ms)

  mocha:runner run(): emitted end +0ms
Exit code 0
  mocha:esm-utils assigning requireOrImport, require_module === true +0ms
  mocha:cli:parse-args starting splitArgs(--version) +0ms
  mocha:cli:parse-args splitArgs took in array, returning argument unchanged +0ms
  mocha:cli:mocha loaded opts { _: [], version: true } +0ms
  mocha:cli:mocha running Mocha in-process +0ms
  mocha:cli:cli entered main with raw args [] +0ms
Mocha 12.0.1
Node v22.21.1
```

#### Filtering debug logs

You can modify the `test:debug` script in `package.json` to filter the debug logs.

```diff
-"test:debug": "npx cross-env DEBUG=mocha:* npm test",
+"test:debug": "npx cross-env DEBUG=mocha:cli:run:helpers npm test",
```

```log
$ npm run test:debug

> test:debug
> npx cross-env DEBUG=mocha:cli:run:helpers npm test


> test
> mocha; echo Exit code $?; echo Mocha $(mocha --version); echo Node $(node --version)

  mocha:cli:run:helpers test files (in order):  [
  '/.../mocha/repro/test/hello.spec.js'
] +0ms
  mocha:cli:run:helpers single run with 1 file(s) +0ms


  ✔ works

  1 passing (1ms)

Exit code 0
Mocha 12.0.1
Node v22.21.1
```

### package.json

This is a normal package.json.
The `//` prop is just for humans, and the props inside are sample values.
`file:..` is how to use this exact checkout of Mocha for testing.
Otherwise, `12.0.1` and `11.8.0` are sample values of supported Mocha releases.
If they're outdated, feel free to update them!
