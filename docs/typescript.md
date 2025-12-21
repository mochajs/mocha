# TypeScript

Mocha supports TypeScript out of the box using Node.js native type stripping (available in Node.js 22.6.0+).

## Quick Start

Install Mocha and TypeScript:

```bash
npm install --save-dev mocha @types/mocha
```

Create a test file:

```typescript
// test/example.test.ts
import assert from "node:assert";

describe("Array", function () {
  it("should return -1 when value is not present", function () {
    assert.equal([1, 2, 3].indexOf(4), -1);
  });
});
```

Run your tests:

```bash
npx mocha --experimental-strip-types test/**/*.test.ts
```

> **Note:** Node.js native type stripping requires Node.js v22.6.0 or later. For older Node versions or more complex setups, see the [mocha-examples TypeScript packages](https://github.com/mochajs/mocha-examples).

## Alternative: Using ts-node

For projects needing full TypeScript compilation:

```bash
npm install --save-dev ts-node typescript
npx mocha --require ts-node/register test/**/*.test.ts
```

## More Examples

Check out [mocha-examples](https://github.com/mochajs/mocha-examples) for complete TypeScript project setups including configs for ts-node, tsx, and other tools.