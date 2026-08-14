"use strict";

/**
 * Load `--require` modules and collect plugin implementations.
 * @module
 * @private
 */

const fs = require("node:fs");
const path = require("node:path");
const debug = require("debug")("mocha:nodejs:handle-requires");
const { requireOrImport } = require("./esm-utils.cjs");
const { PluginLoader } = require("../plugin-loader.js");

/**
 * `require()` the modules as required by `--require <require>`.
 *
 * Returns plugin implementations such as `rootHooks`, if any.
 * @param {string[]} requires - Modules to require
 * @param {Object} [options]
 * @param {string[]} [options.ignoredPlugins] - Plugin export names to ignore
 * @returns {Promise<object>} Plugin implementations
 * @private
 */
exports.handleRequires = async (
  requires = [],
  { ignoredPlugins = [] } = {},
) => {
  const pluginLoader = PluginLoader.create({ ignore: ignoredPlugins });
  for await (const mod of requires) {
    let modpath = mod;
    // this is relative to cwd
    if (fs.existsSync(mod) || fs.existsSync(`${mod}.js`)) {
      modpath = path.resolve(mod);
      debug("resolved required file %s to %s", mod, modpath);
    }
    const requiredModule = await requireOrImport(modpath);
    if (requiredModule && typeof requiredModule === "object") {
      if (pluginLoader.load(requiredModule)) {
        debug("found one or more plugin implementations in %s", modpath);
      }
    }
    debug('loaded required module "%s"', mod);
  }
  const plugins = await pluginLoader.finalize();
  if (Object.keys(plugins).length) {
    debug("finalized plugin implementations: %O", plugins);
  }
  return plugins;
};
