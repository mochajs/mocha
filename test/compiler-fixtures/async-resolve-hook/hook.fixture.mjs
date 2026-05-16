const VIRTUAL_PREFIX = "virtual:";
const VIRTUAL_URL_PREFIX = "virtual-resolved:";

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(VIRTUAL_PREFIX)) {
    return {
      url: VIRTUAL_URL_PREFIX + specifier.slice(VIRTUAL_PREFIX.length),
      shortCircuit: true,
      format: "module",
    };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.startsWith(VIRTUAL_URL_PREFIX)) {
    const name = url.slice(VIRTUAL_URL_PREFIX.length);
    return {
      format: "module",
      source: `export const value = ${JSON.stringify(name)};`,
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
