// api.js — Central API helper for Vineyards frontend
const BASE_URL = 'https://villa-community-backend.onrender.com/api';

const api = {
  _getToken() {
    return localStorage.getItem('access_token');
  },

  _headers(isJson = true) {
    const h = {};
    if (isJson) h['Content-Type'] = 'application/json';
    const token = this._getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
  },

  async _handle(response) {
    if (response.status === 401) {
      localStorage.clear();
      window.location.href = 'index.html';
      throw new Error('Session expired. Please login again.');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
    }
    return data;
  },

  async get(path) {
    const res = await fetch(BASE_URL + path, { headers: this._headers() });
    return this._handle(res);
  },

  async post(path, body) {
    const res = await fetch(BASE_URL + path, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify(body),
    });
    return this._handle(res);
  },

  async put(path, body = {}) {
    const res = await fetch(BASE_URL + path, {
      method: 'PUT',
      headers: this._headers(),
      body: JSON.stringify(body),
    });
    return this._handle(res);
  },

  async delete(path) {
    const res = await fetch(BASE_URL + path, {
      method: 'DELETE',
      headers: this._headers(),
    });
    return this._handle(res);
  },
};

// Toast notification helper
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || ''}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Get current user from localStorage
function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || {};
  } catch { return {}; }
}

// Logout
function logout() {
  api.delete('/auth/logout').catch(() => {});
  localStorage.clear();
  window.location.href = 'index.html';
}

// Auth guard — call at top of every protected page
function requireAuth() {
  if (!localStorage.getItem('access_token')) {
    window.location.href = 'index.html';
    return false;
  }
  return true;
}

// Format date nicely
function fmtDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Status badge HTML
function badge(status) {
  const map = {
    confirmed: 'success', active: 'success', resolved: 'success',
    pending: 'warning', open: 'warning', assigned: 'info',
    cancelled: 'danger', revoked: 'danger', expired: 'grey',
    in_progress: 'info', used: 'grey', closed: 'grey',
  };
  const cls = map[status] || 'grey';
  return `<span class="badge badge-${cls}">${status.replace('_', ' ')}</span>`;
}
