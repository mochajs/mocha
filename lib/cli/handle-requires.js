'use strict';
const fs = require('fs');
const path = require('path');
const debug = require('debug')('mocha:cli:handle:requires');
const {requireOrImport} = require('../nodejs/esm-utils');
const PluginLoader = require('../plugin-loader');

/**
 * `require()` the modules as required by `--require <require>`.
 *
 * Returns array of `mochaHooks` exports, if any.
 * @param {string[]} requires - Modules to require
 * @returns {Promise<object>} Plugin implementations
 * @private
 */
exports.handleRequires = async (requires = [], {ignoredPlugins = []} = {}) => {
  const pluginLoader = PluginLoader.create({ignore: ignoredPlugins});
  for await (const mod of requires) {
    let modpath = mod;
    // this is relative to cwd
    if (fs.existsSync(mod) || fs.existsSync(`${mod}.js`)) {
      modpath = path.resolve(mod);
      debug('resolved required file %s to %s', mod, modpath);
    }
    const requiredModule = await requireOrImport(modpath);
    if (requiredModule && typeof requiredModule === 'object') {
      if (pluginLoader.load(requiredModule)) {
        debug('found one or more plugin implementations in %s', modpath);
      }
    }
    debug('loaded required module "%s"', mod);
  }
  const plugins = await pluginLoader.finalize();
  if (Object.keys(plugins).length) {
    debug('finalized plugin implementations: %O', plugins);
  }
  return plugins;
};
