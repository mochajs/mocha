/**
 * Command module for "init" command
 *
 * @private
 * @module
 */

import fs from "node:fs";
import path from "node:path";

export const command = "init <path>";

export const description = "create a client-side Mocha setup at <path>";

export const parse = (args) => {
  const [pathArg] = args;
  if (!pathArg) {
    throw new Error("Not enough non-option arguments: got 0, need at least 1");
  }
  return { _: [], path: path.normalize(pathArg) };
};

export const handler = (argv) => {
  const destdir = argv.path;
  const srcdir = path.join(import.meta.dirname, "..", "..");
  fs.mkdirSync(destdir, { recursive: true });
  const css = fs.readFileSync(path.join(srcdir, "mocha.css"));
  const js = fs.readFileSync(path.join(srcdir, "mocha.js"));
  const tmpl = fs.readFileSync(
    path.join(srcdir, "lib", "browser", "template.html"),
  );
  fs.writeFileSync(path.join(destdir, "mocha.css"), css);
  fs.writeFileSync(path.join(destdir, "mocha.js"), js);
  fs.writeFileSync(path.join(destdir, "tests.spec.js"), "");
  fs.writeFileSync(path.join(destdir, "index.html"), tmpl);
};
