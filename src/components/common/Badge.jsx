export function StatusBadge({ status }) {
  const map = { pending: 'badge-pending', verified: 'badge-verified', rejected: 'badge-rejected' }
  const labels = { pending: 'Pending', verified: 'Verified', rejected: 'Rejected' }
  return <span className={map[status] || 'badge bg-gray-100 text-gray-600'}>{labels[status] || status}</span>
}

export function RoleBadge({ role }) {
  const map = { super_admin: 'badge-super_admin', admin: 'badge-admin', user: 'badge-user' }
  const labels = { super_admin: 'Super Admin', admin: 'Admin', user: 'User' }
  return <span className={map[role] || 'badge bg-gray-100 text-gray-600'}>{labels[role] || role}</span>
}
