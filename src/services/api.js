const API_BASE = '/api';

function getUserId() {
  const saved = localStorage.getItem('user');
  if (saved) {
    const user = JSON.parse(saved);
    return user.id;
  }
  return null;
}

function getAuthHeaders() {
  const userId = getUserId();
  const headers = { 'Content-Type': 'application/json' };
  if (userId) {
    headers['X-User-Id'] = userId;
  }
  return headers;
}

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred');
  }
  return data;
}

export const api = {
  books: {
    getAll: () => fetch(`${API_BASE}/books`).then(handleResponse),
    getAvailable: () => fetch(`${API_BASE}/books/available`).then(handleResponse),
    search: (term) => fetch(`${API_BASE}/books/search?term=${encodeURIComponent(term)}`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/books/${id}`).then(handleResponse),
    create: (book) => fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(book)
    }).then(handleResponse),
    update: (id, book) => fetch(`${API_BASE}/books/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(book)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/books/${id}`, { 
      method: 'DELETE',
      headers: getAuthHeaders()
    }).then(handleResponse),
    getCopies: (id) => fetch(`${API_BASE}/books/${id}/copies`).then(handleResponse),
    getAllCopies: () => fetch(`${API_BASE}/books/copies/all`).then(handleResponse),
    addCopy: (id, copy) => fetch(`${API_BASE}/books/${id}/copies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(copy)
    }).then(handleResponse),
  },

  users: {
    getAll: () => fetch(`${API_BASE}/users`).then(handleResponse),
    getWithFines: () => fetch(`${API_BASE}/users/with-fines`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/users/${id}`).then(handleResponse),
    getHistory: (id) => fetch(`${API_BASE}/users/${id}/history`).then(handleResponse),
    create: (user) => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(handleResponse),
    update: (id, user) => fetch(`${API_BASE}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  loans: {
    getAll: () => fetch(`${API_BASE}/loans`).then(handleResponse),
    getActive: () => fetch(`${API_BASE}/loans/active`).then(handleResponse),
    getOverdue: () => fetch(`${API_BASE}/loans/overdue`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/loans/${id}`).then(handleResponse),
    create: (loan) => fetch(`${API_BASE}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loan)
    }).then(handleResponse),
    return: (id) => fetch(`${API_BASE}/loans/${id}/return`, { method: 'POST' }).then(handleResponse),
    renew: (id, diasAdicionales) => fetch(`${API_BASE}/loans/${id}/renew`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dias_adicionales: diasAdicionales })
    }).then(handleResponse),
  },

  reservations: {
    getAll: () => fetch(`${API_BASE}/reservations`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/reservations/${id}`).then(handleResponse),
    create: (reservation) => fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservation)
    }).then(handleResponse),
    complete: (id) => fetch(`${API_BASE}/reservations/${id}/complete`, { method: 'PUT' }).then(handleResponse),
    cancel: (id) => fetch(`${API_BASE}/reservations/${id}/cancel`, { method: 'PUT' }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/reservations/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  fines: {
    getAll: () => fetch(`${API_BASE}/fines`).then(handleResponse),
    getUnpaid: () => fetch(`${API_BASE}/fines/unpaid`).then(handleResponse),
    calculate: (idPrestamo) => fetch(`${API_BASE}/fines/calculate/${idPrestamo}`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/fines/${id}`).then(handleResponse),
    pay: (id) => fetch(`${API_BASE}/fines/${id}/pay`, { method: 'PUT' }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/fines/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  categories: {
    getAll: () => fetch(`${API_BASE}/categories`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/categories/${id}`).then(handleResponse),
    getBooks: (id) => fetch(`${API_BASE}/categories/${id}/books`).then(handleResponse),
    create: (category) => fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    }).then(handleResponse),
    update: (id, category) => fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  authors: {
    getAll: () => fetch(`${API_BASE}/authors`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/authors/${id}`).then(handleResponse),
    getBooks: (id) => fetch(`${API_BASE}/authors/${id}/books`).then(handleResponse),
    create: (author) => fetch(`${API_BASE}/authors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author)
    }).then(handleResponse),
    update: (id, author) => fetch(`${API_BASE}/authors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(author)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/authors/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  publishers: {
    getAll: () => fetch(`${API_BASE}/publishers`).then(handleResponse),
    getById: (id) => fetch(`${API_BASE}/publishers/${id}`).then(handleResponse),
    getBooks: (id) => fetch(`${API_BASE}/publishers/${id}/books`).then(handleResponse),
    create: (publisher) => fetch(`${API_BASE}/publishers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publisher)
    }).then(handleResponse),
    update: (id, publisher) => fetch(`${API_BASE}/publishers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(publisher)
    }).then(handleResponse),
    delete: (id) => fetch(`${API_BASE}/publishers/${id}`, { method: 'DELETE' }).then(handleResponse),
  },

  stats: {
    getDashboard: () => fetch(`${API_BASE}/stats/dashboard`).then(handleResponse),
    getLoans: () => fetch(`${API_BASE}/stats/loans`).then(handleResponse),
    getBooksByCategory: () => fetch(`${API_BASE}/stats/books-by-category`).then(handleResponse),
    getUsersByType: () => fetch(`${API_BASE}/stats/users-by-type`).then(handleResponse),
    getRecentLoans: () => fetch(`${API_BASE}/stats/recent-loans`).then(handleResponse),
  },

  auth: {
    login: (email, password) => fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }).then(handleResponse),
    register: (userData) => fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(handleResponse),
  }
};

export default api;
