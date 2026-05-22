import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import PasswordStrength, { passwordValida } from '../components/ui/PasswordStrength'

const ESTADOS = { LOADING: 'loading', FORM: 'form', OK: 'ok', ERROR: 'error' }

export default function ResetPassword() {
  const navigate = useNavigate()
  const [estado,    setEstado]    = useState(ESTADOS.LOADING)
  const [nueva,     setNueva]     = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  useEffect(() => {
    // Leer token del hash de la URL
    const hash   = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken  = params.get('access_token')
    const refreshToken = params.get('refresh_token') || ''
    const type         = params.get('type')

    if (!accessToken || !['invite', 'recovery'].includes(type)) {
      setEstado(ESTADOS.ERROR)
      return
    }

    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: err }) => setEstado(err ? ESTADOS.ERROR : ESTADOS.FORM))
  }, [])

  const guardarPassword = async () => {
    setError('')
    if (!passwordValida(nueva)) { setError('La contraseña no cumple todos los requisitos.'); return }
    if (nueva !== confirmar)    { setError('Las contraseñas no coinciden.'); return }

    setLoading(true)
    const { error: errAuth } = await supabase.auth.updateUser({ password: nueva })

    if (errAuth) {
      setLoading(false)
      setError('Error: ' + errAuth.message)
      return
    }

    // Marcar must_change_password = false
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user?.id) {
      await supabase.from('operadores').update({ must_change_password: false }).eq('id', session.user.id)
    }

    await supabase.auth.signOut()
    setLoading(false)
    setEstado(ESTADOS.OK)
  }

  const iconLock = (
    <svg className="w-7 h-7 stroke-white fill-none stroke-2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )

  return (
    <div className="min-h-screen gradient-brand flex items-center justify-center p-6">
      <div className="bg-card rounded-[20px] p-11 w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.35)]">

        {/* CARGANDO */}
        {estado === ESTADOS.LOADING && (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-14 h-14 gradient-amber rounded-full grid place-items-center shadow-[0_6px_20px_rgba(245,158,11,0.4)]">
              {iconLock}
            </div>
            <h1 className="text-[1.3rem] font-extrabold text-ink">Verificando enlace...</h1>
            <p className="text-[0.82rem] text-muted">Por favor espera un momento.</p>
          </div>
        )}

        {/* FORMULARIO */}
        {estado === ESTADOS.FORM && (
          <>
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="w-14 h-14 gradient-amber rounded-full grid place-items-center shadow-[0_6px_20px_rgba(245,158,11,0.4)]">
                {iconLock}
              </div>
              <h1 className="text-[1.3rem] font-extrabold text-ink">Crea tu contraseña</h1>
              <p className="text-[0.82rem] text-muted leading-relaxed">
                Bienvenido a Inspector Routes.<br/>Establece una contraseña segura para tu cuenta.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-[0.82rem] font-semibold
                              px-4 py-2.5 rounded-btn mb-4">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
                Nueva contraseña
              </label>
              <input
                type="password"
                value={nueva}
                onChange={e => setNueva(e.target.value)}
                autoComplete="new-password"
                className="bg-[#f8faff] border-[1.5px] border-border rounded-btn px-4 py-3
                           text-[0.9rem] text-ink outline-none focus:border-accent1
                           focus:ring-[3px] focus:ring-accent1/10 focus:bg-white transition-all"
              />
              <PasswordStrength value={nueva} />
            </div>

            <div className="flex flex-col gap-1.5 mb-6 mt-4">
              <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && guardarPassword()}
                autoComplete="new-password"
                className="bg-[#f8faff] border-[1.5px] border-border rounded-btn px-4 py-3
                           text-[0.9rem] text-ink outline-none focus:border-accent1
                           focus:ring-[3px] focus:ring-accent1/10 focus:bg-white transition-all"
              />
            </div>

            <button
              onClick={guardarPassword}
              disabled={loading}
              className="w-full gradient-green text-white font-extrabold py-3.5 rounded-btn
                         shadow-[0_4px_14px_rgba(45,158,95,0.4)] flex items-center justify-center gap-2
                         hover:opacity-90 disabled:opacity-55 transition-all"
            >
              {loading && <div className="spinner" />}
              Guardar contraseña
            </button>
          </>
        )}

        {/* ÉXITO */}
        {estado === ESTADOS.OK && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 gradient-green rounded-full grid place-items-center shadow-[0_6px_20px_rgba(45,158,95,0.4)]">
              <svg className="w-7 h-7 stroke-white fill-none stroke-2" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 className="text-[1.3rem] font-extrabold text-ink">¡Contraseña establecida!</h1>
            <p className="text-[0.82rem] text-muted leading-relaxed">
              Tu cuenta está lista. Ahora puedes ingresar a la plataforma.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full gradient-main text-white font-extrabold py-3.5 rounded-btn
                         shadow-btn hover:opacity-90 transition-all mt-2"
            >
              Ir al login
            </button>
          </div>
        )}

        {/* ERROR */}
        {estado === ESTADOS.ERROR && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 gradient-red rounded-full grid place-items-center shadow-[0_6px_20px_rgba(239,68,68,0.4)]">
              <svg className="w-7 h-7 stroke-white fill-none stroke-2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 className="text-[1.3rem] font-extrabold text-ink">Enlace inválido</h1>
            <p className="text-[0.82rem] text-muted leading-relaxed">
              Este enlace ha expirado o ya fue utilizado.<br/>
              Contacta a tu administrador para recibir uno nuevo.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full gradient-main text-white font-extrabold py-3.5 rounded-btn
                         shadow-btn hover:opacity-90 transition-all mt-2"
            >
              Volver al login
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
