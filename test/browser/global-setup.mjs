// Playwright global setup step that bundles test/browser-specific/setup.cjs for the browser.
// The interface specs ("bdd" / "tdd" / "qunit") and ESM specs are loaded directly in the page, but setup.cjs relies on CommonJS "require" to build the global expect, so it has to be bundled first.
// We reuse the same Rollup plugin pipeline as the Mocha browser build so the "global" and "process" shims behave consistently across both environments.

import path from "node:path";
import { fileURLToPath } from "node:url";

import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import { rollup } from "rollup";
import nodePolyfills from "rollup-plugin-polyfill-node";

import { SETUP_BUNDLE_PATH } from "./config.mjs";

const root = path.resolve(fileURLToPath(import.meta.url), "../../..");

/**
 * Bundles setup.cjs into a single browser-ready IIFE (Immediately Invoked Function Expression).
 *
 * @returns {Promise<void>}
 */
export default async function buildSetupBundle() {
  const bundle = await rollup({
    input: path.join(root, "test/browser-specific/setup.cjs"),
    plugins: [
      json(),
      commonjs(),
      nodePolyfills({ include: null }),
      nodeResolve({ browser: true }),
    ],
    onwarn: (warning, warn) => {
      if (warning.code === "CIRCULAR_DEPENDENCY") return;
      warn(warning);
    },
  });
  await bundle.write({
    file: path.join(root, SETUP_BUNDLE_PATH),
    format: "iife",
    name: "mochaBrowserSetup",
  });
  await bundle.close();
}
