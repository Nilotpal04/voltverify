export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {icon && <div className="mb-4 text-gray-300">{icon}</div>}
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 mb-5 max-w-xs leading-relaxed">{description}</p>}
      {action}
    </div>
  )
}
