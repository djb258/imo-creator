import { fleet } from '../data/fleet';
import { RepoCard } from '../components/RepoCard';
import { useAPI } from '../lib/useAPI';
import { getArchitecture, getCFPlatform, getL0Constants } from '../lib/api';
import type { L0Constant } from '../lib/api';

interface ArchRow { component: string; component_type: string; description: string; parent_component: string }
interface CFRow { product: string; binding_name: string; description: string; database_id: string }

export function FleetOverview() {
  const garageRepos = fleet.filter((r) => r.tier === 'Garage');
  const carRepos = fleet.filter((r) => r.tier !== 'Garage');

  const arch = useAPI<{ results: ArchRow[] }>(() => getArchitecture(), []);
  const cf = useAPI<{ results: CFRow[] }>(() => getCFPlatform(), []);
  const l0 = useAPI<{ constants: L0Constant[]; total?: number }>(() => getL0Constants().catch(() => ({ constants: [], total: 0 })), []);

  // Group architecture components by type
  const archByType: Record<string, ArchRow[]> = {};
  if (arch.data?.results) {
    for (const row of arch.data.results) {
      const t = row.component_type || 'other';
      if (!archByType[t]) archByType[t] = [];
      archByType[t].push(row);
    }
  }

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
        Fleet Overview
      </h1>
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        The Garage floor — all Cars visible at once
      </p>

      {/* Locked Constants — headline metric */}
      <div
        style={{
          padding: 'var(--sp-4) var(--sp-6)',
          background: l0.error ? 'var(--yellow-dim)' : 'var(--bg-surface)',
          border: `1px solid ${l0.error ? 'var(--yellow)' : 'var(--accent)'}`,
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--sp-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: l0.error ? 'var(--yellow)' : 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 'var(--sp-1)',
            }}
          >
            {l0.error ? 'Layer 0 Engine: Offline' : 'Layer 0 Engine'}
          </div>
          <div
            style={{
              fontSize: 'var(--text-2xl)',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              color: l0.error ? 'var(--yellow)' : 'var(--accent)',
              letterSpacing: '-0.02em',
            }}
          >
            {l0.loading ? '...' : l0.data?.total ?? l0.data?.constants?.length ?? 0}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
            Locked Constants
          </div>
        </div>
        <div style={{ fontSize: 32, opacity: 0.3 }}>C</div>
      </div>

      {/* Garage */}
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-3)',
        }}
      >
        Garage
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-8)',
        }}
      >
        {garageRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>

      {/* Cars */}
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-3)',
        }}
      >
        Cars ({carRepos.length})
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-8)',
        }}
      >
        {carRepos.map((repo) => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>

      {/* Live Architecture Components */}
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
        Architecture Components
        {arch.loading && <span style={{ color: 'var(--yellow)' }}>loading...</span>}
        {arch.error && <span style={{ color: 'var(--red)' }}>offline</span>}
        {!arch.loading && !arch.error && <span style={{ color: 'var(--green)' }}>live</span>}
        <button
          onClick={arch.refresh}
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

      {arch.error && (
        <div
          style={{
            padding: 'var(--sp-3) var(--sp-4)',
            background: 'var(--yellow-dim)',
            border: '1px solid var(--yellow)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--yellow)',
            marginBottom: 'var(--sp-4)',
          }}
        >
          Data source not connected — showing static fleet data only
        </div>
      )}

      {!arch.error && arch.data && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 'var(--sp-3)',
            marginBottom: 'var(--sp-8)',
          }}
        >
          {Object.entries(archByType).map(([type, items]) => (
            <div
              key={type}
              style={{
                padding: 'var(--sp-4)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  marginBottom: 'var(--sp-2)',
                }}
              >
                {type} ({items.length})
              </div>
              {items.map((item) => (
                <div
                  key={item.component}
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    padding: 'var(--sp-1) 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.component}</span>
                  <span style={{ color: 'var(--text-muted)', maxWidth: '60%', textAlign: 'right' }}>
                    {item.description?.slice(0, 60)}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* CF Platform Infrastructure */}
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
        CF Infrastructure
        {cf.loading && <span style={{ color: 'var(--yellow)' }}>loading...</span>}
        {cf.error && <span style={{ color: 'var(--red)' }}>offline</span>}
        {!cf.loading && !cf.error && <span style={{ color: 'var(--green)' }}>live</span>}
        <button
          onClick={cf.refresh}
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

      {!cf.error && cf.data?.results && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 'var(--sp-3)',
          }}
        >
          {cf.data.results.map((item) => (
            <div
              key={item.binding_name}
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
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.binding_name}</span>
                <span
                  style={{
                    padding: '0 var(--sp-2)',
                    borderRadius: '999px',
                    background: 'var(--blue-dim)',
                    color: 'var(--blue)',
                    fontWeight: 600,
                  }}
                >
                  {item.product}
                </span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>{item.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
