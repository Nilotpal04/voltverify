import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-gray-200 mb-4">404</p>
        <h1 className="text-lg font-semibold text-gray-700 mb-2">Page not found</h1>
        <p className="text-sm text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary btn-sm">Go to Dashboard</Link>
      </div>
    </div>
  )
}
