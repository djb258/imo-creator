const gates = [
  { num: 1, name: 'Reachability', desc: 'Is the URL still live?', cost: 'FREE', pass: true, duration: '120ms' },
  { num: 2, name: 'Fetch', desc: 'SH-18 picks mode → SH-16 retrieves content', cost: 'FREE', pass: true, duration: '890ms' },
  { num: 3, name: 'Parse', desc: 'SH-17 extracts constant field value', cost: 'FREE', pass: true, duration: '45ms' },
  { num: 4, name: 'Compare', desc: 'Has value changed from last known?', cost: 'FREE', pass: true, duration: '12ms' },
  { num: 5, name: 'Confirm', desc: 'Re-fetch 3-7 days later to verify change', cost: 'FREE', pass: false, duration: '—' },
  { num: 6, name: 'Classify', desc: 'Categorize the type of change', cost: 'FREE', pass: null, duration: '—' },
  { num: 7, name: 'Enrich', desc: 'Pull additional context (PAID)', cost: 'PAID', pass: null, duration: '—' },
];

export function GateFunnel() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
      {gates.map((gate, i) => {
        const widthPct = 100 - i * 10;
        const bg =
          gate.pass === true
            ? 'var(--green-dim)'
            : gate.pass === false
              ? 'var(--red-dim)'
              : 'var(--gray-dim)';
        const borderColor =
          gate.pass === true
            ? 'var(--green)'
            : gate.pass === false
              ? 'var(--red)'
              : 'var(--border-default)';
        const textColor =
          gate.pass === true
            ? 'var(--green)'
            : gate.pass === false
              ? 'var(--red)'
              : 'var(--text-muted)';

        return (
          <div
            key={gate.num}
            style={{
              width: `${widthPct}%`,
              minWidth: 280,
              maxWidth: 700,
              background: bg,
              border: `1px solid ${borderColor}`,
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--sp-3) var(--sp-4)',
              marginTop: i === 0 ? 0 : -1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 'var(--sp-3)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', minWidth: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  color: textColor,
                  flexShrink: 0,
                }}
              >
                G{gate.num}
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {gate.name}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 1 }}>
                  {gate.desc}
                </div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-muted)',
                }}
              >
                {gate.duration}
              </span>
              {gate.cost === 'PAID' && (
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--orange)',
                    fontWeight: 700,
                  }}
                >
                  $
                </span>
              )}
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  background:
                    gate.pass === true
                      ? 'var(--green)'
                      : gate.pass === false
                        ? 'var(--red)'
                        : 'var(--border-default)',
                  color: gate.pass === null ? 'var(--text-muted)' : 'var(--text-inverse)',
                }}
              >
                {gate.pass === true ? '✓' : gate.pass === false ? '✗' : '?'}
              </span>
            </div>
          </div>
        );
      })}

      {/* Funnel output */}
      <div
        style={{
          marginTop: 'var(--sp-4)',
          padding: 'var(--sp-3) var(--sp-5)',
          background: 'var(--red-dim)',
          border: '1px solid var(--red)',
          borderRadius: 'var(--radius-md)',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            fontWeight: 700,
            color: 'var(--red)',
          }}
        >
          BLOCKED at Gate 5 — awaiting confirmation window
        </span>
      </div>

      {/* Stats */}
      <div
        style={{
          marginTop: 'var(--sp-6)',
          display: 'flex',
          gap: 'var(--sp-6)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span>URLs registered: 847</span>
        <span>Due this cycle: 124</span>
        <span>Reached Gate 7: ~3%</span>
      </div>
    </div>
  );
}
