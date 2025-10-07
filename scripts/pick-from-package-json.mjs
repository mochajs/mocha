/**
 * This rollup plugin lets you pick specific fields you want to export
 * for the specific case of importing a modules `package.json`.
 *
 * This helps reduce the file size of the resulting bundle.
 *
 * @param {object} options
 * @param {string[]} options.keys List of keys to export from package.json
 */
export default function pickFromPackageJson({keys}) {
  return {
    name: 'pick-from-package-json',
    load: async id => {
      if (id.endsWith('mocha/package.json')) {
        const manifest = await import(id, {with: {type: 'json'}});

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
