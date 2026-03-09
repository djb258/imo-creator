import { useParams, useNavigate } from 'react-router-dom';
import { processes } from '../data/processes';
import { StatusBadge } from '../components/StatusBadge';
import { DocChecklist } from '../components/DocChecklist';
import { ADRBrowser } from '../components/ADRBrowser';
import { ProcessDiagram } from '../components/ProcessDiagram';
import { lazy, Suspense } from 'react';
const ProcessMermaid = lazy(() => import('../components/ProcessMermaid').then(m => ({ default: m.ProcessMermaid })));
import { ProcessBlock } from '../components/ProcessBlock';
import { BlockExpander } from '../components/BlockExpander';
import { REPO_ROOTS } from '../data/docResolver';

export function ProcessDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const process = processes.find((p) => p.id === id);

  if (!process) {
    return (
      <div style={{ padding: 'var(--sp-8)', color: 'var(--text-secondary)' }}>
        Process "{id}" not found.{' '}
        <button
          onClick={() => navigate('/processes')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: 'var(--accent)',
            textDecoration: 'underline',
          }}
        >
          Back to processes
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100 }}>
      {/* Back link */}
      <button
        onClick={() => navigate('/processes')}
        style={{
          all: 'unset',
          cursor: 'pointer',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
          marginBottom: 'var(--sp-4)',
          display: 'block',
        }}
      >
        ← Processes
      </button>

      {/* Identity bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-4)',
          flexWrap: 'wrap',
          marginBottom: 'var(--sp-6)',
        }}
      >
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
          {process.name}
        </h1>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
          }}
        >
          {process.shortName}
        </span>
        <StatusBadge status={process.status} />
        <StatusBadge status={process.orbt.mode} />
        <StatusBadge status={process.orbt.health} />
      </div>

      {/* Description */}
      <p
        style={{
          margin: '0 0 var(--sp-6)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
        }}
      >
        {process.description}
      </p>

      {/* Two-column: Doc Checklist + Participating Repos */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <DocChecklist docs={process.docs} repoName={process.heir.repos[0]} />

        {/* Participating repos */}
        <div
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--sp-4)',
          }}
        >
          <h3
            style={{
              margin: '0 0 var(--sp-3)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            Participating Repos
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {process.heir.repos.map((r) => (
              <button
                key={r}
                onClick={() => navigate(`/repo/${r}`)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-2)',
                  padding: 'var(--sp-1) var(--sp-2)',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--blue-dim)',
                  transition: 'opacity var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    color: 'var(--blue)',
                  }}
                >
                  {r}
                </span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginLeft: 'auto' }}>→</span>
              </button>
            ))}
          </div>

          {/* Tools + Services + Skills */}
          {(process.heir.tools?.length || process.heir.services?.length || process.heir.skills?.length) && (
            <div style={{ marginTop: 'var(--sp-3)', display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)' }}>
              {process.heir.tools?.map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'inline-block',
                    padding: '1px var(--sp-2)',
                    borderRadius: '999px',
                    background: 'var(--green-dim)',
                    color: 'var(--green)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
              {process.heir.services?.map((s) => (
                <span
                  key={s}
                  style={{
                    display: 'inline-block',
                    padding: '1px var(--sp-2)',
                    borderRadius: '999px',
                    background: 'var(--orange-dim)',
                    color: 'var(--orange)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {s}
                </span>
              ))}
              {process.heir.skills?.map((sk) => (
                <span
                  key={sk}
                  style={{
                    display: 'inline-block',
                    padding: '1px var(--sp-2)',
                    borderRadius: '999px',
                    background: 'var(--bg-hover)',
                    color: 'var(--accent)',
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {sk}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ADR Browser — show ADRs from all participating repos */}
      {process.heir.repos.some((r) => REPO_ROOTS[r]) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: process.heir.repos.filter((r) => REPO_ROOTS[r]).length > 1 ? '1fr 1fr' : '1fr',
            gap: 'var(--sp-4)',
            marginBottom: 'var(--sp-6)',
          }}
        >
          {process.heir.repos
            .filter((r) => REPO_ROOTS[r])
            .map((r) => (
              <ADRBrowser key={r} repoName={r} label={`ADRs — ${r}`} />
            ))}
        </div>
      )}

      {/* Mermaid Hub & Spoke Diagram — expandable */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <BlockExpander title="Hub & Spoke Diagram">
          <Suspense fallback={<div style={{ padding: 'var(--sp-4)', color: 'var(--text-muted)', fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)' }}>Loading diagram...</div>}>
            <ProcessMermaid process={process} />
          </Suspense>
        </BlockExpander>
      </div>

      {/* Process Flow Diagram — expandable */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <BlockExpander title="Process Flow">
          <ProcessDiagram process={process} />
        </BlockExpander>
      </div>

      {/* Full 5-section doctrine view — expandable */}
      <BlockExpander title="Doctrine View (HEIR / IMO / ERD / ORBT / CTB)">
        <ProcessBlock process={process} />
      </BlockExpander>
    </div>
  );
}
