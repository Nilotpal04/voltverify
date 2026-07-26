import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usersApi } from '../../api/users'

export const fetchUsers = createAsyncThunk('users/list', async (p, { rejectWithValue }) => {
  try { return (await usersApi.list(p)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const createUser = createAsyncThunk('users/create', async (d, { rejectWithValue }) => {
  try { return (await usersApi.create(d)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const updateUser = createAsyncThunk('users/update', async ({ id, ...d }, { rejectWithValue }) => {
  try { return (await usersApi.update(id, d)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try { await usersApi.remove(id); return id } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})

const slice = createSlice({
  name: 'users',
  initialState: { items: [], total: 0, page: 1, pageSize: 20, loading: false, error: null },
  reducers: { clearError: s => { s.error = null } },
  extraReducers: b => b
    .addCase(fetchUsers.pending, s => { s.loading = true; s.error = null })
    .addCase(fetchUsers.fulfilled, (s, a) => {
      s.loading = false
      s.items = a.payload.items
      s.total = a.payload.total
      s.page = a.payload.page
      s.pageSize = a.payload.page_size
    })
    .addCase(fetchUsers.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    .addCase(createUser.fulfilled, (s, a) => { s.items.unshift(a.payload); s.total++ })
    .addCase(updateUser.fulfilled, (s, a) => { const i = s.items.findIndex(u => u.id === a.payload.id); if (i !== -1) s.items[i] = a.payload })
    .addCase(deleteUser.fulfilled, (s, a) => { s.items = s.items.filter(u => u.id !== a.payload); s.total-- })
    .addMatcher(a => ['users/create/rejected','users/update/rejected','users/delete/rejected'].includes(a.type), (s, a) => { s.error = a.payload }),
})

export const { clearError } = slice.actions
export default slice.reducer
