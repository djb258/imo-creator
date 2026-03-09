import type { WorkPacket } from '../data/types';
import { StatusBadge } from './StatusBadge';

const stageColor: Record<string, string> = {
  PLANNER: 'var(--blue)',
  FREEZE: 'var(--purple)',
  BUILDER: 'var(--yellow)',
  AUDITOR: 'var(--orange)',
  GATE: 'var(--red)',
  MERGE: 'var(--green)',
};

export function WorkPacketCard({ wp, compact }: { wp: WorkPacket; compact?: boolean }) {
  const borderColor = wp.pipelineStage ? stageColor[wp.pipelineStage] ?? 'var(--border-default)' : 'var(--border-default)';

  if (compact) {
    return (
      <div
        style={{
          padding: 'var(--sp-3)',
          background: 'var(--bg-raised)',
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: 'var(--radius-sm)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-2)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-primary)',
              fontWeight: 600,
            }}
          >
            {wp.id}
          </span>
          <StatusBadge status={wp.status} />
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-secondary)',
            marginTop: 'var(--sp-1)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {wp.title}
        </div>
        {wp.agent && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)',
              marginTop: 'var(--sp-1)',
            }}
          >
            {wp.agent} · {wp.currentPhase}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 'var(--sp-4)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 'var(--radius-md)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--sp-2)',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--text-sm)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            {wp.id}
          </div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginTop: 2 }}>
            {wp.title}
          </div>
        </div>
        <StatusBadge status={wp.status} />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 'var(--sp-4)',
          marginTop: 'var(--sp-3)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        {wp.agent && <span>Agent: {wp.agent}</span>}
        {wp.currentPhase && <span>{wp.currentPhase}</span>}
        {wp.pipelineStage && (
          <span style={{ color: stageColor[wp.pipelineStage] }}>
            {wp.pipelineStage}
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
          marginTop: 'var(--sp-2)',
        }}
      >
        Updated {new Date(wp.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
