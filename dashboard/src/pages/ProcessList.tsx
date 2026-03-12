import { useNavigate } from 'react-router-dom';
import { processes } from '../data/processes';
import { StatusBadge } from '../components/StatusBadge';
import { useAPI } from '../lib/useAPI';
import { getGlossary } from '../lib/api';

interface GlossaryRow { term: string; definition: string; category: string; source_hub: string }

export function ProcessList() {
  const navigate = useNavigate();
  const glossary = useAPI<{ results: GlossaryRow[] }>(
    () => getGlossary().catch(() => ({ results: [] })),
    []
  );

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

      {/* Live Glossary */}
      {!glossary.error && glossary.data?.results && glossary.data.results.length > 0 && (
        <div style={{ marginTop: 'var(--sp-8)' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--sp-3)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
            }}
          >
            Glossary ({glossary.data.results.length})
            {glossary.loading && <span style={{ color: 'var(--yellow)' }}>loading...</span>}
            {!glossary.loading && <span style={{ color: 'var(--green)' }}>live</span>}
            <button
              onClick={glossary.refresh}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent)',
                marginLeft: 'auto',
              }}
            >
              refresh
            </button>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 'var(--sp-3)',
            }}
          >
            {glossary.data.results.slice(0, 30).map((item) => (
              <div
                key={item.term}
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-1)' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{item.term}</span>
                  {item.category && (
                    <span
                      style={{
                        padding: '0 var(--sp-2)',
                        borderRadius: '999px',
                        background: 'var(--purple-dim)',
                        color: 'var(--purple)',
                        fontWeight: 600,
                      }}
                    >
                      {item.category}
                    </span>
                  )}
                </div>
                <div style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.definition?.slice(0, 120)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
