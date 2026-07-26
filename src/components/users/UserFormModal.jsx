import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import { useSelector } from 'react-redux'

const INITIAL = { username: '', email: '', password: '', role: 'user', admin_id: '' }

export default function UserFormModal({ open, onClose, onSubmit, user, loading }) {
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const me = useSelector(s => s.auth.user)
  const isEdit = !!user

  useEffect(() => {
    if (user) setForm({ username: user.username, email: user.email, password: '', role: user.role, admin_id: user.admin_id || '' })
    else setForm(INITIAL)
    setErrors({})
  }, [user, open])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.username.trim()) e.username = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    if (!isEdit && !form.password) e.password = 'Required'
    if (!isEdit && form.password && form.password.length < 8) e.password = 'Min 8 characters'
    return e
  }

  const submit = () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    const payload = { ...form }
    if (!payload.password) delete payload.password
    if (!payload.admin_id) delete payload.admin_id
    onSubmit(payload)
  }

  const canChangeRole = me?.role === 'super_admin'

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit User' : 'Create User'} size="sm">
      <div className="space-y-4">
        <Field label="Username" error={errors.username}>
          <input value={form.username} onChange={e => set('username', e.target.value)} className={`field-input ${errors.username ? 'field-input-error' : ''}`} placeholder="john_doe" />
        </Field>
        <Field label="Email" error={errors.email}>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} className={`field-input ${errors.email ? 'field-input-error' : ''}`} placeholder="john@example.com" />
        </Field>
        <Field label={isEdit ? 'New password (leave blank to keep)' : 'Password'} error={errors.password}>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} className={`field-input ${errors.password ? 'field-input-error' : ''}`} placeholder="Min 8 characters" />
        </Field>
        {canChangeRole && (
          <Field label="Role">
            <select value={form.role} onChange={e => set('role', e.target.value)} className="field-input">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </Field>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-primary btn-sm">
            {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
