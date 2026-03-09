import { GateFunnel } from '../components/GateFunnel';

export function GateFunnelView() {
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
        7-Gate Cost Funnel
      </h1>
      <p
        style={{
          margin: '0 0 var(--sp-2)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        Movement detection pipeline — SH-16 → SH-20
      </p>
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        Mock data — wire to real worker endpoints in a future phase
      </p>

      <GateFunnel />

      {/* Legend */}
      <div
        style={{
          marginTop: 'var(--sp-8)',
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
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--sp-3)',
          }}
        >
          Sub-Hub Chain
        </div>
        <div
          style={{
            display: 'flex',
            gap: 'var(--sp-2)',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {[
            { id: 'SH-20', name: 'Scheduler', color: 'var(--purple)' },
            { id: 'SH-19', name: 'Orchestrator', color: 'var(--blue)' },
            { id: 'SH-18', name: 'Proxy Router', color: 'var(--yellow)' },
            { id: 'SH-16', name: 'Fetcher', color: 'var(--green)' },
            { id: 'SH-17', name: 'Parser Registry', color: 'var(--orange)' },
          ].map((sh, i) => (
            <span key={sh.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: sh.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ color: sh.color, fontWeight: 600 }}>{sh.id}</span>
              <span style={{ color: 'var(--text-muted)' }}>{sh.name}</span>
              {i < 4 && <span style={{ color: 'var(--text-muted)', margin: '0 var(--sp-1)' }}>→</span>}
            </span>
          ))}
        </div>
        <div
          style={{
            marginTop: 'var(--sp-3)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          Gates 1–6 are free. Gate 7 (Enrich) is the only gate with per-record cost.
          ~3% of registered URLs reach Gate 7 at current scale.
        </div>
      </div>
    </div>
  );
}
