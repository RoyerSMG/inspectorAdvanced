import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { session } = useAuth()

  // Aún cargando sesión
  if (session === undefined) {
    return (
      <div className="min-h-screen gradient-brand flex items-center justify-center">
        <div className="spinner" />
      </div>
    )
  }

  if (!session) return <Navigate to="/login" replace />

  return children
}
