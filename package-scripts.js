'use strict';


module.exports = {
  scripts: {
    docs: {
      default: {
        script:
          'nps docs.clean && nps docs.api && eleventy',
        description: 'Build documentation'
      },
      production: {
        script: 'nps docs && nps docs.postbuild',
        description: 'Build docs for production'
      },
      clean: {
        script: 'rimraf docs/_dist docs/_site docs/api',
        description: 'Prepare system for doc building',
        hiddenFromHelp: true
      },
      postbuild: {
        script:
          'node node_modules/assetgraph-builder/bin/buildProduction docs/_site/index.html --outroot docs/_dist --canonicalroot https://mochajs.org/ --optimizeimages --svgo --inlinehtmlimage 9400 --inlinehtmlscript 0 --asyncscripts && cp docs/_headers docs/_dist/_headers',
        description: 'Post-process docs after build',
        hiddenFromHelp: true
      },
      watch: {
        script: 'eleventy --serve',
        description: 'Watch docs for changes & build'
      },
      api: {
        script: 'jsdoc -c jsdoc.conf.json',
        description: 'Build API docs'
      }
    }
  }
};
