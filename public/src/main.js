import { startRouter } from './router.js';

// Plain vanilla app: a tiny history router with two views (Home + Todos).
startRouter();

// TWD dev tooling. Loaded from the CDN (see the import map in index.html), only
// on localhost so it never ships to production. No build step required.
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  const { initTWD } = await import('twd-js/bundled');

  // No bundler means no import.meta.glob, so the test-module map is built by
  // hand: a label pointing at a lazy dynamic import of each test file.
  initTWD(
    {
      './tests/helloWorld.twd.js': () => import('/tests/helloWorld.twd.js'),
      './tests/todoList.twd.js': () => import('/tests/todoList.twd.js'),
    },
    {
      open: true,
      position: 'left',
      search: true,
      serviceWorker: true,
      serviceWorkerUrl: '/mock-sw.js',
    },
  );
}
