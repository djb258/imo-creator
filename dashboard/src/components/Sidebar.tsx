import { NavLink } from 'react-router-dom';

interface NavGroup {
  label: string;
  links: { to: string; label: string; icon: string; end?: boolean }[];
}

const groups: NavGroup[] = [
  {
    label: 'Doctrine',
    links: [{ to: '/layer0', label: 'Tier 0 Engine', icon: '◉' }],
  },
  {
    label: 'Fleet',
    links: [{ to: '/', label: 'Fleet', icon: '◈', end: true }],
  },
  {
    label: 'Processes',
    links: [{ to: '/processes', label: 'Processes', icon: '⬢' }],
  },
  {
    label: 'Operations',
    links: [
      { to: '/pipeline', label: 'Pipeline', icon: '▸' },
      { to: '/gate-funnel', label: 'Gate Funnel', icon: '⬡' },
    ],
  },
];

export function Sidebar() {
  return (
    <nav
      style={{
        width: 200,
        flexShrink: 0,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--sp-4) 0',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '0 var(--sp-4) var(--sp-6)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'var(--sp-4)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-lg)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          GARAGE
        </div>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 2,
          }}
        >
          Control Panel
        </div>
      </div>

      {/* Nav groups */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
        {groups.map((group) => (
          <div key={group.label}>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 var(--sp-4)',
                marginBottom: 'var(--sp-1)',
              }}
            >
              {group.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              {group.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--sp-2)',
                    padding: 'var(--sp-2) var(--sp-4)',
                    textDecoration: 'none',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-hover)' : 'transparent',
                    borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    transition: 'all var(--transition-fast)',
                  })}
                >
                  <span style={{ fontSize: 14, width: 18, textAlign: 'center' }}>{link.icon}</span>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 'auto',
          padding: 'var(--sp-4)',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          IMO-Creator
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          Doctrine v3.5.0
        </div>
      </div>
    </nav>
  );
}
