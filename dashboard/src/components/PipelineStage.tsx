import type { PipelineStage as Stage, WorkPacket } from '../data/types';
import { WorkPacketCard } from './WorkPacketCard';

const stageConfig: Record<Stage, { label: string; color: string; desc: string }> = {
  PLANNER: { label: 'Planner', color: 'var(--blue)', desc: 'Planning work packet scope' },
  FREEZE: { label: 'Freeze', color: 'var(--purple)', desc: 'Awaiting human approval' },
  BUILDER: { label: 'Builder', color: 'var(--yellow)', desc: 'Executing implementation' },
  AUDITOR: { label: 'Auditor', color: 'var(--orange)', desc: 'Verifying compliance' },
  GATE: { label: 'Gate', color: 'var(--red)', desc: 'CI/mechanical checks' },
  MERGE: { label: 'Merge', color: 'var(--green)', desc: 'Passed — ready to merge' },
};

export function PipelineStageColumn({
  stage,
  packets,
}: {
  stage: Stage;
  packets: WorkPacket[];
}) {
  const config = stageConfig[stage];

  return (
    <div
      style={{
        flex: 1,
        minWidth: 180,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-2)',
      }}
    >
      {/* Stage header */}
      <div
        style={{
          padding: 'var(--sp-2) var(--sp-3)',
          borderRadius: 'var(--radius-sm)',
          borderTop: `3px solid ${config.color}`,
          background: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'var(--text-sm)',
            fontWeight: 700,
            color: config.color,
          }}
        >
          {config.label}
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            marginTop: 2,
          }}
        >
          {config.desc}
        </div>
      </div>

      {/* Cards in this stage */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-2)',
          minHeight: 60,
          padding: 'var(--sp-2)',
          background: 'var(--bg-root)',
          borderRadius: 'var(--radius-sm)',
          border: '1px dashed var(--border-subtle)',
        }}
      >
        {packets.length === 0 && (
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: 'var(--sp-4) 0',
            }}
          >
            Empty
          </div>
        )}
        {packets.map((wp) => (
          <WorkPacketCard key={wp.id} wp={wp} compact />
        ))}
      </div>
    </div>
  );
}
