// Plain fetch client. The app talks to json-server directly on port 3001.
// In tests, TWD's service worker intercepts these requests and returns mocks.
const BASE_URL = 'http://localhost:3001/api';

export async function fetchTodos() {
  const response = await fetch(`${BASE_URL}/todos`);
  return response.json();
}

export async function createTodo(todo) {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });
  return response.json();
}

export async function deleteTodo(id) {
  await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
}
