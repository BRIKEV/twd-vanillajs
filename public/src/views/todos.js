import { fetchTodos, createTodo, deleteTodo } from '../api/todos.js';

export async function renderTodos(app) {
  const section = document.createElement('section');
  section.innerHTML = `
    <h1>Todos</h1>
    <form id="todo-form" novalidate>
      <div class="field">
        <label for="title">Title</label>
        <input id="title" name="title" type="text" />
      </div>
      <div class="field">
        <label for="description">Description</label>
        <input id="description" name="description" type="text" />
      </div>
      <div class="field">
        <label for="date">Date</label>
        <input id="date" name="date" type="text" />
      </div>
      <button type="submit">Create Todo</button>
    </form>
    <ul id="todo-list"></ul>
  `;
  app.appendChild(section);

  const form = section.querySelector('#todo-form');
  const list = section.querySelector('#todo-list');

  async function refresh() {
    const todos = await fetchTodos();
    list.innerHTML = '';

    if (!todos.length) {
      const empty = document.createElement('li');
      empty.textContent = 'No todos yet. Create one above!';
      list.appendChild(empty);
      return;
    }

    for (const todo of todos) {
      const item = document.createElement('li');

      const title = document.createElement('h3');
      title.textContent = todo.title;

      const description = document.createElement('p');
      description.textContent = todo.description;

      const date = document.createElement('span');
      date.textContent = `Date: ${todo.date}`;

      const remove = document.createElement('button');
      remove.textContent = 'Delete';
      remove.addEventListener('click', async () => {
        await deleteTodo(todo.id);
        await refresh();
      });

      item.append(title, description, date, remove);
      list.appendChild(item);
    }
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    await createTodo({
      title: data.get('title'),
      description: data.get('description'),
      date: data.get('date'),
    });
    form.reset();
    await refresh();
  });

  await refresh();
}
