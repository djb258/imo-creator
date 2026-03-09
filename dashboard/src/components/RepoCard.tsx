import { useNavigate } from 'react-router-dom';
import type { FleetRepo } from '../data/types';
import { getProcessesForRepo } from '../data/processes';
import { StatusBadge } from './StatusBadge';

export function RepoCard({ repo }: { repo: FleetRepo }) {
  const navigate = useNavigate();
  const presentCount = repo.docs.filter((d) => d.status === 'PRESENT').length;
  const totalCount = repo.docs.length;
  const pct = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
  const activeWPs = repo.workPackets.filter((wp) => wp.status !== 'COMPLETE').length;
  const processCount = getProcessesForRepo(repo.name).length;

  return (
    <button
      onClick={() => navigate(`/repo/${repo.name}`)}
      style={{
        all: 'unset',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-5)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
        transition: 'border-color var(--transition-normal), box-shadow var(--transition-normal)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-strong)';
        e.currentTarget.style.boxShadow = 'var(--shadow-raised)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div
            style={{
              fontSize: 'var(--text-lg)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {repo.name}
          </div>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginTop: 2,
            }}
          >
            {repo.tier}
          </div>
        </div>
        <StatusBadge status={repo.status} />
      </div>

      {/* Purpose */}
      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {repo.purpose}
      </div>

      {/* Doctrine version + sync */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <span>v{repo.doctrineVersion}</span>
        <span>{repo.syncStatus}</span>
      </div>

      {/* Doc completeness bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--sp-1)',
          }}
        >
          <span>Docs</span>
          <span>
            {presentCount}/{totalCount}
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 2,
            background: 'var(--bg-hover)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${pct}%`,
              borderRadius: 2,
              background:
                pct === 100
                  ? 'var(--green)'
                  : pct >= 50
                    ? 'var(--yellow)'
                    : 'var(--red)',
              transition: 'width var(--transition-normal)',
            }}
          />
        </div>
      </div>

      {/* Active WP count */}
      {activeWPs > 0 && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--yellow)',
          }}
        >
          {activeWPs} active work packet{activeWPs > 1 ? 's' : ''}
        </div>
      )}

      {/* Process participation count */}
      {processCount > 0 && (
        <div
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--purple)',
          }}
        >
          {processCount} process{processCount > 1 ? 'es' : ''}
        </div>
      )}
    </button>
  );
}
