import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginThunk, clearError } from '../store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, accessToken } = useSelector(s => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [fieldErr, setFieldErr] = useState({})

  useEffect(() => { if (accessToken) navigate('/dashboard', { replace: true }) }, [accessToken, navigate])
  useEffect(() => () => dispatch(clearError()), [dispatch])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setFieldErr(p => ({ ...p, [k]: '' })) }

  const submit = async e => {
    e.preventDefault()
    const errs = {}
    if (!form.email) errs.email = 'Required'
    if (!form.password) errs.password = 'Required'
    if (Object.keys(errs).length) { setFieldErr(errs); return }
    const res = await dispatch(loginThunk(form))
    if (!res.error) navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-900 rounded-xl mb-4">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900">DocDigitalize</h1>
          <p className="text-sm text-gray-400 mt-1">Sign in to your account</p>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded-lg">
                  {error}
                </div>
              )}
              <div>
                <label className="field-label">Email or username</label>
                <input type="text" value={form.email} onChange={e => set('email', e.target.value)}
                  className={`field-input ${fieldErr.email ? 'field-input-error' : ''}`}
                  placeholder="you@example.com or superadmin" autoFocus />
                {fieldErr.email && <p className="field-error">{fieldErr.email}</p>}
              </div>
              <div>
                <label className="field-label">Password</label>
                <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
                  className={`field-input ${fieldErr.password ? 'field-input-error' : ''}`}
                  placeholder="••••••••" />
                {fieldErr.password && <p className="field-error">{fieldErr.password}</p>}
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          No account?{' '}
          <Link to="/register" className="text-gray-700 font-medium hover:underline underline-offset-2">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
