

import { deprecate } from "../../../lib/errors.js";

it('consolidates identical calls to deprecate', function () {
  deprecate("suite foo did a deprecated thing");
  deprecate("suite foo did a deprecated thing");
  deprecate("suite bar did a deprecated thing");
});
