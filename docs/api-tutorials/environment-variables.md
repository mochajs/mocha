Sometimes you might want your test to make use of variables set on an environment level. Common reasons for this include:

- Flagging a run as CI
- Setting the domain of an application
- Pointing to a test database
- Setting a key which you want to remain secure

The best way to do this is to use NodeJS's native environment variables.

## Example

In your `package.json` or directly in a terminal set your variable name and value.

```bash
env CI=STAGE mocha
```

Then in your test or code reference it via `process.env.CI`. e.g.

```javascript
if (process.env.CI === "STAGE") // do something
```

The value is available from anywhere in a spec file allowing you to set values from it before the tests run. e.g.

```javascript
import { equal } from "assert";
import { loadPage } from "your-code";
const URL = `${process.env.APP_HOST}/${process.env.APP_URI}`;
describe('Test the page loads', () {
  it('goes to URL', () => {
    const page = loadPage(URL);
    equal(page.url, URL);
  });
});
```
