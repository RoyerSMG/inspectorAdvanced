import Header from '../components/Header'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-9">
        <h2 className="text-[2rem] font-extrabold text-ink">Dashboard</h2>
        <p className="text-muted mt-2">Página en construcción.</p>
      </main>
    </div>
  )
}
