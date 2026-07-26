import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { uploadDoc } from '../store/slices/documentsSlice'
import { useToast } from '../hooks/useToast'
import UploadZone from '../components/documents/UploadZone'
import ExtractedDataEditor from '../components/documents/ExtractedDataEditor'

export default function UploadPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const toast = useToast()
  const uploading = useSelector(s => s.docs.uploading)
  const [result, setResult] = useState(null)
  const [file, setFile] = useState(null)

  const handleFile = async selectedFile => {
    setFile(selectedFile)
    const form = new FormData()
    form.append('file', selectedFile)
    const res = await dispatch(uploadDoc(form))
    if (res.error) {
      toast.error(res.payload || 'Upload failed.')
      setFile(null)
    } else {
      setResult(res.payload)
      toast.success('Document uploaded and processed.')
    }
  }

  const reset = () => { setResult(null); setFile(null) }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Upload document</h1>
        <p className="text-sm text-gray-400 mt-0.5">Upload a form and we'll extract the fields automatically.</p>
      </div>

      {!result ? (
        <div className="card card-body">
          <UploadZone onFile={handleFile} loading={uploading} />
          {uploading && file && (
            <div className="mt-4 flex items-center gap-3 text-sm text-gray-500 bg-gray-50 px-4 py-3 rounded-lg">
              <svg className="w-4 h-4 animate-spin text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              <span>Uploading <strong>{file.name}</strong> and extracting fields…</span>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Success banner */}
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>{result.original_filename}</strong> uploaded. Fields extracted — review them below.</span>
          </div>

          {/* Extracted data */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-sm font-semibold text-gray-900">Extracted fields</h2>
              <span className="text-xs text-gray-400">Read-only preview</span>
            </div>
            <div className="card-body">
              <ExtractedDataEditor data={result.extracted_data} readOnly />
            </div>
          </div>

          {/* Info */}
          <div className="card card-body">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              <div>
                <dt className="field-label">File</dt>
                <dd className="text-gray-700 font-medium truncate">{result.original_filename}</dd>
              </div>
              <div>
                <dt className="field-label">Status</dt>
                <dd><span className="badge-pending">Pending review</span></dd>
              </div>
              <div>
                <dt className="field-label">Document ID</dt>
                <dd className="font-mono text-gray-500">#{result.id}</dd>
              </div>
            </dl>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="btn-secondary">Upload another</button>
            <button onClick={() => navigate(`/documents/${result.id}`)} className="btn-primary">
              View & edit document →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
