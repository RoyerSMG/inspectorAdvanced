import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function TopBar({ titulo, acciones }) {
  const { operador, cerrarSesion } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="px-8 py-4 flex items-center gap-4">

        {/* Título de la página */}
        <div className="flex-1">
          <h1 className="text-[1.25rem] font-extrabold text-ink leading-none">{titulo}</h1>
        </div>

        {/* Acciones (botones pasados como prop) */}
        {acciones && (
          <div className="flex items-center gap-2">
            {acciones}
          </div>
        )}

        {/* Separador */}
        <div className="w-px h-8 bg-border" />

        {/* Usuario dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-btn
                       hover:bg-gray-50 border border-transparent hover:border-border
                       transition-all group"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full gradient-main grid place-items-center flex-shrink-0">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3v1h12v-1c0-1-2-3-6-3z"/>
              </svg>
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-[0.8rem] font-bold text-ink leading-none">
                {operador?.nombre ?? 'Operador'}
              </p>
              <p className="text-[0.7rem] text-muted mt-0.5">
                {operador?.codigoOperador ?? '—'}
              </p>
            </div>

            {/* Chevron */}
            <svg
              className={`w-3.5 h-3.5 text-muted transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border
                            rounded-card shadow-[0_8px_24px_rgba(0,0,0,0.12)] z-50 overflow-hidden">

              {/* Info usuario */}
              <div className="px-4 py-3 border-b border-border bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-main grid place-items-center flex-shrink-0">
                    <svg className="w-4.5 h-4.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 12c2.7 0 4-1.8 4-4s-1.3-4-4-4-4 1.8-4 4 1.3 4 4 4zm0 2c-4 0-6 2-6 3v1h12v-1c0-1-2-3-6-3z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-bold text-ink leading-none">
                      {operador?.nombre ?? 'Operador'}
                    </p>
                    <p className="text-[0.72rem] text-muted mt-0.5">
                      Código: <strong>{operador?.codigoOperador ?? '—'}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones del menú */}
              <div className="p-1.5">
                <button
                  onClick={() => { setMenuOpen(false); cerrarSesion() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                             text-[0.82rem] font-semibold text-red-500
                             hover:bg-red-50 hover:text-red-600 transition-all text-left"
                >
                  <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
