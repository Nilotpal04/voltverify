import { useRef, useState } from 'react'

const ACCEPT = '.pdf,.png,.jpg,.jpeg,.tiff,.bmp'
const MAX_MB = 20

export default function UploadZone({ onFile, loading }) {
  const ref = useRef()
  const [drag, setDrag] = useState(false)
  const [err, setErr] = useState('')

  const validate = file => {
    if (!file) return false
    const ext = file.name.split('.').pop().toLowerCase()
    if (!['pdf','png','jpg','jpeg','tiff','bmp'].includes(ext)) {
      setErr(`Unsupported type: .${ext}. Allowed: PDF, PNG, JPG, TIFF, BMP.`); return false
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`File too large. Max ${MAX_MB} MB.`); return false
    }
    setErr(''); return true
  }

  const pick = file => { if (validate(file)) onFile(file) }

  return (
    <div>
      <div
        onClick={() => !loading && ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]) }}
        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all select-none
          ${drag ? 'border-gray-500 bg-gray-50' : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50/50'}
          ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        {loading ? (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Processing document…</p>
            <p className="text-xs text-gray-400 mt-1">Extracting fields, please wait</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">Drop file here or <span className="text-gray-900 underline underline-offset-2">browse</span></p>
            <p className="text-xs text-gray-400 mt-1">PDF, PNG, JPG, TIFF, BMP — up to {MAX_MB} MB</p>
          </div>
        )}
      </div>
      {err && <p className="field-error mt-2">{err}</p>}
      <input ref={ref} type="file" accept={ACCEPT} className="hidden" onChange={e => pick(e.target.files[0])} />
    </div>
  )
}
