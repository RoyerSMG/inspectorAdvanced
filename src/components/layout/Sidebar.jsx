import { NavLink } from 'react-router-dom'

const NAV_GROUPS = [
  {
    grupo: 'Operación',
    items: [
      {
        label: 'Inspección Sede',
        to: '/inspeccion-sede',
        icon: (
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        ),
      },
      {
        label: 'Inspección Vehículo',
        to: '/inspeccion-vehiculo',
        icon: (
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="1" y="3" width="15" height="13" rx="2"/>
            <path d="M16 8h4l3 5v3h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        ),
      },
      {
        label: 'Seguimiento',
        to: '/seguimiento',
        icon: (
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        ),
      },
    ],
  },
]

export default function Sidebar() {
  return (
    <aside
      className="fixed left-0 top-0 h-screen w-56 flex flex-col z-40"
      style={{ background: '#1a1a2e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <img src="/BRKLogo.png" alt="Brinks" className="h-[120px] object-contain" />
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', letterSpacing: '1px', marginTop: '8px', textTransform: 'uppercase' }}>
          Inspector Routes
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '16px 12px' }}>
        {NAV_GROUPS.map(group => (
          <div key={group.grupo} style={{ marginBottom: '24px' }}>
            {/* Grupo label */}
            <p style={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              padding: '0 8px',
              marginBottom: '6px',
            }}>
              {group.grupo}
            </p>

            {/* Items */}
            <div className="flex flex-col gap-0.5">
              {group.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)',
                    background: isActive ? 'rgba(0,119,182,0.25)' : 'transparent',
                    borderLeft: isActive ? '3px solid #0077b6' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  })}
                  onMouseEnter={e => {
                    if (!e.currentTarget.style.background.includes('0.25')) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!e.currentTarget.style.background.includes('0.25')) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(255,255,255,0.55)'
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer sidebar */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        fontSize: '10px',
        color: 'rgba(255,255,255,0.2)',
        textAlign: 'center',
      }}>
        Brinks de Colombia © {new Date().getFullYear()}
      </div>
    </aside>
  )
}
