export function renderHello(app) {
  const section = document.createElement('section');

  const title = document.createElement('h1');
  title.textContent = 'Welcome to TWD';

  let count = 0;
  const button = document.createElement('button');
  button.textContent = `Count is ${count}`;
  button.addEventListener('click', () => {
    count += 1;
    button.textContent = `Count is ${count}`;
  });

  section.append(title, button);
  app.appendChild(section);
}
