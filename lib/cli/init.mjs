/**
 * Command module for "init" command
 *
 * @private
 * @module
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const command = "init <path>";

export const description = "create a client-side Mocha setup at <path>";

export const builder = (yargs) =>
  yargs.positional("path", {
    type: "string",
    normalize: true,
  });

export const handler = (argv) => {
  const destdir = argv.path;
  const srcdir = path.join(__dirname, "..", "..");
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
