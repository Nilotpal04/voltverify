import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchDocs } from '../store/slices/documentsSlice'
import { StatusBadge } from '../components/common/Badge'
import { InlineLoader } from '../components/common/Spinner'
import { fmtDate, canVerify } from '../utils/helpers'

import ExportDocuments from "../components/documents/ExportDocuments";

function StatCard({ label, value, sub, color = 'gray' }) {
  const colors = {
    gray: 'bg-white border-gray-200',
    amber: 'bg-amber-50 border-amber-200',
    emerald: 'bg-emerald-50 border-emerald-200',
    red: 'bg-red-50 border-red-200',
  }
  return (
    <div className={`card border ${colors[color]} p-5`}>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const dispatch = useDispatch()
  const { items, total, loading } = useSelector(s => s.docs)
  const user = useSelector(s => s.auth.user)

  useEffect(() => { dispatch(fetchDocs({ page: 1, page_size: 5 })) }, [dispatch])

  const pending  = items.filter(d => d.status === 'pending').length
  const verified = items.filter(d => d.status === 'verified').length
  const rejected = items.filter(d => d.status === 'rejected').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back, {user?.username}</p>
        </div>
        <div className="flex gap-2">
          {(user?.role === "admin" ||
            user?.role === "super_admin") && (
              <ExportDocuments />
          )}

          <Link
              to="/upload"
              className="btn-primary btn-sm"
          >
              Upload
          </Link>
      </div>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={total} sub="documents" />
        <StatCard label="Pending" value={pending} sub="awaiting review" color="amber" />
        <StatCard label="Verified" value={verified} sub="approved" color="emerald" />
        <StatCard label="Rejected" value={rejected} sub="need re-upload" color="red" />
      </div>

      {/* Recent */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-sm font-semibold text-gray-900">Recent documents</h2>
          <Link to="/documents" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
            View all →
          </Link>
        </div>
        {loading ? <InlineLoader /> : (
          items.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-gray-400">No documents yet.</p>
              <Link to="/upload" className="btn-primary btn-sm mt-4 inline-flex">Upload your first document</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-th">Filename</th>
                    <th className="tbl-th">Status</th>
                    <th className="tbl-th hidden sm:table-cell">Uploaded</th>
                    <th className="tbl-th text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(doc => (
                    <tr key={doc.id} className="tbl-tr">
                      <td className="tbl-td">
                        <span className="font-medium text-gray-900 truncate max-w-[180px] block">{doc.original_filename}</span>
                      </td>
                      <td className="tbl-td"><StatusBadge status={doc.status} /></td>
                      <td className="tbl-td hidden sm:table-cell text-gray-400">{fmtDate(doc.uploaded_at)}</td>
                      <td className="tbl-td text-right">
                        <Link to={`/documents/${doc.id}`} className="btn-ghost btn-sm text-gray-500">View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* Quick actions for admin */}
      {canVerify(user?.role) && (
        <div className="card bg-gray-900 text-white border-gray-800">
          <div className="card-body flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold">Pending reviews</p>
              <p className="text-xs text-gray-400 mt-0.5">Documents awaiting your verification</p>
            </div>
            <Link to="/documents?status=pending" className="btn btn-sm bg-white text-gray-900 hover:bg-gray-100 shrink-0">
              Review now
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
