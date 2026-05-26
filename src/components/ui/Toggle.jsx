export default function Toggle({ checked, onChange, labelOn = 'Sin Novedad', labelOff = 'Con Novedad' }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`toggle-track ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onKeyDown={e => e.key === ' ' && onChange(!checked)}
      >
        <div className="toggle-thumb" />
      </div>
      <span className={`text-xs font-bold min-w-[80px] text-right ${checked ? 'text-green-400' : 'text-muted'}`}>
        {checked ? labelOn : labelOff}
      </span>
    </div>
  )
}
