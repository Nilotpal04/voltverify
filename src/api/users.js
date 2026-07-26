import api from './axios'
export const usersApi = {
  list: params => api.get('/users', { params }),
  get: id => api.get(`/users/${id}`),
  create: d => api.post('/users', d),
  update: (id, d) => api.put(`/users/${id}`, d),
  remove: id => api.delete(`/users/${id}`),
}
