/**
 * @param {object} options
 * @param {string[]} options.keys List of keys to extract values from
 */
export default function rollupPackageJsonStrip({keys}) {
  return {
    name: 'rollup-package-json-strip',
    load: id => {
      if (id.endsWith('mocha/package.json')) {
        const manifest = require(id);

        const result = {};

        for (const key of keys) {
          result[key] = manifest[key];
        }

        return {code: JSON.stringify(result)};
      }
      return null;
    }
  };
}
