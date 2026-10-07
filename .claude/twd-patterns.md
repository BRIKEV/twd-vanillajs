# TWD Project Patterns

## Project Configuration

- **Framework**: Vanilla JS (no bundler, static files served by `sirv`, non-Vite)
- **Base path**: /
- **Dev server port**: 3000
- **App URL**: http://localhost:3000
- **Dev command**: npm run serve:dev
- **Default branch**: main
- **Entry point**: public/src/main.js (manual `initTWD` block, only on `localhost`)
- **Public folder**: public (the whole app is served from it)
- **Closing run**: full suite

`twd-js` is not an npm dependency: `public/index.html` loads it from esm.sh through an
import map (`twd-js`, `twd-js/runner`, `twd-js/bundled`). Tests live in
`public/tests/*.twd.js` and must be registered by hand in the `initTWD({...})` map in
`public/src/main.js` — there is no `import.meta.glob`.

Note: `--changed-since` only picks up files named `*.twd.test.*`, so it does not see
this repo's `*.twd.js` tests; use `--test` to target specific tests.

### Runner Commands

twd-cli drives its own headless browser — only the dev server has to be up (`npm run serve:dev`).

```bash
# Run all tests
npm run test:ci

# Run specific tests by name (matches "suite > test", case-insensitive; repeatable)
npx twd-cli run --test "should render the list"
npx twd-cli run --test "should create" --test "should show the error"

# Record a run to video (one clip per matched test, needs ffmpeg)
npx twd-cli run --record --test "should render the list"
```

Every run writes `.twd/report/`: `run.json` (the result), `summary.md` and `index.html`. The folder is replaced on each run.

## Standard Imports

```javascript
import { twd, userEvent, screenDom, expect } from 'twd-js';
import { describe, it, beforeEach, afterEach } from 'twd-js/runner';
// Project-specific imports go here (added by user)
```

## Visit Paths

```javascript
await twd.visit('/');
await twd.visit('/todos');
```

## Standard beforeEach / afterEach

```javascript
beforeEach(() => {
  twd.clearRequestMockRules();
  twd.clearComponentMocks();
});

afterEach(() => {
  twd.clearRequestMockRules();
});
```

## API Service Types

Service/API client is located in: `public/src/api`

Read files in this folder to understand endpoint URLs and response shapes when writing mock data.
The fetch client points at `http://localhost:3001/api` (json-server, `npm run serve`).

## Portals and Dialogs

Use `screenDomGlobal` instead of `screenDom` for elements rendered in portals (modals, dropdowns, tooltips):

```javascript
import { screenDomGlobal } from 'twd-js';
const modal = screenDomGlobal.getByRole('dialog');
```
