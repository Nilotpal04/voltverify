export default function Pagination({ page, pageSize, total, onPage }) {
  const pages = Math.ceil(total / pageSize)
  if (pages <= 1) return null
  const from = (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  const nums = []
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - page) <= 1) nums.push(i)
    else if (nums[nums.length - 1] !== '…') nums.push('…')
  }

  return (
    <div className="flex items-center justify-between pt-4 px-1">
      <p className="text-xs text-gray-400">{from}–{to} of {total}</p>
      <div className="flex items-center gap-1">
        <PBtn onClick={() => onPage(page - 1)} disabled={page === 1}>←</PBtn>
        {nums.map((n, i) => n === '…'
          ? <span key={`e${i}`} className="px-1 text-gray-300 text-xs">…</span>
          : <PBtn key={n} onClick={() => onPage(n)} active={n === page}>{n}</PBtn>
        )}
        <PBtn onClick={() => onPage(page + 1)} disabled={page === pages}>→</PBtn>
      </div>
    </div>
  )
}

function PBtn({ onClick, disabled, active, children }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled}
      className={`min-w-[28px] h-7 px-2 text-xs rounded-md border transition-all disabled:opacity-30 disabled:cursor-not-allowed
        ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
      {children}
    </button>
  )
}
