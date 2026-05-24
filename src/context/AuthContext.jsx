import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session,         setSession]         = useState(undefined)
  const [operador,        setOperador]        = useState(null)
  const [necesitaRegistro, setNecesitaRegistro] = useState(false)

  const cargarOperador = async (userId, email) => {
    try {
      const { data } = await supabase
        .from('operadores')
        .select('nombre, codigo_operador')
        .eq('id', userId)
        .maybeSingle()

      if (!data) {
        // No tiene perfil → mostrar modal de registro
        setNecesitaRegistro(true)
        setOperador({ nombre: email ?? 'Operador', codigoOperador: null })
      } else {
        setNecesitaRegistro(false)
        setOperador({
          nombre:         data.nombre,
          codigoOperador: data.codigo_operador,
        })
      }
    } catch (err) {
      console.error(err)
      setOperador({ nombre: email ?? 'Operador', codigoOperador: null })
    }
  }

  const registrarOperador = async (nombre, codigoOperador) => {
    const userId = session?.user?.id
    const email  = session?.user?.email
    if (!userId) return { error: 'Sin sesión activa' }

    const { error } = await supabase.from('operadores').insert([{
      id:              userId,
      nombre:          nombre.trim(),
      correo:          email,
      codigo_operador: codigoOperador.trim(),
    }])

    if (error) return { error: error.message }

    setOperador({ nombre: nombre.trim(), codigoOperador: codigoOperador.trim() })
    setNecesitaRegistro(false)
    return { error: null }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) await cargarOperador(s.user.id, s.user.email)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s)
      if (s?.user) await cargarOperador(s.user.id, s.user.email)
      else { setOperador(null); setNecesitaRegistro(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const cerrarSesion = async () => await supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{
      session, operador, necesitaRegistro, registrarOperador, cerrarSesion
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)