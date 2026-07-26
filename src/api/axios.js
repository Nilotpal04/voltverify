import axios from 'axios'

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const api = axios.create({ baseURL: BASE, headers: { 'Content-Type': 'application/json' } })

// Inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
let refreshing = false
let queue = []

const flush = (err, token) => { queue.forEach(p => err ? p.reject(err) : p.resolve(token)); queue = [] }

api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config
    if (err.response?.status === 401 && !orig._retry) {
      const refresh = localStorage.getItem('refreshToken')
      if (!refresh) { window.location.href = '/login'; return Promise.reject(err) }

      if (refreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(token => { orig.headers.Authorization = `Bearer ${token}`; return api(orig) })
      }

      orig._retry = true
      refreshing = true
      try {
        const { data } = await axios.post(`${BASE}/auth/refresh`, { refresh_token: refresh })
        localStorage.setItem('accessToken', data.access_token)
        localStorage.setItem('refreshToken', data.refresh_token)
        flush(null, data.access_token)
        orig.headers.Authorization = `Bearer ${data.access_token}`
        return api(orig)
      } catch (e) {
        flush(e, null)
        localStorage.clear()
        window.location.href = '/login'
        return Promise.reject(e)
      } finally { refreshing = false }
    }
    return Promise.reject(err)
  }
)

export default api
