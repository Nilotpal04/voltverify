import { useState } from 'react'
import Modal from '../common/Modal'

export default function VerifyRejectModal({ open, mode, onClose, onSubmit, loading }) {
  const [remark, setRemark] = useState('')
  const isReject = mode === 'reject'

  const submit = () => {
    if (isReject && !remark.trim()) return
    onSubmit(remark.trim())
  }

  return (
    <Modal open={open} onClose={onClose} title={isReject ? 'Reject Document' : 'Verify Document'} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {isReject
            ? 'Provide a reason for rejection. This will be visible to the user.'
            : 'Add an optional remark before verifying this document.'}
        </p>
        <div>
          <label className="field-label">Remark {isReject && <span className="text-red-400">*</span>}</label>
          <textarea
            rows={3}
            value={remark}
            onChange={e => setRemark(e.target.value)}
            placeholder={isReject ? 'e.g. Consumer number is illegible…' : 'e.g. All fields verified and correct.'}
            className="field-input resize-none"
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
          <button
            onClick={submit}
            disabled={loading || (isReject && !remark.trim())}
            className={isReject ? 'btn-danger btn-sm' : 'btn-success btn-sm'}
          >
            {loading ? 'Please wait…' : isReject ? 'Reject' : 'Verify'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
