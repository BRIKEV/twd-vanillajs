import { renderHello } from './views/hello.js';
import { renderTodos } from './views/todos.js';

const routes = {
  '/': renderHello,
  '/todos': renderTodos,
};

function navBar() {
  const nav = document.createElement('nav');
  nav.className = 'nav';
  const links = [
    ['/', 'Home'],
    ['/todos', 'Todos'],
  ];
  for (const [path, label] of links) {
    const a = document.createElement('a');
    a.href = path;
    a.textContent = label;
    a.addEventListener('click', (event) => {
      event.preventDefault();
      history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    nav.appendChild(a);
  }
  return nav;
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(navBar());
  const view = routes[location.pathname] || renderHello;
  view(app);
}

export function startRouter() {
  // twd.visit() drives navigation with history.pushState + a popstate event,
  // so the router only needs to listen for popstate.
  window.addEventListener('popstate', render);
  render();
}
