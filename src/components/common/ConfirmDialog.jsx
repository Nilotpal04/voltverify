import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>
      <div className="flex gap-3 justify-end">
        <button onClick={onClose} className="btn-secondary btn-sm">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className={danger ? 'btn-danger btn-sm' : 'btn-primary btn-sm'}>
          {loading ? 'Please wait…' : confirmLabel}
        </button>
      </div>
    </Modal>
  )
}
