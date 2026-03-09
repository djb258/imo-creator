import type { Process } from '../data/types';

/**
 * Visual flow diagram for a process.
 * Shows: Ingress → Sub-hubs (data containers) → Middle (logic) → Egress
 * Tables are grouped by repo, connected by ERD order arrows.
 */
export function ProcessDiagram({ process }: { process: Process }) {
  // Group ERD tables by repo
  const repoGroups = new Map<string, typeof process.erd.tables>();
  for (const t of process.erd.tables) {
    if (!repoGroups.has(t.repo)) repoGroups.set(t.repo, []);
    repoGroups.get(t.repo)!.push(t);
  }

  // Unique sub-hubs
  const subHubs = process.heir.subHubs ?? [];

  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--sp-5)',
        overflow: 'auto',
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-4)',
        }}
      >
        Process Flow
      </div>

      {/* Flow: Ingress → Processing → Egress */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px auto 1fr auto 180px',
          gap: 'var(--sp-3)',
          alignItems: 'start',
          minWidth: 700,
        }}
      >
        {/* Ingress */}
        <FlowBox color="var(--green)" label="INGRESS">
          <FlowDetail label="Trigger" value={process.imo.ingress.trigger} />
          <FlowDetail label="Schema" value={process.imo.ingress.schema} mono />
        </FlowBox>

        <FlowArrow />

        {/* Center: Sub-hubs + ERD tables by repo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {/* Sub-hub row */}
          {subHubs.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)', marginBottom: 'var(--sp-1)' }}>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginRight: 'var(--sp-1)' }}>
                SUB-HUBS
              </span>
              {subHubs.map((sh) => (
                <Pill key={sh} label={sh} color="var(--purple)" bg="var(--purple-dim)" />
              ))}
            </div>
          )}

          {/* ERD tables grouped by repo */}
          {Array.from(repoGroups.entries()).map(([repo, tables]) => (
            <div
              key={repo}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--sp-3)',
              }}
            >
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--blue)',
                  fontWeight: 700,
                  marginBottom: 'var(--sp-2)',
                }}
              >
                {repo}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)' }}>
                {tables.sort((a, b) => a.order - b.order).map((t, i) => (
                  <span key={t.table} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {i > 0 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>→</span>
                    )}
                    <Pill
                      label={`${t.order}. ${t.table}`}
                      color={
                        t.access === 'WRITE'
                          ? 'var(--orange)'
                          : t.access === 'READ'
                            ? 'var(--green)'
                            : 'var(--yellow)'
                      }
                      bg={
                        t.access === 'WRITE'
                          ? 'var(--orange-dim)'
                          : t.access === 'READ'
                            ? 'var(--green-dim)'
                            : 'var(--yellow-dim)'
                      }
                    />
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Middle logic summary */}
          <div
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--sp-3)',
            }}
          >
            <div
              style={{
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                fontWeight: 700,
                marginBottom: 'var(--sp-2)',
              }}
            >
              MIDDLE (LOGIC)
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)' }}>
              {process.imo.middle.steps.map((step, i) => (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {i > 0 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>→</span>
                  )}
                  <span
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--text-secondary)',
                      background: 'var(--bg-raised)',
                      padding: '2px var(--sp-2)',
                      borderRadius: 'var(--radius-sm)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {step}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <FlowArrow />

        {/* Egress */}
        <FlowBox color="var(--blue)" label="EGRESS">
          {process.imo.egress.outputs.map((o, i) => (
            <FlowDetail key={i} label="Output" value={o} mono />
          ))}
          <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 'var(--sp-2)', paddingTop: 'var(--sp-2)' }}>
            {process.imo.egress.consumers.map((c, i) => (
              <FlowDetail key={i} label="Consumer" value={c} />
            ))}
          </div>
        </FlowBox>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--sp-4)',
          marginTop: 'var(--sp-4)',
          paddingTop: 'var(--sp-3)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        <span><Pill label="READ" color="var(--green)" bg="var(--green-dim)" /></span>
        <span><Pill label="WRITE" color="var(--orange)" bg="var(--orange-dim)" /></span>
        <span><Pill label="READ/WRITE" color="var(--yellow)" bg="var(--yellow-dim)" /></span>
        <span><Pill label="sub-hub" color="var(--purple)" bg="var(--purple-dim)" /></span>
      </div>
    </div>
  );
}

function FlowBox({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--sp-3)',
        borderTop: `3px solid ${color}`,
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: 'var(--sp-2)',
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {children}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-lg)',
        paddingTop: 'var(--sp-6)',
      }}
    >
      →
    </div>
  );
}

function FlowDetail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
      <span
        style={{
          color: 'var(--text-secondary)',
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Pill({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px var(--sp-2)',
        borderRadius: '999px',
        background: bg,
        color,
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}
