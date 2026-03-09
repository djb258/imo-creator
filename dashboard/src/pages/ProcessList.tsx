import { useNavigate } from 'react-router-dom';
import { processes } from '../data/processes';
import { StatusBadge } from '../components/StatusBadge';

export function ProcessList() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: 'var(--sp-8)' }}>
      <h1
        style={{
          margin: '0 0 var(--sp-2)',
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Processes
      </h1>
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        Cross-repo workflows — Garage-altitude, no single repo owns these
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: 'var(--sp-4)',
        }}
      >
        {processes.map((proc) => {
          const presentCount = proc.docs.filter((d) => d.status === 'PRESENT').length;
          const totalCount = proc.docs.length;
          const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

          return (
            <button
              key={proc.id}
              onClick={() => navigate(`/process/${proc.id}`)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--sp-3)',
                padding: 'var(--sp-5)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)';
                e.currentTarget.style.boxShadow = 'var(--shadow-raised)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'var(--shadow-card)';
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {proc.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-mono)',
                      marginTop: 2,
                    }}
                  >
                    {proc.shortName}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
                  <StatusBadge status={proc.status} />
                  <StatusBadge status={proc.orbt.mode} />
                </div>
              </div>

              {/* Description */}
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {proc.description}
              </div>

              {/* Repos involved */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)' }}>
                {proc.heir.repos.map((r) => (
                  <span
                    key={r}
                    style={{
                      display: 'inline-block',
                      padding: '1px var(--sp-2)',
                      borderRadius: '999px',
                      background: 'var(--blue-dim)',
                      color: 'var(--blue)',
                      fontSize: 'var(--text-xs)',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 600,
                    }}
                  >
                    {r}
                  </span>
                ))}
              </div>

              {/* Doc completeness bar */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--sp-1)',
                  }}
                >
                  <span>Docs</span>
                  <span>
                    {presentCount}/{totalCount}
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--bg-hover)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 2,
                      background:
                        pct === 100
                          ? 'var(--green)'
                          : pct >= 50
                            ? 'var(--yellow)'
                            : 'var(--red)',
                      transition: 'width var(--transition-normal)',
                    }}
                  />
                </div>
              </div>

              {/* Health */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                <StatusBadge status={proc.orbt.health} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
