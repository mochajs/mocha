import fsPromises from "node:fs/promises";
import { fileURLToPath } from "node:url";

export async function load(url, context, nextLoad) {
  if (!url.includes("compiler-esm") && !url.includes("compiler-cjs")) {
    return nextLoad(url, context);
  }
  const format = url.includes("compiler-esm") ? "module" : "commonjs";
  const content = await fsPromises.readFile(
    fileURLToPath(url + ".compiled"),
    "utf8",
  );
  return {
    format,
    source: content,
    shortCircuit: true,
  };
}
