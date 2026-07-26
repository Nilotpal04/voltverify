import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUsers, createUser, updateUser, deleteUser } from '../store/slices/usersSlice'
import { useToast } from '../hooks/useToast'
import { RoleBadge } from '../components/common/Badge'
import { InlineLoader } from '../components/common/Spinner'
import Pagination from '../components/common/Pagination'
import EmptyState from '../components/common/EmptyState'
import ConfirmDialog from '../components/common/ConfirmDialog'
import UserFormModal from '../components/users/UserFormModal'
import { fmtDate, isSuperAdmin } from '../utils/helpers'

export default function UsersPage() {
  const dispatch = useDispatch()
  const toast = useToast()
  const { items, total, loading, pageSize } = useSelector(s => s.users)
  const me = useSelector(s => s.auth.user)
  const [page, setPage] = useState(1)
  const [formModal, setFormModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { dispatch(fetchUsers({ page, page_size: pageSize })) }, [dispatch, page, pageSize])

  const openCreate = () => { setEditTarget(null); setFormModal(true) }
  const openEdit = u => { setEditTarget(u); setFormModal(true) }

  const handleSubmit = async payload => {
    setActionLoading(true)
    let res
    if (editTarget) res = await dispatch(updateUser({ id: editTarget.id, ...payload }))
    else res = await dispatch(createUser(payload))
    setActionLoading(false)
    if (res.error) toast.error(res.payload || 'Action failed.')
    else { toast.success(editTarget ? 'User updated.' : 'User created.'); setFormModal(false) }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    const res = await dispatch(deleteUser(deleteTarget.id))
    setActionLoading(false)
    if (res.error) toast.error(res.payload || 'Delete failed.')
    else { toast.success('User deleted.'); setDeleteTarget(null) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-400 mt-0.5">{total} total</p>
        </div>
        <button onClick={openCreate} className="btn-primary btn-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add user
        </button>
      </div>

      <div className="card">
        {loading ? <InlineLoader /> : items.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Create a user to get started."
            action={<button onClick={openCreate} className="btn-primary btn-sm">Add user</button>}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="tbl-th">User</th>
                    <th className="tbl-th">Role</th>
                    <th className="tbl-th hidden sm:table-cell">Status</th>
                    <th className="tbl-th hidden lg:table-cell">Created</th>
                    <th className="tbl-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(u => (
                    <tr key={u.id} className="tbl-tr">
                      <td className="tbl-td">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase shrink-0">
                            {u.username[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate">{u.username}</p>
                            <p className="text-xs text-gray-400 truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="tbl-td"><RoleBadge role={u.role} /></td>
                      <td className="tbl-td hidden sm:table-cell">
                        <span className={`text-xs font-medium ${u.is_active ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="tbl-td hidden lg:table-cell text-gray-400 text-xs">{fmtDate(u.created_at)}</td>
                      <td className="tbl-td text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(u)} className="btn-ghost btn-sm text-gray-500">Edit</button>
                          {isSuperAdmin(me?.role) && u.id !== me?.id && (
                            <button onClick={() => setDeleteTarget(u)} className="btn-ghost btn-sm text-red-400 hover:text-red-600">Delete</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 pb-4">
              <Pagination page={page} pageSize={pageSize} total={total} onPage={setPage} />
            </div>
          </>
        )}
      </div>

      <UserFormModal open={formModal} onClose={() => setFormModal(false)} onSubmit={handleSubmit} user={editTarget} loading={actionLoading} />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete user"
        message={`Permanently delete "${deleteTarget?.username}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={actionLoading}
      />
    </div>
  )
}
