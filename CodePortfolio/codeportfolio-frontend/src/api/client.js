const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5102';

function getToken() {
  return localStorage.getItem('cp_token');
}

// En lugar de hard-reload, dispara un evento que App.jsx escucha
function forceLogout() {
  localStorage.clear();
  window.dispatchEvent(new CustomEvent('cp:session-expired'));
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // En rutas de auth el 401 significa credenciales incorrectas — no redirigir
  const isAuthRoute = path.startsWith('/api/auth');

  if (res.status === 401 && !isAuthRoute) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getToken()}`;
      const retry = await fetch(`${BASE}${path}`, { ...options, headers });
      if (!retry.ok) throw new Error(await retry.text());
      return retry.json().catch(() => null);
    } else {
      forceLogout();
      throw new Error('Sesión expirada');
    }
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return res.json().catch(() => null);
}

async function tryRefresh() {
  const refreshToken = localStorage.getItem('cp_refresh');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('cp_token',   data.token);
    localStorage.setItem('cp_refresh', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login:    (dto)          => request('/api/auth/login',    { method: 'POST', body: JSON.stringify(dto) }),
  register: (dto)          => request('/api/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
  logout:   (refreshToken) => request('/api/auth/logout',   { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

// ─── User ─────────────────────────────────────────────────────────────────────
export const users = {
  me:             ()         => request('/api/user/me'),
  getById:        (id)       => request(`/api/user/${id}`),
  search:         (q)        => request(`/api/user/search?q=${encodeURIComponent(q)}`),
  update:         (dto)      => request('/api/user/me',          { method: 'PUT', body: JSON.stringify(dto) }),
  changePassword: (dto)      => request('/api/user/me/password', { method: 'PUT', body: JSON.stringify(dto) }),
  getMyLikes:          ()    => request('/api/user/me/likes'),
  deleteAccount:       (dto) => request('/api/user/me', { method: 'DELETE', body: JSON.stringify(dto) }),

  // PUT /api/user/me/avatar — multipart, guarda el archivo en wwwroot/images/avatars/
  uploadAvatar: async (file) => {
    const token = getToken();
    const form  = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/api/user/me/avatar`, {
      method:  'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json(); // { profilePicture: '/images/avatars/...' }
  },
};

// ─── Feed ─────────────────────────────────────────────────────────────────────
export const feed = {
  public:    (page = 1, size = 10) => request(`/api/feed?page=${page}&size=${size}`),
  following: (page = 1, size = 10) => request(`/api/feed/following?page=${page}&size=${size}`),
};

// ─── Projects ─────────────────────────────────────────────────────────────────
export const projects = {
  getPublic:  ()          => request('/api/project/public'),
  getMine:    ()          => request('/api/project/mine'),
  getById:    (id)        => request(`/api/project/${id}`),
  getByUser:  (userId)    => request(`/api/project/user/${userId}`),
  search:     (q)         => request(`/api/project/search?q=${encodeURIComponent(q)}`),
  create:     (dto)       => request('/api/project',        { method: 'POST',   body: JSON.stringify(dto) }),
  update:     (id, dto)   => request(`/api/project/${id}`,  { method: 'PUT',    body: JSON.stringify(dto) }),
  delete:     (id)        => request(`/api/project/${id}`,  { method: 'DELETE' }),
  like:       (id)        => request(`/api/project/${id}/like`, { method: 'POST' }),
  unlike:     (id)        => request(`/api/project/${id}/like`, { method: 'DELETE' }),
  getLikes:   (id)        => request(`/api/project/${id}/likes`),

  uploadImage: async (id, file) => {
    const token = getToken();
    const form  = new FormData();
    form.append('file', file);
    const res = await fetch(`${BASE}/api/project/${id}/image`, {
      method:  'PUT',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body:    form,
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
};

// ─── Comments ─────────────────────────────────────────────────────────────────
export const comments = {
  getByProject: (projectId)      => request(`/api/comment/project/${projectId}`),
  create:       (projectId, dto) => request(`/api/comment/project/${projectId}`, { method: 'POST', body: JSON.stringify(dto) }),
  delete:       (id)             => request(`/api/comment/${id}`, { method: 'DELETE' }),
};

// ─── Profile ──────────────────────────────────────────────────────────────────
export const profile = {
  get:         (userId) => request(`/api/profile/${userId}`),
  getProjects: (userId) => request(`/api/profile/${userId}/projects`),
};

// ─── Follow ───────────────────────────────────────────────────────────────────
export const follows = {
  follow:       (targetId) => request(`/api/follow/${targetId}`,           { method: 'POST' }),
  unfollow:     (targetId) => request(`/api/follow/${targetId}`,           { method: 'DELETE' }),
  getFollowers: (userId)   => request(`/api/follow/${userId}/followers`),
  getFollowing: (userId)   => request(`/api/follow/${userId}/following`),
};

// ─── Vacancies ────────────────────────────────────────────────────────────────
export const vacancies = {
  getAll:          ()           => request('/api/vacancy'),
  getById:         (id)         => request(`/api/vacancy/${id}`),
  search:          (q)          => request(`/api/vacancy/search?q=${encodeURIComponent(q)}`),
  apply:           (id, dto)    => request(`/api/vacancy/${id}/apply`,                    { method: 'POST', body: JSON.stringify(dto) }),
  getApplications:    (id)  => request(`/api/vacancy/${id}/applications`),
  getMyApplications:  ()    => request('/api/vacancy/my-applications'),
  changeStatus:    (appId, dto) => request(`/api/vacancy/application/${appId}/status`,    { method: 'PUT',  body: JSON.stringify(dto) }),
};

// ─── Search ───────────────────────────────────────────────────────────────────
export const search = {
  all: (q) => request(`/api/search?q=${encodeURIComponent(q)}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────
export const notifications = {
  getAll:   ()   => request('/api/notification'),
  markRead: (id) => request(`/api/notification/${id}/read`, { method: 'PUT' }),
};

// ─── Companies ────────────────────────────────────────────────────────────────
export const companies = {
  getAll:  ()        => request('/api/company/GetCompanies'),
  getById: (id)      => request(`/api/company/GetCompany/${id}`),
  create:  (dto)     => request('/api/company/CreateCompany',       { method: 'POST',   body: JSON.stringify(dto) }),
  update:  (id, dto) => request(`/api/company/UpdateCompany/${id}`, { method: 'PUT',    body: JSON.stringify(dto) }),
  delete:  (id)      => request(`/api/company/DeleteCompany/${id}`, { method: 'DELETE' }),
};

// ─── Job Openings (admin CRUD) ────────────────────────────────────────────────
export const jobOpenings = {
  getAll:  ()        => request('/api/jobopening/GetJobOpenings'),
  getById: (id)      => request(`/api/jobopening/GetJobOpening/${id}`),
  create:  (dto)     => request('/api/jobopening/CreateJobOpening',         { method: 'POST',   body: JSON.stringify(dto) }),
  update:  (id, dto) => request(`/api/jobopening/UpdateJobOpening/${id}`,   { method: 'PUT',    body: JSON.stringify(dto) }),
  delete:  (id)      => request(`/api/jobopening/DeleteJobOpening/${id}`,   { method: 'DELETE' }),
};

// ─── Collaborators ────────────────────────────────────────────────────────────
export const collaborators = {
  getAll:  ()        => request('/api/collaborator/GetCollaborators'),
  getById: (id)      => request(`/api/collaborator/GetCollaborator/${id}`),
  create:  (dto)     => request('/api/collaborator/CreateCollaborator',       { method: 'POST',   body: JSON.stringify(dto) }),
  update:  (id, dto) => request(`/api/collaborator/UpdateCollaborator/${id}`, { method: 'PUT',    body: JSON.stringify(dto) }),
  delete:  (id)      => request(`/api/collaborator/DeleteCollaborator/${id}`, { method: 'DELETE' }),
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messages = {
  getAll:  ()        => request('/api/message/GetMessages'),
  getById: (id)      => request(`/api/message/GetMessage/${id}`),
  create:  (dto)     => request('/api/message/CreateMessage',       { method: 'POST',   body: JSON.stringify(dto) }),
  update:  (id, dto) => request(`/api/message/UpdateMessage/${id}`, { method: 'PUT',    body: JSON.stringify(dto) }),
  delete:  (id)      => request(`/api/message/DeleteMessage/${id}`, { method: 'DELETE' }),
};
