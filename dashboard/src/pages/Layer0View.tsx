import { useState } from 'react';
import { useAPI } from '../lib/useAPI';
import {
  getL0Sessions,
  getL0Session,
  getL0BackPropLog,
  getL0Variables,
  type L0Session,
  type L0GateResult,
  type L0Constant,
  type L0BackProp,
  type L0Variable,
} from '../lib/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

const L0_API_BASE = import.meta.env.VITE_L0_API_BASE || 'https://layer0-engine.svg-outreach.workers.dev';

function verdictColor(v: string): string {
  if (v === 'CONSTANT_LOCKED') return 'var(--green)';
  if (v === 'VARIABLE') return 'var(--yellow)';
  if (v === 'BACK_PROPAGATE') return 'var(--red)';
  if (v === 'PHANTOM_RECLASSIFY') return 'var(--orange)';
  if (v === 'DONE') return 'var(--blue)';
  return 'var(--text-muted)';
}

function sigmaColor(dir: string | null): string {
  if (dir === 'TIGHTENED') return 'var(--green)';
  if (dir === 'UNCHANGED') return 'var(--yellow)';
  if (dir === 'EXPANDED') return 'var(--red)';
  return 'var(--text-muted)';
}

function validationBadge(json: string | null): { pass: boolean; label: string } {
  if (!json) return { pass: false, label: '?' };
  try {
    const parsed = typeof json === 'string' ? JSON.parse(json) : json;
    const accepted = parsed.accepted ?? parsed.pass ?? false;
    return { pass: !!accepted, label: accepted ? 'PASS' : 'FAIL' };
  } catch {
    return { pass: false, label: '?' };
  }
}

function StatusPill({ status }: { status: L0Session['status'] }) {
  const bg = status === 'COMPLETE' ? 'var(--green-dim)' : status === 'FAILED' ? 'var(--red-dim)' : 'var(--yellow-dim)';
  const color = status === 'COMPLETE' ? 'var(--green)' : status === 'FAILED' ? 'var(--red)' : 'var(--yellow)';
  return (
    <span
      style={{
        padding: '0 var(--sp-2)',
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
      }}
    >
      {status}
    </span>
  );
}

function SessionDetail({ session }: { session: L0Session }) {
  const detail = useAPI<{ gates: L0GateResult[]; constants: L0Constant[] }>(
    () => getL0Session(session.id),
    [session.id],
  );
  const backprop = useAPI<{ backprop: L0BackProp[] }>(
    () => getL0BackPropLog(session.id).catch(() => ({ backprop: [] })),
    [session.id],
  );
  const vars = useAPI<{ variables: L0Variable[] }>(
    () => getL0Variables(session.id).catch(() => ({ variables: [] })),
    [session.id],
  );

  if (detail.loading) return <div style={{ padding: 'var(--sp-4)', color: 'var(--text-muted)' }}>Loading...</div>;
  if (detail.error) return <div style={{ padding: 'var(--sp-4)', color: 'var(--red)' }}>Error: {detail.error}</div>;

  const gates = detail.data?.gates ?? [];
  const constants = detail.data?.constants ?? [];
  const backprops = backprop.data?.backprop ?? [];
  const variables = vars.data?.variables ?? [];

  const isUpper = (session.final_sigma === null || session.final_sigma === undefined) && gates.every(g => g.monte_carlo_sigma === null);
  const altitude = isUpper ? 'UPPER' : 'LOWER';

  const sigmaData = gates
    .filter((g) => g.monte_carlo_sigma !== null)
    .map((g) => ({ gate: `G${g.gate_number}`, sigma: g.monte_carlo_sigma }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {/* Altitude Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-3)',
          padding: 'var(--sp-3) var(--sp-4)',
          background: altitude === 'UPPER' ? 'var(--blue-dim)' : 'var(--purple-dim)',
          border: `1px solid ${altitude === 'UPPER' ? 'var(--blue)' : 'var(--purple)'}`,
          borderRadius: 'var(--radius-md)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: altitude === 'UPPER' ? 'var(--blue)' : 'var(--purple)',
          }}
        >
          {altitude}
        </span>
        <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          {altitude === 'UPPER' ? 'Qualitative extraction — no Monte Carlo' : 'Quantitative verification — Monte Carlo active'}
        </span>
        {session.final_sigma !== null && (
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              color: 'var(--purple)',
            }}
          >
            Final sigma: {session.final_sigma?.toFixed(4)}
          </span>
        )}
      </div>

      {/* Gate Progression */}
      <div>
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
          Gate Progression ({gates.length} gates)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {gates.map((gate) => {
            const imo = validationBadge(gate.imo_validation);
            const ctb = validationBadge(gate.ctb_validation);
            const circle = validationBadge(gate.circle_validation);

            return (
              <div
                key={gate.id}
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--bg-surface)',
                  border: `1px solid var(--border-subtle)`,
                  borderLeft: `3px solid ${verdictColor(gate.verdict)}`,
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: verdictColor(gate.verdict),
                    width: 28,
                    flexShrink: 0,
                  }}
                >
                  G{gate.gate_number}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {gate.candidate_constant}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--sp-2)', marginTop: 2 }}>
                    {[
                      { label: 'IMO', v: imo },
                      { label: 'CTB', v: ctb },
                      { label: 'Circle', v: circle },
                    ].map(({ label, v }) => (
                      <span
                        key={label}
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontFamily: 'var(--font-mono)',
                          color: v.pass ? 'var(--green)' : 'var(--red)',
                        }}
                      >
                        {label} {v.pass ? '\u2713' : '\u2717'}
                      </span>
                    ))}
                  </div>
                </div>
                {gate.monte_carlo_sigma !== null && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 'var(--text-xs)',
                      color: sigmaColor(gate.sigma_direction),
                      fontWeight: 600,
                    }}
                  >
                    {gate.sigma_direction} {gate.monte_carlo_sigma?.toFixed(4)}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 700,
                    color: verdictColor(gate.verdict),
                    flexShrink: 0,
                  }}
                >
                  {gate.verdict}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Locked Constants */}
      {constants.length > 0 && (
        <div>
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
            Locked Constants ({constants.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {constants.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--green-dim)',
                  border: '1px solid var(--green)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--green)' }}>
                  {c.constant_name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 2 }}>
                  {c.constant_definition}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: 2 }}>
                  Locked at gate {c.gate_number}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Isolated Variables */}
      {variables.length > 0 && (
        <div>
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
            Isolated Variables ({variables.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            {variables.map((v) => (
              <div
                key={v.id}
                style={{
                  padding: 'var(--sp-2) var(--sp-3)',
                  background: 'var(--yellow-dim)',
                  border: '1px solid var(--yellow)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: 'var(--yellow)', fontWeight: 600 }}>{v.variable_name}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-2)' }}>{v.variable_type}</span>
                {v.range_min !== null && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    {' '}[{v.range_min} – {v.range_max}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back-Propagation Log */}
      {backprops.length > 0 && (
        <div>
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
            Back-Propagation Log ({backprops.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {backprops.map((bp) => (
              <div
                key={bp.id}
                style={{
                  padding: 'var(--sp-2) var(--sp-4)',
                  background: 'var(--red-dim)',
                  border: '1px solid var(--red)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: 'var(--red)', fontWeight: 600 }}>
                  G{bp.trigger_gate} → G{bp.target_gate}
                </span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'var(--sp-2)' }}>
                  {bp.original_verdict} → {bp.new_verdict}
                </span>
                <div style={{ color: 'var(--text-secondary)', marginTop: 2 }}>{bp.reason}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sigma Trend Chart */}
      {sigmaData.length > 1 && (
        <div>
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
            Sigma Trend (Lower Altitude)
          </div>
          <div
            style={{
              padding: 'var(--sp-4)',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              height: 200,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sigmaData}>
                <XAxis dataKey="gate" tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <YAxis tick={{ fontSize: 11, fontFamily: 'var(--font-mono)' }} />
                <Tooltip />
                <ReferenceLine y={0.05} stroke="var(--green)" strokeDasharray="4 4" label="Tolerance" />
                <Line type="monotone" dataKey="sigma" stroke="var(--purple)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)' }}>
            Tightening = real constant. Flat = investigate. Expanding = broken prior.
          </div>
        </div>
      )}
    </div>
  );
}

export function Layer0View() {
  const sessions = useAPI<{ sessions: L0Session[] }>(
    () => getL0Sessions().catch(() => ({ sessions: [] })),
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = sessions.data?.sessions?.find((s) => s.id === selectedId) ?? null;

  return (
    <div style={{ padding: 'var(--sp-8)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-2)' }}>
        <h1
          style={{
            margin: 0,
            fontSize: 'var(--text-2xl)',
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          Tier 0 Engine
        </h1>
        <a
          href={L0_API_BASE}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: 'var(--sp-2) var(--sp-4)',
            background: 'var(--accent)',
            color: 'var(--text-inverse)',
            borderRadius: 'var(--radius-sm)',
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
          }}
        >
          Start Extraction
        </a>
      </div>
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        Constant extraction via C&V + IMO + CTB + Circle validators
      </p>

      {/* Sessions list */}
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
        Sessions
        {sessions.loading && <span style={{ color: 'var(--yellow)' }}>loading...</span>}
        <button
          onClick={sessions.refresh}
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

      {sessions.error && (
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
          Tier 0 Engine offline
        </div>
      )}

      {!sessions.error && sessions.data?.sessions?.length === 0 && (
        <div
          style={{
            padding: 'var(--sp-6)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            marginBottom: 'var(--sp-6)',
          }}
        >
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginBottom: 'var(--sp-2)' }}>
            No extraction sessions yet
          </div>
          <a
            href={L0_API_BASE}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--accent)', fontSize: 'var(--text-sm)' }}
          >
            Start your first extraction
          </a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)', marginBottom: 'var(--sp-8)' }}>
        {(sessions.data?.sessions ?? []).map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedId(selectedId === s.id ? null : s.id)}
            style={{
              padding: 'var(--sp-3) var(--sp-4)',
              background: selectedId === s.id ? 'var(--bg-hover)' : 'var(--bg-surface)',
              border: `1px solid ${selectedId === s.id ? 'var(--accent)' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-3)',
              transition: 'all var(--transition-fast)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>
                {s.domain_name}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {new Date(s.created_at).toLocaleString()} · {s.total_gates} gates · {s.total_constants} constants · {s.total_variables} vars
              </div>
            </div>
            <StatusPill status={s.status} />
            {s.final_sigma !== null && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--purple)', fontWeight: 600 }}>
                {'\u03C3'} {s.final_sigma?.toFixed(4)}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Session Detail */}
      {selected && <SessionDetail session={selected} />}
    </div>
  );
}
