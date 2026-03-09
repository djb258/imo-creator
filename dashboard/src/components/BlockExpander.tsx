import { useState, useEffect, useCallback } from 'react';

interface BlockExpanderProps {
  title: string;
  children: React.ReactNode;
}

export function BlockExpander({ title, children }: BlockExpanderProps) {
  const [expanded, setExpanded] = useState(false);

  const close = useCallback(() => setExpanded(false), []);

  // Close on Escape
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [expanded, close]);

  return (
    <>
      {/* Inline block with expand button */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setExpanded(true)}
          title={`Expand ${title}`}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            all: 'unset',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-hover)',
            color: 'var(--text-muted)',
            fontSize: 14,
            transition: 'background var(--transition-fast), color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--bg-hover)';
            e.currentTarget.style.color = 'var(--text-muted)';
          }}
        >
          ⤢
        </button>
        {children}
      </div>

      {/* Full-screen overlay */}
      {expanded && (
        <div
          onClick={close}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--sp-6)',
            overflow: 'auto',
          }}
        >
          {/* Header bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--sp-4)',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 'var(--text-sm)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {title}
            </span>
            <button
              onClick={close}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: 'var(--sp-1) var(--sp-3)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-hover)',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--red)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              ESC to close ✕
            </button>
          </div>

          {/* Expanded content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              background: 'var(--bg-base)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--sp-6)',
              overflow: 'auto',
              maxWidth: 1400,
              width: '100%',
              margin: '0 auto',
            }}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}
