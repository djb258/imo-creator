import { useEffect, useState, useCallback } from 'react';
import { fetchDoc } from '../lib/fetchDoc';

interface DocViewerProps {
  title: string;
  diskPath: string;
  onClose: () => void;
}

export function DocViewer({ title, diskPath, onClose }: DocViewerProps) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchDoc(diskPath).then((text) => {
      if (cancelled) return;
      if (text === null) {
        setError(`Could not load: ${diskPath}`);
      } else {
        setContent(text);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [diskPath]);

  // Close on Escape
  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onKey]);

  return (
    <div
      onClick={onClose}
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
      {/* Header */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
          <span
            style={{
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              maxWidth: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {diskPath}
          </span>
        </div>
        <button
          onClick={onClose}
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

      {/* Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          flex: 1,
          background: 'var(--bg-base)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--sp-6)',
          overflow: 'auto',
          maxWidth: 900,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {loading && (
          <div style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
            Loading...
          </div>
        )}
        {error && (
          <div style={{ color: 'var(--red)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>
            {error}
          </div>
        )}
        {content !== null && (
          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}
          >
            {content}
          </pre>
        )}
      </div>
    </div>
  );
}
