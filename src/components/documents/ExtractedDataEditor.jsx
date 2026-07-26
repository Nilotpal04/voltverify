import { useState } from 'react'

const PRIVATE = ['_extraction_engine', '_source_extension']

export default function ExtractedDataEditor({ data, onSave, saving, readOnly = false }) {
  const [fields, setFields] = useState(() =>
    Object.entries(data || {})
      .filter(([k]) => !PRIVATE.includes(k))
      .map(([k, v]) => ({ key: k, value: v ?? '' }))
  )

  const set = (i, field, val) => setFields(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f))
  const add = () => setFields(prev => [...prev, { key: '', value: '' }])
  const remove = i => setFields(prev => prev.filter((_, idx) => idx !== i))

  const handleSave = () => {
    const obj = {}
    fields.forEach(({ key, value }) => { if (key.trim()) obj[key.trim()] = value })
    onSave(obj)
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No extracted fields available.</p>
      )}
      {fields.map((f, i) => (
        <div key={i} className="grid gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm shadow-gray-100 md:grid-cols-[minmax(180px,0.85fr)_minmax(0,1.35fr)_auto]">
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Field</p>
            <input
              value={f.key}
              onChange={e => set(i, 'key', e.target.value)}
              disabled={readOnly}
              placeholder="Field name"
              className={`field-input font-mono text-xs ${readOnly ? 'bg-gray-50 text-gray-500' : ''}`}
            />
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">Value</p>
            <input
              value={f.value ?? ''}
              onChange={e => set(i, 'value', e.target.value)}
              disabled={readOnly}
              placeholder="Value"
              className={`field-input ${readOnly ? 'bg-gray-50' : ''} ${f.value === null || f.value === '' ? 'text-amber-600' : ''}`}
            />
          </div>
          {!readOnly && (
            <div className="flex items-end justify-end md:justify-center">
              <button
                onClick={() => remove(i)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-gray-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                aria-label={`Remove field ${f.key || i + 1}`}
              >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              </button>
            </div>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 pt-4">
          <button onClick={add} className="btn-secondary btn-sm gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add field
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary btn-sm">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      )}
    </div>
  )
}
