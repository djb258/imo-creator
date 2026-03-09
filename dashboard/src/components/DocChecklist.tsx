import { useState } from 'react';
import type { DocItem } from '../data/types';
import { resolveDoc } from '../data/docResolver';
import { DocViewer } from './DocViewer';

interface DocChecklistProps {
  docs: DocItem[];
  repoName?: string;
}

export function DocChecklist({ docs, repoName }: DocChecklistProps) {
  const presentCount = docs.filter((d) => d.status === 'PRESENT').length;
  const [viewing, setViewing] = useState<{ file: string; path: string } | null>(null);

  function diskPath(doc: DocItem): string | undefined {
    const repo = doc.repo ?? repoName;
    if (!repo || doc.status !== 'PRESENT') return undefined;
    return resolveDoc(repo, doc.file);
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
          Doc Checklist
        </h3>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color:
              presentCount === docs.length
                ? 'var(--green)'
                : presentCount > docs.length / 2
                  ? 'var(--yellow)'
                  : 'var(--red)',
          }}
        >
          {presentCount}/{docs.length}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {docs.map((doc) => {
          const resolved = diskPath(doc);
          const canOpen = !!resolved;
          return (
            <button
              key={doc.file}
              onClick={() => canOpen ? setViewing({ file: doc.file, path: resolved! }) : undefined}
              style={{
                all: 'unset',
                cursor: canOpen ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-2)',
                padding: 'var(--sp-1) var(--sp-2)',
                borderRadius: 'var(--radius-sm)',
                background: doc.status === 'PRESENT' ? 'var(--green-dim)' : 'var(--red-dim)',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => { if (canOpen) e.currentTarget.style.opacity = '0.8'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>
                {doc.status === 'PRESENT' ? '✓' : '✗'}
              </span>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: doc.status === 'PRESENT' ? 'var(--green)' : 'var(--red)',
                  flex: 1,
                }}
              >
                {doc.file}
              </span>
              {canOpen && (
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>→</span>
              )}
              {doc.status === 'MISSING' && doc.template && (
                <span
                  style={{
                    fontSize: 10,
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  needs: {doc.template.split('/').pop()}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Doc viewer overlay */}
      {viewing && (
        <DocViewer
          title={viewing.file}
          diskPath={viewing.path}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
