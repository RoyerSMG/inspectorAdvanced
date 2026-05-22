import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { operador, cerrarSesion } = useAuth()

  return (
    <header className="bg-ink border-b-4 border-accent1 sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">

        {/* Logo */}
        <div className="w-9 h-9 bg-accent1 rounded-full grid place-items-center flex-shrink-0">
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>

        <h1 className="text-white font-extrabold text-lg">Inspector Routes</h1>

        <nav className="ml-auto flex items-center gap-3">
          <Link to="/seguimiento"
            className="text-white/70 border border-white/15 bg-white/5 hover:bg-white/15 hover:text-white
                       text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-btn transition-all">
            Seguimiento
          </Link>
          <Link to="/dashboard"
            className="text-white/70 border border-white/15 bg-white/5 hover:bg-white/15 hover:text-white
                       text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-btn transition-all">
            Dashboard
          </Link>

          {/* Chip usuario */}
          <div className="bg-white/8 border border-white/15 rounded-pill px-3 py-1.5 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 stroke-white/60 fill-none stroke-2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            <span className="text-white/80 text-xs">{operador}</span>
          </div>

          <button
            onClick={cerrarSesion}
            className="bg-red-500/15 border border-red-500/30 text-red-300 hover:bg-red-500/35 hover:text-white
                       text-xs font-bold px-3.5 py-2 rounded-btn transition-all">
            Salir
          </button>
        </nav>
      </div>
    </header>
  )
}
