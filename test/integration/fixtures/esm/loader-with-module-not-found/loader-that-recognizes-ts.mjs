/**
 * @param {string} specifier
 * @param {{
 *   conditions: !Array<string>,
 *   parentURL: !(string | undefined),
 * }} context
 * @param {Function} defaultResolve
 * @returns {Promise<{ url: string }>}
 */
export async function resolve(specifier, context, defaultResolve) {
<<<<<<< HEAD
  try {
    const url = new URL(specifier, context.parentURL);
    // Only process file: URLs
    if (url.protocol === 'file:') {
      const extension = path.extname(fileURLToPath(url));
      if (extension === '.ts') {
        return await defaultResolve(specifier.replace('.ts', '.mjs'), context, defaultResolve);
      }
    }
  } catch (err) {
    // URL construction can fail for invalid specifiers, but the default resolver
    // will handle them appropriately, so we just pass through
  }
  return await defaultResolve(specifier, context, defaultResolve);
=======
  return await defaultResolve(
    specifier.replace('.ts', '.mjs'),
    context,
    defaultResolve,
  );
>>>>>>> 95c9d75120078e4c1fbb87d23f4fd7ec1f8a5405
}
