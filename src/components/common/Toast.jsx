import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { pop } from '../../store/slices/toastSlice'

const CFG = {
  success: { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: '✓' },
  error:   { bg: 'bg-red-50 border-red-200 text-red-800', icon: '✕' },
  warn:    { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: '!' },
  info:    { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: 'i' },
}

function ToastItem({ t }) {
  const dispatch = useDispatch()
  useEffect(() => {
    const tm = setTimeout(() => dispatch(pop(t.id)), 4500)
    return () => clearTimeout(tm)
  }, [t.id, dispatch])
  const c = CFG[t.type] || CFG.info
  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-md text-sm animate-pulse-once ${c.bg}`}
      style={{ animation: 'slideUp 0.2s ease-out' }}>
      <span className="font-bold shrink-0 w-4 text-center">{c.icon}</span>
      <span className="flex-1 leading-relaxed">{t.msg}</span>
      <button onClick={() => dispatch(pop(t.id))} className="shrink-0 opacity-50 hover:opacity-100 ml-1">✕</button>
    </div>
  )
}

export default function Toasts() {
  const items = useSelector(s => s.toast.items)
  if (!items.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2.5rem)]">
      {items.map(t => <ToastItem key={t.id} t={t} />)}
    </div>
  )
}
