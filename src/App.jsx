import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Toasts from './components/common/Toast'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import DocumentsPage from './pages/DocumentsPage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import UploadPage from './pages/UploadPage'
import UsersPage from './pages/UsersPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  const { accessToken } = useSelector(s => s.auth)

  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected — all roles */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/upload" element={<UploadPage />} />

            {/* Admin + Super Admin only */}
            <Route element={<ProtectedRoute roles={['admin', 'super_admin']} />}>
              <Route path="/users" element={<UsersPage />} />
            </Route>
          </Route>
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to={accessToken ? '/dashboard' : '/login'} replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Global toasts (also shown on auth pages) */}
      <Toasts />
    </>
  )
}
