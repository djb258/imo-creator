import { useState } from 'react';
import type { SubHub } from '../data/types';
import { StatusBadge } from './StatusBadge';

export function SubHubCard({ hub }: { hub: SubHub }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        transition: 'border-color var(--transition-fast)',
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          all: 'unset',
          cursor: 'pointer',
          display: 'flex',
          width: '100%',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 'var(--sp-3) var(--sp-4)',
          gap: 'var(--sp-3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', minWidth: 0 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}
          >
            {hub.id}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--text-primary)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {hub.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: hub.layer === 'External' ? 'var(--orange)' : 'var(--blue)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {hub.layer}
          </span>
          <StatusBadge status={hub.status} />
          <span
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)',
              transition: 'transform var(--transition-fast)',
              transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          style={{
            padding: '0 var(--sp-4) var(--sp-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--sp-3)',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: 'var(--sp-3)',
          }}
        >
          <Row label="Driver" value={hub.driver} />
          {hub.action && <Row label="Action" value={hub.action} mono />}
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {hub.description}
          </div>
          <Row label="Does NOT" value={hub.doesNot} />
          <Row label="Error Table" value={hub.errorTable} mono />
          {hub.interfaces && (
            <>
              {hub.interfaces.in && <Row label="Interface In" value={hub.interfaces.in} mono />}
              {hub.interfaces.out && <Row label="Interface Out" value={hub.interfaces.out} mono />}
            </>
          )}
          {hub.v2Concerns && hub.v2Concerns.length > 0 && (
            <div>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--orange)', fontWeight: 600 }}>
                V2 Concerns
              </span>
              <ul
                style={{
                  margin: 'var(--sp-1) 0 0 var(--sp-4)',
                  padding: 0,
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                }}
              >
                {hub.v2Concerns.map((c, i) => (
                  <li key={i} style={{ marginBottom: 2 }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', gap: 'var(--sp-2)', fontSize: 'var(--text-xs)' }}>
      <span style={{ color: 'var(--text-muted)', flexShrink: 0, minWidth: 80 }}>{label}</span>
      <span
        style={{
          color: 'var(--text-secondary)',
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        }}
      >
        {value}
      </span>
    </div>
  );
}
