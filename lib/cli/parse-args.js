import { parseArgs } from "node:util";
import {
  createInvalidArgumentTypeError,
  createUnsupportedError,
} from "../errors.js";
import { isNumeric } from "../utils.cjs";
import { list } from "./run-helpers.cjs";
import {
  aliases,
  expectedTypeForFlag,
  isMochaFlag,
  stripLeadingDashes,
  types,
} from "./run-option-metadata.cjs";
import { isNodeFlag } from "./node-flags.cjs";
import debugModule from "debug";

const debug = debugModule("mocha:cli:parse-args");
const globOptions = ["spec", "ignore"];
const aliasToCanonical = Object.entries(aliases).reduce(
  (acc, [canonical, optionAliases]) => {
    optionAliases.forEach((alias) => {
      acc[alias] = canonical;
    });
    return acc;
  },
  {},
);

const canonicalOptionName = (name) => aliasToCanonical[name] || name;

const optionTypeByName = Object.entries(types).reduce((acc, [type, names]) => {
  names.forEach((name) => {
    acc[name] = type;
  });
  return acc;
}, {});

const arrayOptions = new Set(types.array);
const booleanOptions = new Set(types.boolean);
const numberOptions = new Set(types.number);
const scalarOptions = new Set(types.boolean.concat(types.string, types.number));

/**
 * Directly-passed Node/V8 flags are not a fixed list known to this parser. When
 * we see them, define them as boolean options for parseArgs(), then reapply any
 * values from equals-form flags after parsing.
 */
const createParseArgsOptions = (nodeArgs) => {
  const options = {};

  Object.entries(optionTypeByName).forEach(([name, type]) => {
    const short = (aliases[name] || []).find((alias) => alias.length === 1);
    options[name] = {
      type: type === "boolean" ? "boolean" : "string",
      multiple: type !== "boolean",
    };
    if (short) {
      options[name].short = short;
    }
  });

  nodeArgs.forEach(([name]) => {
    options[name] = { type: "boolean" };
  });

  return options;
};

const toArray = (value) => {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

// Array-type options should have unique values, with comma-delimited values
// split unless the option is a glob where commas can be part of the pattern.
const coerceArrayOption = (name, value) => {
  if (
    name === "reporter-option" &&
    value &&
    typeof value === "object" &&
    !Array.isArray(value)
  ) {
    return value;
  }

  if (
    name === "reporter-option" &&
    Array.isArray(value) &&
    value.every(
      (item) => item && typeof item === "object" && !Array.isArray(item),
    )
  ) {
    return Object.assign({}, ...value);
  }
  const values = toArray(value);
  return Array.from(
    new Set(globOptions.includes(name) ? values : list(values)),
  );
};

// Boolean/string/number options use the last value when given multiple times.
const coerceScalarOption = (name, value) => {
  const scalar = Array.isArray(value) ? value[value.length - 1] : value;

  if (booleanOptions.has(name)) {
    if (scalar === "false") {
      return false;
    }
    if (scalar === "true") {
      return true;
    }
  }

  return scalar;
};

const coerceNumberOption = (value) => {
  const scalar = Array.isArray(value) ? value[value.length - 1] : value;
  return scalar === undefined ? scalar : Number(scalar);
};

const mergeValue = (existing, next) => {
  if (existing === undefined) {
    return next;
  }
  return toArray(existing).concat(toArray(next));
};

const mergeConfigObjects = (defaultValues, configObjects) => {
  const defaultArrayOptions = new Set();

  return [defaultValues]
    .concat(configObjects.slice().reverse())
    .reduce((merged, config) => {
      if (!config) {
        return merged;
      }

      Object.entries(config).forEach(([rawName, value]) => {
        const name = canonicalOptionName(rawName);
        if (name === "_") {
          merged._ = mergeValue(value, merged._);
        } else if (arrayOptions.has(name)) {
          if (config === defaultValues) {
            defaultArrayOptions.add(name);
            merged[name] = value;
          } else if (defaultArrayOptions.has(name)) {
            defaultArrayOptions.delete(name);
            merged[name] = value;
          } else {
            merged[name] = mergeValue(value, merged[name]);
          }
        } else {
          merged[name] = value;
        }
      });

      return merged;
    }, {});
};

const preprocessArgs = (allArgs) => {
  return allArgs.map((arg) => {
    const noPrefix = stripLeadingDashes(arg);
    const [name, ...rest] = noPrefix.split("=");
    const canonical = canonicalOptionName(name.replace(/^no-/, ""));
    const negated = name.startsWith("no-");
    const prefix = arg.startsWith("--") ? "--" : arg.startsWith("-") ? "-" : "";

    if (!prefix || name === canonical || name.length === 1) {
      return arg;
    }

    const normalizedName = negated ? `no-${canonical}` : canonical;
    return `${prefix}${normalizedName}${rest.length ? `=${rest.join("=")}` : ""}`;
  });
};

const requiresValue = (name) => {
  const canonical = canonicalOptionName(name);
  return (
    arrayOptions.has(canonical) ||
    types.string.includes(canonical) ||
    numberOptions.has(canonical)
  );
};

/**
 * Splits for downstream handling.
 * Does not apply Mocha-specific logic.
 * If arg is already string array, returns arg.
 * Respects escaped chars and quoted strings.
 * @param {string|string[]} args Input to be split, e.g. `"--grep -1"`
 * @returns {string[]} One entry per CLI arg-equivalent
 * @sample
 * ```js
 * const x = splitArgs("--timeout -1 --grep 'foo \' bar' --color");
 * x === ["--timeout", "-1", "--grep", "foo ' bar", "--color"]; // true
 * ```
 */
const splitArgs = (args) => {
  debug(`starting splitArgs(${args})`);
  if (!args) {
    debug("splitArgs took in falsy value, returning empty array");
    return [];
  }

  if (Array.isArray(args)) {
    debug("splitArgs took in array, returning argument unchanged");
    return args;
  }

  const result = [];
  let current = "";
  let tokenStarted = false;
  let quote = null;
  let escaped = false;

  for (const char of args) {
    if (escaped) {
      current += char;
      tokenStarted = true;
      escaped = false;
      continue;
    }

    if (char === "\\") {
      tokenStarted = true;
      escaped = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = null;
      } else {
        current += char;
        tokenStarted = true;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      tokenStarted = true;
      quote = char;
      continue;
    }
    // At this point, we are not in quoted mode

    // Using newlines in CLI in this way is difficult.
    // We do not handle it for now to keep tests simple.
    if (/\t| /.test(char)) {
      if (tokenStarted) {
        result.push(current);
        current = "";
        tokenStarted = false;
      }
      continue;
    }

    current += char;
    tokenStarted = true;
  }

  if (escaped) {
    current += "\\";
  }

  // Unterminated is OK, usually passed via MOCHA_OPTIONS
  if (quote) {
    debug("unterminated quoted token, prepending quote");
    current = quote + current;
    debug(`updated token: ${current}`);
  }

  if (tokenStarted) {
    result.push(current);
  }

  debug(`finishing splitArgs(${args})`);
  debug(`returning ${result}`);
  return result;
};

/**
 * Disallows multiple arguments after a single option, such as `--grep abc def`.
 */
const validateArgsBeforeParse = (allArgs) => {
  allArgs.forEach((arg, index) => {
    if (!arg.startsWith("-") || arg === "--" || arg.includes("=")) {
      return;
    }

    const name = canonicalOptionName(stripLeadingDashes(arg));
    const next = allArgs[index + 1];

    if (
      requiresValue(name) &&
      (next === undefined || (next.startsWith("-") && !isNumeric(next)))
    ) {
      throw new Error(`Not enough arguments following: ${name}`);
    }
  });
};

const normalizeParsedValues = (values, positionals) => {
  const normalized = Object.assign({ _: positionals }, values);

  Object.keys(normalized).forEach((rawName) => {
    if (rawName === "_") {
      return;
    }

    const name = canonicalOptionName(rawName);
    if (name !== rawName) {
      normalized[name] = mergeValue(normalized[name], normalized[rawName]);
      delete normalized[rawName];
    }
  });

  arrayOptions.forEach((name) => {
    if (normalized[name] !== undefined) {
      normalized[name] = coerceArrayOption(name, normalized[name]);
    }
  });

  scalarOptions.forEach((name) => {
    if (normalized[name] !== undefined) {
      normalized[name] = coerceScalarOption(name, normalized[name]);
    }
  });

  numberOptions.forEach((name) => {
    if (normalized[name] !== undefined) {
      normalized[name] = coerceNumberOption(normalized[name]);
    }
  });

  return normalized;
};

const createErrorForNumericPositionalArg = (
  numericArg,
  allArgs,
  parsedResult,
) => {
  // A flag for `numericArg` exists if:
  // 1. A Mocha flag immediately preceded the numericArg in `allArgs`, and
  // 2. parseArgs() could not assign the numericArg to that flag because the
  //    option has an incompatible datatype.
  const flag = allArgs.find((arg, index) => {
    const normalizedArg = stripLeadingDashes(arg);
    return (
      isMochaFlag(arg) &&
      allArgs[index + 1] === String(numericArg) &&
      parsedResult[normalizedArg] !== String(numericArg)
    );
  });

  if (flag) {
    throw createInvalidArgumentTypeError(
      `Mocha flag '${flag}' given invalid option: '${numericArg}'`,
      numericArg,
      expectedTypeForFlag(flag),
    );
  }

  throw createUnsupportedError(
    `Option ${numericArg} is unsupported by the mocha cli`,
  );
};

/**
 * Parse the args into a config object.
 * Splits,
 * handles Node args,
 * validates general args,
 * parses into config object,
 * normalizes,
 * validates numerical args,
 * and returns resulting config object.
 * @param {string|string[]} args
 * @param {object} defaultValues
 * @param  {...any} configObjects
 */
export const parseMochaArgs = (
  args = [],
  defaultValues = {},
  ...configObjects
) => {
  const allArgs = splitArgs(args);

  // Save Node-specific args for special handling. Equals-form args have values;
  // the rest are boolean flags.
  const nodeArgs = allArgs.reduce((acc, arg) => {
    const pair = arg.split("=");
    let flag = pair[0];
    if (isNodeFlag(flag, false)) {
      flag = stripLeadingDashes(flag);
      return acc.concat([[flag, arg.includes("=") ? pair[1] : true]]);
    }
    return acc;
  }, []);

  validateArgsBeforeParse(allArgs);
  const parsed = parseArgs({
    args: preprocessArgs(allArgs),
    options: createParseArgsOptions(nodeArgs),
    allowNegative: true,
    allowPositionals: true,
    strict: false,
  });

  const result = normalizeParsedValues(
    Object.assign(
      mergeConfigObjects(defaultValues, configObjects),
      parsed.values,
    ),
    parsed.positionals,
  );

  const numericPositionalArg = result._.find((arg) => isNumeric(arg));
  if (numericPositionalArg) {
    createErrorForNumericPositionalArg(
      Number(numericPositionalArg),
      allArgs,
      result,
    );
  }

  // Reapply equals-form Node/V8 flag values saved above.
  nodeArgs.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};
