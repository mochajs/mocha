const toArray = (value) => (Array.isArray(value) ? value : [value]);

const unparseOption = (name, value) => {
  if (value === false) {
    return [`--no-${name}`];
  }

  if (value === true) {
    return [`--${name}`];
  }

  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => unparseOption(name, item));
  }

  if (typeof value === "object") {
    return Object.entries(value).flatMap(([key, item]) =>
      unparseOption(`${name}.${key}`, item),
    );
  }

  if (name.includes(".")) {
    return [`--${name}=${String(value)}`];
  }
  return [`--${name}`, String(value)];
};

const unparseMochaArgs = (opts) => {
  const positionals = opts._ == null ? [] : toArray(opts._).map(String);
  const options = Object.entries(opts).flatMap(([name, value]) =>
    name === "_" ? [] : unparseOption(name, value),
  );

  return positionals.concat(options);
};

const unparseNodeFlags = (opts) => {
  return Object.entries(opts).flatMap(([name, value]) => {
    if (value === true) {
      return [`--${name}`];
    }

    if (value === false || value == null) {
      return [];
    }

    return toArray(value).map((item) => `--${name}=${item}`);
  });
};

export { unparseMochaArgs, unparseNodeFlags };
