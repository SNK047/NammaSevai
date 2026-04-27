import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const workerAPI = {
  getAll: (params) => api.get('/workers', { params }),
  getById: (id) => api.get(`/workers/${id}`),
  getMyProfile: () => api.get('/workers/my-profile'),
  updateProfile: (data) => api.put('/workers/my-profile', data),
  updateAvailability: (availability) => api.put('/workers/availability', { availability }),
};

export const serviceAPI = {
  createRequest: (data) => api.post('/services/request', data),
  getMyRequests: () => api.get('/services/my-requests'),
  getWorkerRequests: () => api.get('/services/worker-requests'),
  updateStatus: (id, data) => api.put(`/services/${id}/status`, data),
};

export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getAll: (params) => api.get('/complaints', { params }),
  getMine: () => api.get('/complaints/my-complaints'),
  getById: (id) => api.get(`/complaints/${id}`),
  upvote: (id) => api.put(`/complaints/${id}/upvote`),
};

export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getForWorker: (workerId) => api.get(`/reviews/worker/${workerId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getWorkers: (params) => api.get('/admin/workers', { params }),
  approveWorker: (id, approve) => api.put(`/admin/workers/${id}/approve`, { approve }),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  updateComplaintStatus: (id, data) => api.put(`/admin/complaints/${id}/status`, data),
};

export default api;
