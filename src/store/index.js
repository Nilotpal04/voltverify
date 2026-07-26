import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import docsReducer from './slices/documentsSlice'
import usersReducer from './slices/usersSlice'
import toastReducer from './slices/toastSlice'

export const store = configureStore({
  reducer: { auth: authReducer, docs: docsReducer, users: usersReducer, toast: toastReducer },
})
