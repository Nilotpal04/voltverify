export const fmtDate = iso => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const fmtBytes = b => {
  if (!b) return '—'
  if (b < 1024) return `${b} B`
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1024 / 1024).toFixed(1)} MB`
}

export const normalizeRole = role => String(role || '').trim().toLowerCase()

export const roleLabel = r => ({ super_admin: 'Super Admin', admin: 'Admin', user: 'User' }[normalizeRole(r)] || r)

export const canVerify = role => ['admin', 'super_admin'].includes(normalizeRole(role))
export const canManageUsers = role => ['admin', 'super_admin'].includes(normalizeRole(role))
export const isSuperAdmin = role => normalizeRole(role) === 'super_admin'
