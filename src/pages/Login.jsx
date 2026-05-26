import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import logoBrinks from '../assets/logo_brk.png'

export default function Login() {
  const navigate = useNavigate()
  const [correo,   setCorreo]   = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  // Si ya hay sesión activa, redirigir
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/inspeccion-sede', { replace: true })
    })
  }, [])

  const iniciarSesion = async () => {
    setError('')
    if (!correo || !password) { setError('Por favor ingresa correo y contraseña.'); return }

    setLoading(true)
    const { error: err } = await supabase.auth.signInWithPassword({ email: correo, password })
    setLoading(false)

    if (err) { setError('Ups! Credenciales incorrectas o cuenta inactiva.'); return }
    navigate('/inspeccion-sede', { replace: true })
  }

  return (
    <div className="min-h-screen gradient-brand flex items-center justify-center p-6">
      <div className="bg-card rounded-[20px] p-8 w-full max-w-md shadow-[0_24px_64px_rgba(0,0,0,0.35)]">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 mb-6 text-center">
          <img src={logoBrinks} alt="Brinks Logo" className=" h-[150px] object-contain" />
          <h1 className="text-[1.4rem] font-extrabold text-ink">Inspector Routes</h1>
          <p className="text-[0.82rem] text-muted">Centro Control Monitoreo</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 text-[0.82rem] font-semibold
                          px-4 py-2.5 rounded-btn mb-4 text-center">
            {error}
          </div>
        )}

        {/* Campos */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
            Correo electrónico
          </label>
          <input
            type="email"
            value={correo}
            onChange={e => setCorreo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && document.getElementById('pwd').focus()}
            placeholder="operador@brinks.com"
            autoComplete="email"
            className="bg-[#f8faff] border-[1.5px] border-border rounded-btn px-4 py-3
                       text-[0.9rem] text-ink outline-none focus:border-accent1
                       focus:ring-[3px] focus:ring-accent1/10 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          <label className="text-[0.72rem] font-bold uppercase tracking-wide text-muted">
            Contraseña
          </label>
          <input
            id="pwd"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && iniciarSesion()}
            placeholder="••••••••"
            autoComplete="current-password"
            className="bg-[#f8faff] border-[1.5px] border-border rounded-btn px-4 py-3
                       text-[0.9rem] text-ink outline-none focus:border-accent1
                       focus:ring-[3px] focus:ring-accent1/10 focus:bg-white transition-all"
          />
        </div>

        <button
          onClick={iniciarSesion}
          disabled={loading}
          className="w-full gradient-main text-white font-extrabold py-3.5 rounded-btn
                     shadow-btn flex items-center justify-center gap-2
                     hover:opacity-90 active:scale-[0.98] disabled:opacity-55 transition-all"
        >
          {loading && <div className="spinner" />}
          Ingresar
        </button>
      </div>
    </div>
  )
}
