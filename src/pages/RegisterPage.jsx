import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerThunk, clearError } from '../store/slices/authSlice'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector(s => s.auth)
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [errs, setErrs] = useState({})
  const [done, setDone] = useState(false)

  useEffect(() => () => dispatch(clearError()), [dispatch])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrs(p => ({ ...p, [k]: '' })) }

  const validate = () => {
    const e = {}
    if (!form.username.trim() || form.username.length < 3) e.username = 'Min 3 characters'
    if (!form.email.trim()) e.email = 'Required'
    if (!form.password || form.password.length < 8) e.password = 'Min 8 characters'
    return e
  }

  const submit = async e => {
    e.preventDefault()
    const ve = validate()
    if (Object.keys(ve).length) { setErrs(ve); return }
    const res = await dispatch(registerThunk(form))
    if (!res.error) setDone(true)
  }

  if (done) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm text-center">
        <div className="card card-body">
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Account created</h2>
          <p className="text-sm text-gray-400 mb-5">You can now sign in.</p>
          <Link to="/login" className="btn-primary w-full">Go to sign in</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Create account</h1>
          <p className="text-sm text-gray-400 mt-1">Join DocDigitalize</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={submit} className="space-y-4">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">{error}</div>}
              {[
                { key: 'username', label: 'Username', type: 'text', placeholder: 'john_doe' },
                { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
                { key: 'password', label: 'Password', type: 'password', placeholder: 'Min 8 characters' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label className="field-label">{label}</label>
                  <input type={type} value={form[key]} onChange={e => set(key, e.target.value)}
                    className={`field-input ${errs[key] ? 'field-input-error' : ''}`} placeholder={placeholder} />
                  {errs[key] && <p className="field-error">{errs[key]}</p>}
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-gray-700 font-medium hover:underline underline-offset-2">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
