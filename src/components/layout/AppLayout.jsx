import Sidebar from './Sidebar'
import TopBar  from './TopBar'

export default function AppLayout({ titulo, acciones, children }) {
  return (
    <div className="min-h-screen bg-surface flex">

      {/* Sidebar fijo */}
      <Sidebar />

      {/* Contenido principal — margen izquierdo igual al ancho del sidebar */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: '224px' }}>

        {/* TopBar sticky */}
        <TopBar titulo={titulo} acciones={acciones} />

        {/* Página */}
        <main className="flex-1 px-8 py-8 pb-20 max-w-6xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
