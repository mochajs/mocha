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
  types,
} from "./run-option-metadata.cjs";
import { isNodeFlag } from "./node-flags.cjs";

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
const numberOptions = new Set(types.number);
const scalarOptions = new Set(types.boolean.concat(types.string, types.number));

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

const coerceArrayOption = (name, value) => {
  const values = toArray(value);
  return Array.from(
    new Set(globOptions.includes(name) ? values : list(values)),
  );
};

const coerceScalarOption = (value) => {
  return Array.isArray(value) ? value[value.length - 1] : value;
};

const coerceNumberOption = (value) => {
  const scalar = coerceScalarOption(value);
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

const isKnownOptionName = (name) => {
  const normalizedName = name.replace(/^no-/, "");
  return (
    optionTypeByName[normalizedName] ||
    aliasToCanonical[normalizedName] ||
    isNodeFlag(`--${normalizedName}`, false)
  );
};

const preprocessArgs = (allArgs) => {
  return allArgs.reduce((processed, arg, index) => {
    if (arg === "--") {
      return processed;
    }

    const noPrefix = arg.replace(/^--?/, "");
    const [name, ...rest] = noPrefix.split("=");
    const canonical = canonicalOptionName(name.replace(/^no-/, ""));
    const negated = name.startsWith("no-");
    const prefix = arg.startsWith("--") ? "--" : arg.startsWith("-") ? "-" : "";

    if (
      prefix === "-" &&
      name.length === 1 &&
      !rest.length &&
      !isKnownOptionName(name)
    ) {
      const next = allArgs[index + 1];
      if (next !== undefined && next !== "--" && !next.startsWith("-")) {
        processed.push(`--${name}=${next}`);
      } else {
        processed.push(`--${name}`);
      }
      return processed;
    }

    if (prefix === "--" && !rest.length && !isKnownOptionName(name)) {
      const next = allArgs[index + 1];
      if (next !== undefined && next !== "--" && !next.startsWith("-")) {
        processed.push(`${arg}=${next}`);
        return processed;
      }
    }

    if (!prefix || name === canonical || name.length === 1) {
      const previous = allArgs[index - 1];
      if (
        !prefix &&
        previous &&
        previous.startsWith("-") &&
        !previous.includes("=") &&
        !isKnownOptionName(previous.replace(/^--?/, ""))
      ) {
        return processed;
      }
      processed.push(arg);
      return processed;
    }

    const normalizedName = negated ? `no-${canonical}` : canonical;
    processed.push(
      `${prefix}${normalizedName}${rest.length ? `=${rest.join("=")}` : ""}`,
    );
    return processed;
  }, []);
};

const requiresValue = (name) => {
  const canonical = canonicalOptionName(name);
  return (
    arrayOptions.has(canonical) ||
    types.string.includes(canonical) ||
    numberOptions.has(canonical)
  );
};

const validateArgsBeforeParse = (allArgs) => {
  allArgs.forEach((arg, index) => {
    if (!arg.startsWith("-") || arg === "--" || arg.includes("=")) {
      return;
    }

    const name = canonicalOptionName(arg.replace(/^--?/, ""));
    const next = allArgs[index + 1];

    if (requiresValue(name) && (next === undefined || next.startsWith("-"))) {
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
      normalized[name] = coerceScalarOption(normalized[name]);
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
  const flag = allArgs.find((arg, index) => {
    const normalizedArg = arg.replace(/^--?/, "");
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

export const parseMochaArgs = (
  args = [],
  defaultValues = {},
  ...configObjects
) => {
  const allArgs = Array.isArray(args) ? args : args ? args.split(" ") : [];
  const nodeArgs = allArgs.reduce((acc, arg) => {
    const pair = arg.split("=");
    let flag = pair[0];
    if (isNodeFlag(flag, false)) {
      flag = flag.replace(/^--?/, "");
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

  nodeArgs.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};
