import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {

  const [session, setSession] = useState(undefined)
  const [operador, setOperador] = useState(null)

  const cargarOperador = async (userId, email) => {

    try {

      const { data, error } = await supabase
        .from('operadores')
        .select('nombre')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        console.log(error)
      }

      setOperador(data?.nombre ?? email ?? 'Operador')

    } catch (err) {

      console.log(err)

      setOperador(email ?? 'Operador')
    }
  }

  useEffect(() => {

    supabase.auth.getSession()
      .then(async ({ data: { session: s } }) => {

        setSession(s)

        if (s?.user) {
          await cargarOperador(s.user.id, s.user.email)
        }
      })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, s) => {

      setSession(s)

      if (s?.user) {
        await cargarOperador(s.user.id, s.user.email)
      } else {
        setOperador(null)
      }
    })

    return () => subscription.unsubscribe()

  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        operador,
        cerrarSesion
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)