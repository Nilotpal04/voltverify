export default function Spinner({ size = 5, className = '' }) {
  return (
    <svg className={`animate-spin w-${size} h-${size} text-gray-400 ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
    </svg>
  )
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Spinner size={8} className="text-gray-500" />
        <p className="text-sm text-gray-400">Loading…</p>
      </div>
    </div>
  )
}

export function InlineLoader({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
      <Spinner size={5} />
      <span className="text-sm">{label}</span>
    </div>
  )
}
