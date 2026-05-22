const REQUISITOS = [
  { id: 'len',     label: 'Mínimo 8 caracteres',          test: v => v.length >= 8 },
  { id: 'upper',   label: 'Una letra mayúscula',           test: v => /[A-Z]/.test(v) },
  { id: 'num',     label: 'Un número',                    test: v => /[0-9]/.test(v) },
  { id: 'special', label: 'Un carácter especial (!@#$…)', test: v => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v) },
]

const COLORES = ['#ef4444', '#f97316', '#eab308', '#22c55e']
const ANCHOS  = ['25%', '50%', '75%', '100%']

export function evaluarPassword(val) {
  return REQUISITOS.filter(r => r.test(val)).length
}

export function passwordValida(val) {
  return REQUISITOS.every(r => r.test(val))
}

export default function PasswordStrength({ value }) {
  const ok = evaluarPassword(value)

  return (
    <div>
      {/* Barra */}
      <div className="h-1 rounded bg-border mt-1.5 overflow-hidden">
        <div
          className="strength-bar h-full rounded"
          style={{
            width:      ok > 0 ? ANCHOS[ok - 1]  : '0%',
            background: ok > 0 ? COLORES[ok - 1] : 'transparent',
          }}
        />
      </div>

      {/* Requisitos */}
      <ul className="mt-2 flex flex-col gap-1">
        {REQUISITOS.map(r => (
          <li
            key={r.id}
            className={`text-[0.75rem] flex items-center gap-1.5 transition-colors
              ${r.test(value) ? 'text-accent3' : 'text-muted'}`}
          >
            <span className="text-[10px]">{r.test(value) ? '●' : '○'}</span>
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
