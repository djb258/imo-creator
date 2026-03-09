import { useEffect, useState } from 'react';
import { resolveAdrDir } from '../data/docResolver';
import { DocViewer } from './DocViewer';

interface ADRBrowserProps {
  repoName: string;
  label?: string;
}

export function ADRBrowser({ repoName, label = 'Architecture Decision Records' }: ADRBrowserProps) {
  const adrDir = resolveAdrDir(repoName);
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<{ file: string; path: string } | null>(null);

  useEffect(() => {
    if (!adrDir) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/__docs/ls?dir=${encodeURIComponent(adrDir)}`)
      .then((r) => r.json())
      .then((list: string[]) => {
        if (!cancelled) {
          setFiles(list.filter((f) => f.toLowerCase().includes('adr')).sort());
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [adrDir]);

  if (loading) {
    return (
      <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', padding: 'var(--sp-2)' }}>
        Loading ADRs...
      </div>
    );
  }

  if (!adrDir || files.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--sp-4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--sp-3)',
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          {label}
        </h3>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--accent)',
          }}
        >
          {files.length} ADR{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
        {files.map((file) => {
          const name = file.replace('.md', '').replace(/^ADR[-_]?/i, 'ADR-');
          const title = name
            .replace(/^ADR-\d+[-_]?/, '')
            .replace(/[-_]/g, ' ')
            .trim();
          const id = name.match(/ADR-\d+/)?.[0] ?? name;

          return (
            <button
              key={file}
              onClick={() => setViewing({ file, path: `${adrDir}/${file}` })}
              style={{
                all: 'unset',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: 'var(--sp-1) var(--sp-2)',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-raised)',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  flexShrink: 0,
                  minWidth: 55,
                }}
              >
                {id}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {title || file}
              </span>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>→</span>
            </button>
          );
        })}
      </div>

      {viewing && (
        <DocViewer
          title={viewing.file.replace('.md', '')}
          diskPath={viewing.path}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
