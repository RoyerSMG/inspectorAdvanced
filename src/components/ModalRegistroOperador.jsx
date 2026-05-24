import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function ModalRegistroOperador() {
  const { necesitaRegistro, registrarOperador, cerrarSesion } = useAuth()
  const [nombre,   setNombre]   = useState('')
  const [codigo,   setCodigo]   = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  if (!necesitaRegistro) return null

  const guardar = async () => {
    setError('')
    if (!nombre.trim())  { setError('El nombre es obligatorio.'); return }
    if (!codigo.trim())  { setError('El código operador es obligatorio.'); return }
    if (!/^\d+[A-Za-z]+/.test(codigo.trim())) {
      setError('Formato inválido. Ejemplo: 143Martinez')
      return
    }

    setLoading(true)
    const { error: err } = await registrarOperador(nombre, codigo)
    setLoading(false)

    if (err) {
      setError(err.includes('unique') ? 'Ese código operador ya está en uso.' : err)
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-[20px] p-10 w-full max-w-md
                        shadow-[0_24px_64px_rgba(0,0,0,0.35)]
                        animate-[fadeUp_0.25s_ease]">

          {/* Icono + título */}
          <div className="flex flex-col items-center gap-3 mb-8 text-center">
            <div className="w-14 h-14 rounded-full grid place-items-center
                            bg-gradient-to-br from-accent1 to-accent2
                            shadow-[0_6px_20px_rgba(0,119,182,0.4)]">
              <svg className="w-7 h-7 stroke-white fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </div>
            <h2 className="text-[1.3rem] font-extrabold text-ink">Completa tu perfil</h2>
            <p className="text-[0.82rem] text-muted leading-relaxed">
              Es tu primer acceso. Ingresa tu nombre y código de operador para continuar.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-700 text-[0.82rem]
                            font-semibold px-4 py-2.5 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Campos */}
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
              Nombre completo
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Juan Martínez"
              className="bg-[#f8faff] border-[1.5px] border-gray-200 rounded-lg px-4 py-3
                         text-[0.9rem] text-ink outline-none transition-all
                         focus:border-accent1 focus:ring-[3px] focus:ring-accent1/10 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-7">
            <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
              Código operador
            </label>
            <input
              type="text"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && guardar()}
              placeholder="Ej: 143Martinez"
              className="bg-[#f8faff] border-[1.5px] border-gray-200 rounded-lg px-4 py-3
                         text-[0.9rem] text-ink outline-none transition-all
                         focus:border-accent1 focus:ring-[3px] focus:ring-accent1/10 focus:bg-white"
            />
            <p className="text-[0.72rem] text-muted mt-1">
              Formato: número + apellido. Ej: <strong>143Martinez</strong>
            </p>
          </div>

          <button
            onClick={guardar}
            disabled={loading}
            className="w-full gradient-main text-white font-extrabold py-3.5 rounded-lg
                       shadow-btn flex items-center justify-center gap-2
                       hover:opacity-90 disabled:opacity-55 transition-all"
          >
            {loading && <div className="spinner" />}
            Guardar y continuar
          </button>

          {/* Salir */}
          <button
            onClick={cerrarSesion}
            className="w-full mt-3 text-[0.78rem] text-muted hover:text-red-400
                       transition-colors font-semibold py-2"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </>
  )
}