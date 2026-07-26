import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../api/auth'

const normalizeApiError = (data, fallback) => {
  const detail = data?.detail

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map(err => {
        if (typeof err === 'string') return err
        if (err?.msg && err?.loc) return `${Array.isArray(err.loc) ? err.loc.join('.') : err.loc}: ${err.msg}`
        if (err?.msg) return err.msg
        return null
      })
      .filter(Boolean)
      .join(', ') || fallback
  }

  if (detail && typeof detail === 'object') {
    return detail.msg || detail.message || fallback
  }

  return fallback
}

export const loginThunk = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data: tokens } = await authApi.login(creds)
    localStorage.setItem('accessToken', tokens.access_token)
    localStorage.setItem('refreshToken', tokens.refresh_token)
    const { data: user } = await authApi.me()
    localStorage.setItem('user', JSON.stringify(user))
    return { tokens, user }
  } catch (e) {
    return rejectWithValue(normalizeApiError(e.response?.data, 'Login failed.'))
  }
})

export const registerThunk = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await authApi.register(payload)
    return data
  } catch (e) {
    return rejectWithValue(normalizeApiError(e.response?.data, 'Registration failed.'))
  }
})

export const fetchMeThunk = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await authApi.me()
    localStorage.setItem('user', JSON.stringify(data))
    return data
  } catch (e) {
    return rejectWithValue(normalizeApiError(e.response?.data, 'Failed to load current user.'))
  }
})

const loadStored = () => {
  try {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
    }
  } catch { return { accessToken: null, refreshToken: null, user: null } }
}

const { accessToken, refreshToken, user } = loadStored()

const slice = createSlice({
  name: 'auth',
  initialState: { user, accessToken, refreshToken, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null; state.accessToken = null; state.refreshToken = null
      localStorage.clear()
    },
    clearError(state) { state.error = null },
  },
  extraReducers: b => b
    .addCase(loginThunk.pending, s => { s.loading = true; s.error = null })
    .addCase(loginThunk.fulfilled, (s, a) => {
      s.loading = false
      s.accessToken = a.payload.tokens.access_token
      s.refreshToken = a.payload.tokens.refresh_token
      s.user = a.payload.user
    })
    .addCase(loginThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    .addCase(registerThunk.pending, s => { s.loading = true; s.error = null })
    .addCase(registerThunk.fulfilled, s => { s.loading = false })
    .addCase(registerThunk.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    .addCase(fetchMeThunk.fulfilled, (s, a) => { s.user = a.payload }),
})

export const { logout, clearError } = slice.actions
export default slice.reducer
