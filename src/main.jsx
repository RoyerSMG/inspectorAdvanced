import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

import Login           from './pages/Login'
import ResetPassword   from './pages/ResetPassword'
import InspeccionSede  from './pages/InspeccionSede'
import Seguimiento     from './pages/Seguimiento'
import Dashboard       from './pages/Dashboard'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas */}
          <Route path="/login"          element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protegidas */}
          <Route path="/inspeccion-sede" element={<ProtectedRoute><InspeccionSede /></ProtectedRoute>} />
          <Route path="/seguimiento"     element={<ProtectedRoute><Seguimiento /></ProtectedRoute>} />
          <Route path="/dashboard"       element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          {/* Raíz → redirige al formulario */}
          <Route path="/" element={<Navigate to="/inspeccion-sede" replace />} />
          <Route path="*" element={<Navigate to="/inspeccion-sede" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
