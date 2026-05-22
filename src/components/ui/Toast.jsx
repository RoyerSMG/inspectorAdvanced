export default function Toast({ toast }) {
  if (!toast) return null

  const base = 'fixed bottom-8 right-8 text-sm font-bold px-5 py-3.5 rounded-xl z-50 shadow-lg transition-all'
  const style = toast.tipo === 'ok'
    ? 'bg-emerald-100 border border-emerald-300 text-emerald-800'
    : 'bg-red-100 border border-red-300 text-red-800'

  return <div className={`${base} ${style}`}>{toast.msg}</div>
}
