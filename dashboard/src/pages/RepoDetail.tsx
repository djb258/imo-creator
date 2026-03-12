import { useParams, useNavigate } from 'react-router-dom';
import { fleet } from '../data/fleet';
import { getProcessesForRepo } from '../data/processes';
import { StatusBadge } from '../components/StatusBadge';
import { DocChecklist } from '../components/DocChecklist';
import { ADRBrowser } from '../components/ADRBrowser';
import { SubHubCard } from '../components/SubHubCard';
import { WorkPacketList } from '../components/WorkPacketList';
import { TodoPanel } from '../components/TodoPanel';
import { REPO_ROOTS } from '../data/docResolver';
import { useAPI } from '../lib/useAPI';
import { getSchema } from '../lib/api';

interface SchemaRow { table_name: string; column_name: string; data_type: string; is_nullable: string }

export function RepoDetail() {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const repo = fleet.find((r) => r.name === name);

  if (!repo) {
    return (
      <div style={{ padding: 'var(--sp-8)', color: 'var(--text-secondary)' }}>
        Repo "{name}" not found.{' '}
        <button
          onClick={() => navigate('/')}
          style={{
            all: 'unset',
            cursor: 'pointer',
            color: 'var(--accent)',
            textDecoration: 'underline',
          }}
        >
          Back to fleet
        </button>
      </div>
    );
  }

  const participatingProcesses = getProcessesForRepo(repo.name);

  // Live schema data
  const schema = useAPI<{ results: SchemaRow[] }>(
    () => getSchema().catch(() => ({ results: [] })),
    []
  );

  // Group schema by table
  const schemaByTable: Record<string, SchemaRow[]> = {};
  if (schema.data?.results) {
    for (const row of schema.data.results) {
      if (!schemaByTable[row.table_name]) schemaByTable[row.table_name] = [];
      schemaByTable[row.table_name].push(row);
    }
  }

  // Auto-generate todos for missing docs
  const autoTodos = repo.docs
    .filter((d) => d.status === 'MISSING')
    .map((d) => ({
      id: `auto-${d.file}`,
      text: `Create ${d.file}`,
      priority: 'HIGH' as const,
      done: false,
    }));

  const existingTexts = new Set(repo.todos.map((t) => t.text.toLowerCase()));
  const uniqueAutoTodos = autoTodos.filter(
    (at) => !existingTexts.has(at.text.toLowerCase())
  );
  const mergedTodos = [...repo.todos, ...uniqueAutoTodos];

  return (
    <div style={{ padding: 'var(--sp-8)', maxWidth: 1100 }}>
      {/* Back link */}
      <button
        onClick={() => navigate('/')}
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
        ← Fleet Overview
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
          {repo.name}
        </h1>
        <StatusBadge status={repo.status} />
        <div
          style={{
            display: 'flex',
            gap: 'var(--sp-4)',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
          }}
        >
          <span>{repo.tier}</span>
          <span>v{repo.doctrineVersion}</span>
          <span>{repo.syncStatus}</span>
        </div>
      </div>

      {/* Purpose */}
      <p
        style={{
          margin: '0 0 var(--sp-8)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        {repo.purpose}
      </p>

      {/* Two-column layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
        }}
      >
        <DocChecklist docs={repo.docs} repoName={repo.name} />
        <WorkPacketList packets={repo.workPackets} />
      </div>

      {/* ADR Browser */}
      {REPO_ROOTS[repo.name] && (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
          <ADRBrowser repoName={repo.name} />
        </div>
      )}

      {/* Todo panel */}
      <div style={{ marginBottom: 'var(--sp-6)' }}>
        <TodoPanel todos={mergedTodos} />
      </div>

      {/* Participates In — reverse-lookup, read-only links to process detail */}
      {participatingProcesses.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
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
            Participates In ({participatingProcesses.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {participatingProcesses.map((proc) => (
              <button
                key={proc.id}
                onClick={() => navigate(`/process/${proc.id}`)}
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'border-color var(--transition-fast)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-strong)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-xs)',
                    color: 'var(--text-muted)',
                    flexShrink: 0,
                  }}
                >
                  {proc.shortName}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}
                >
                  {proc.name}
                </span>
                <div style={{ display: 'flex', gap: 'var(--sp-2)', marginLeft: 'auto', flexShrink: 0 }}>
                  <StatusBadge status={proc.status} />
                  <StatusBadge status={proc.orbt.mode} />
                </div>
                <span
                  style={{
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-muted)',
                  }}
                >
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sub-Hub Registry (only for UT / Garage) */}
      {repo.subHubs && repo.subHubs.length > 0 && (
        <div style={{ marginBottom: 'var(--sp-6)' }}>
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
            Sub-Hub Registry ({repo.subHubs.length})
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
              gap: 'var(--sp-2)',
            }}
          >
            {repo.subHubs.map((hub) => (
              <SubHubCard key={hub.id} hub={hub} />
            ))}
          </div>
        </div>
      )}

      {/* Live Schema */}
      {!schema.error && schema.data?.results && schema.data.results.length > 0 && (
        <div>
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
            Schema ({Object.keys(schemaByTable).length} tables)
            {schema.loading && <span style={{ color: 'var(--yellow)' }}>loading...</span>}
            {!schema.loading && <span style={{ color: 'var(--green)' }}>live</span>}
            <button
              onClick={schema.refresh}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: 'var(--sp-3)',
            }}
          >
            {Object.entries(schemaByTable).slice(0, 20).map(([table, cols]) => (
              <div
                key={table}
                style={{
                  padding: 'var(--sp-3) var(--sp-4)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <div style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: 'var(--sp-2)' }}>
                  {table}
                </div>
                {cols.map((col) => (
                  <div
                    key={col.column_name}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '1px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}
                  >
                    <span style={{ color: 'var(--text-primary)' }}>{col.column_name}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{col.data_type}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
