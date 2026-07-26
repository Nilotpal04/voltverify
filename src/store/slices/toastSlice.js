import { createSlice } from '@reduxjs/toolkit'
let id = 0
const slice = createSlice({
  name: 'toast',
  initialState: { items: [] },
  reducers: {
    push: (s, a) => { s.items.push({ id: ++id, type: a.payload.type || 'info', msg: a.payload.msg }) },
    pop: (s, a) => { s.items = s.items.filter(t => t.id !== a.payload) },
  },
})
export const { push, pop } = slice.actions
export const toast = {
  success: msg => push({ type: 'success', msg }),
  error: msg => push({ type: 'error', msg }),
  info: msg => push({ type: 'info', msg }),
  warn: msg => push({ type: 'warn', msg }),
}
export default slice.reducer
