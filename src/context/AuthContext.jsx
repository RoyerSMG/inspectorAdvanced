import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session,   setSession]   = useState(undefined) // undefined = loading
  const [operador,  setOperador]  = useState(null)

  const cargarOperador = async (userId, email) => {
    const { data } = await supabase
      .from('operadores')
      .select('nombre')
      .eq('id', userId)
      .single()
    setOperador(data?.nombre ?? email ?? 'Operador')
  }

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      if (s) cargarOperador(s.user.id, s.user.email)
    })

    // Escuchar cambios (login / logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (s) cargarOperador(s.user.id, s.user.email)
      else   setOperador(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, operador, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
