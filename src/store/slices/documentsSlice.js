import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { documentsApi } from '../../api/documents'

export const fetchDocs = createAsyncThunk('docs/list', async (p, { rejectWithValue }) => {
  try { return (await documentsApi.list(p)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const fetchDoc = createAsyncThunk('docs/get', async (id, { rejectWithValue }) => {
  try { return (await documentsApi.get(id)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const uploadDoc = createAsyncThunk('docs/upload', async (form, { rejectWithValue }) => {
  try { return (await documentsApi.upload(form)).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const updateDoc = createAsyncThunk('docs/update', async ({ id, extracted_data }, { rejectWithValue }) => {
  try { return (await documentsApi.update(id, { extracted_data })).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const verifyDoc = createAsyncThunk('docs/verify', async ({ id, remark }, { rejectWithValue }) => {
  try { return (await documentsApi.verify(id, { remark })).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const rejectDoc = createAsyncThunk('docs/reject', async ({ id, remark }, { rejectWithValue }) => {
  try { return (await documentsApi.reject(id, { remark })).data } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})
export const fetchAudit = createAsyncThunk('docs/audit', async (id, { rejectWithValue }) => {
  try { return { id, logs: (await documentsApi.audit(id)).data } } catch (e) { return rejectWithValue(e.response?.data?.detail) }
})

const patch = (state, doc) => {
  state.current = doc
  const i = state.items.findIndex(d => d.id === doc.id)
  if (i !== -1) state.items[i] = doc
}

const slice = createSlice({
  name: 'docs',
  initialState: { items: [], total: 0, page: 1, pageSize: 20, current: null, audit: {}, loading: false, uploading: false, error: null },
  reducers: {
    clearCurrent: s => { s.current = null },
    clearError: s => { s.error = null },
  },
  extraReducers: b => b
    .addCase(fetchDocs.pending, s => { s.loading = true; s.error = null })
    .addCase(fetchDocs.fulfilled, (s, a) => { s.loading = false; s.items = a.payload.items; s.total = a.payload.total; s.page = a.payload.page; s.pageSize = a.payload.page_size })
    .addCase(fetchDocs.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    .addCase(fetchDoc.pending, s => { s.loading = true })
    .addCase(fetchDoc.fulfilled, (s, a) => { s.loading = false; s.current = a.payload })
    .addCase(fetchDoc.rejected, (s, a) => { s.loading = false; s.error = a.payload })
    .addCase(uploadDoc.pending, s => { s.uploading = true; s.error = null })
    .addCase(uploadDoc.fulfilled, (s, a) => { s.uploading = false; s.items.unshift(a.payload); s.total++ })
    .addCase(uploadDoc.rejected, (s, a) => { s.uploading = false; s.error = a.payload })
    .addCase(updateDoc.fulfilled, (s, a) => patch(s, a.payload))
    .addCase(verifyDoc.fulfilled, (s, a) => patch(s, a.payload))
    .addCase(rejectDoc.fulfilled, (s, a) => patch(s, a.payload))
    .addCase(fetchAudit.fulfilled, (s, a) => { s.audit[a.payload.id] = a.payload.logs }),
})

export const { clearCurrent, clearError } = slice.actions
export default slice.reducer
