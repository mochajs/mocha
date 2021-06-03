#!/usr/bin/env node
'use strict';

// Node has a hard time telling what loader to use without an extension
// If you use the node --loader option, use this
// https://github.com/mochajs/mocha/pull/4647/files?file-filters%5B%5D=.json

require('../lib/cli').main();
