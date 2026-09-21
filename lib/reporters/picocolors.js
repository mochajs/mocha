/**
 * Vendored from picocolors v1.1.1.
 *
 * ISC License
 *
 * Copyright (c) 2021-2024 Oleksii Raspopov, Kostiantyn Denysov, Anton Verinov
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

const processRef = globalThis.process || {};
const argv = processRef.argv || [];
const env = processRef.env || {};

export const isColorSupported =
  !(!!env.NO_COLOR || argv.includes("--no-color")) &&
  (!!env.FORCE_COLOR ||
    argv.includes("--color") ||
    processRef.platform === "win32" ||
    ((processRef.stdout || {}).isTTY && env.TERM !== "dumb") ||
    !!env.CI);

const formatter = (open, close, replace = open) => (input) => {
  const string = String(input);
  const index = string.indexOf(close, open.length);

  return ~index
    ? open + replaceClose(string, close, replace, index) + close
    : open + string + close;
};

const replaceClose = (string, close, replace, index) => {
  let result = "";
  let cursor = 0;

  do {
    result += string.substring(cursor, index) + replace;
    cursor = index + close.length;
    index = string.indexOf(close, cursor);
  } while (~index);

  return result + string.substring(cursor);
};

export const createColors = (enabled = isColorSupported) => {
  const f = enabled ? formatter : () => String;

  return {
    isColorSupported: enabled,
    reset: f("\u001b[0m", "\u001b[0m"),
    bold: f("\u001b[1m", "\u001b[22m", "\u001b[22m\u001b[1m"),
    dim: f("\u001b[2m", "\u001b[22m", "\u001b[22m\u001b[2m"),
    italic: f("\u001b[3m", "\u001b[23m"),
    underline: f("\u001b[4m", "\u001b[24m"),
    inverse: f("\u001b[7m", "\u001b[27m"),
    hidden: f("\u001b[8m", "\u001b[28m"),
    strikethrough: f("\u001b[9m", "\u001b[29m"),

    black: f("\u001b[30m", "\u001b[39m"),
    red: f("\u001b[31m", "\u001b[39m"),
    green: f("\u001b[32m", "\u001b[39m"),
    yellow: f("\u001b[33m", "\u001b[39m"),
    blue: f("\u001b[34m", "\u001b[39m"),
    magenta: f("\u001b[35m", "\u001b[39m"),
    cyan: f("\u001b[36m", "\u001b[39m"),
    white: f("\u001b[37m", "\u001b[39m"),
    gray: f("\u001b[90m", "\u001b[39m"),

    bgBlack: f("\u001b[40m", "\u001b[49m"),
    bgRed: f("\u001b[41m", "\u001b[49m"),
    bgGreen: f("\u001b[42m", "\u001b[49m"),
    bgYellow: f("\u001b[43m", "\u001b[49m"),
    bgBlue: f("\u001b[44m", "\u001b[49m"),
    bgMagenta: f("\u001b[45m", "\u001b[49m"),
    bgCyan: f("\u001b[46m", "\u001b[49m"),
    bgWhite: f("\u001b[47m", "\u001b[49m"),

    blackBright: f("\u001b[90m", "\u001b[39m"),
    redBright: f("\u001b[91m", "\u001b[39m"),
    greenBright: f("\u001b[92m", "\u001b[39m"),
    yellowBright: f("\u001b[93m", "\u001b[39m"),
    blueBright: f("\u001b[94m", "\u001b[39m"),
    magentaBright: f("\u001b[95m", "\u001b[39m"),
    cyanBright: f("\u001b[96m", "\u001b[39m"),
    whiteBright: f("\u001b[97m", "\u001b[39m"),

    bgBlackBright: f("\u001b[100m", "\u001b[49m"),
    bgRedBright: f("\u001b[101m", "\u001b[49m"),
    bgGreenBright: f("\u001b[102m", "\u001b[49m"),
    bgYellowBright: f("\u001b[103m", "\u001b[49m"),
    bgBlueBright: f("\u001b[104m", "\u001b[49m"),
    bgMagentaBright: f("\u001b[105m", "\u001b[49m"),
    bgCyanBright: f("\u001b[106m", "\u001b[49m"),
    bgWhiteBright: f("\u001b[107m", "\u001b[49m"),
  };
};

const colors = createColors();

export default colors;
