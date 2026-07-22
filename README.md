# twd-vanillajs

A plain **vanilla JavaScript** app tested with [TWD (Test While Developing)](https://github.com/BRIKEV/twd), with **no bundler and no build step**. TWD is loaded straight from a CDN with an import map.

This is the vanilla counterpart to the framework examples (Vue, Solid, Angular, React). It shows that TWD is genuinely framework-agnostic: the same in-browser tests you would write in a framework app work in a plain HTML + JS project served as static files.

## What is in here

- A tiny client-side router with two views: a **counter** (`/`) and a **todo list** (`/todos`).
- A `fetch` API client talking to a local **json-server** backend.
- In-browser **TWD tests** (`public/tests/*.twd.js`) using Testing Library queries and TWD's request mocking.
- The mock **service worker** (`public/mock-sw.js`) committed to the repo.
- **CI** that runs the tests headless with `twd-cli`, plus **contract testing** against an OpenAPI spec.

## How TWD is installed (the interesting part)

No `npm install twd-js`, no bundler. `public/index.html` declares an [import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) pointing at [esm.sh](https://esm.sh):

```html
<script type="importmap">
  {
    "imports": {
      "twd-js": "https://esm.sh/twd-js@1.8.2",
      "twd-js/runner": "https://esm.sh/twd-js@1.8.2/runner",
      "twd-js/bundled": "https://esm.sh/twd-js@1.8.2/bundled"
    }
  }
</script>
```

`public/src/main.js` then boots TWD (only on `localhost`) and lists the test files by hand, since there is no bundler to provide `import.meta.glob`:

```js
const { initTWD } = await import('twd-js/bundled');
initTWD(
  {
    './tests/helloWorld.twd.js': () => import('/tests/helloWorld.twd.js'),
    './tests/todoList.twd.js': () => import('/tests/todoList.twd.js'),
  },
  { open: true, position: 'left', serviceWorker: true, serviceWorkerUrl: '/mock-sw.js' },
);
```

The library loads from the CDN, but `mock-sw.js` is served from this app's own origin, because browsers only register same-origin service workers. It is committed at `public/mock-sw.js`. To refresh it after a TWD upgrade, run `npx twd-js init public` (or download it from the CDN).

## Run it locally

```bash
npm install
npm run serve:dev
```

This starts json-server on port 3001 and the static server on port 3000 in parallel. Open http://localhost:3000 and the TWD sidebar appears on the left. Navigate to Todos, and run the tests from the sidebar.

Scripts:

- `npm run serve:dev` - json-server (3001) + static server (3000) together
- `npm run start` - static server only (used in CI)
- `npm run serve` - json-server only

## Tests

Tests live in `public/tests/` and read like any Testing Library test:

```js
import { twd, userEvent, screenDom } from 'twd-js';
import { describe, it } from 'twd-js/runner';

describe('Hello World Page', () => {
  it('increments the counter', async () => {
    await twd.visit('/');
    const button = await screenDom.getByText('Count is 0');
    await userEvent.click(button);
    twd.should(button, 'have.text', 'Count is 1');
  });
});
```

The todo tests use `twd.mockRequest` to intercept `/api/todos` through the service worker, so they run without json-server.

## CI

`.github/workflows/ci.yml` starts the static server and runs the tests headless with the [`twd-cli` GitHub Action](https://github.com/BRIKEV/twd-cli). Because the tests mock the API, json-server is not needed in CI. Contract testing validates the mocked responses against `contracts/todos-3.0.json`.

## Migrating to a framework

Because the tests are plain Testing Library queries and TWD commands, they are not tied to vanilla JS. If you later move this app to React, Vue, Solid, or Angular, the test files keep working. Only the setup (the import map becomes a `devDependency` and the Vite plugin) changes.
