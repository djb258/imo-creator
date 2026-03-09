import { fleet } from '../data/fleet';
import type { PipelineStage, WorkPacket } from '../data/types';
import { PipelineStageColumn } from '../components/PipelineStage';
import agentStatusData from '../data/agent-status.json';

const stages: PipelineStage[] = ['PLANNER', 'FREEZE', 'BUILDER', 'AUDITOR', 'GATE', 'MERGE'];

export function PipelineMonitor() {
  // Gather all work packets across all repos
  const allPackets: WorkPacket[] = fleet.flatMap((r) => r.workPackets);

  // Group by pipeline stage
  const grouped: Record<PipelineStage, WorkPacket[]> = {
    PLANNER: [],
    FREEZE: [],
    BUILDER: [],
    AUDITOR: [],
    GATE: [],
    MERGE: [],
  };

  for (const wp of allPackets) {
    const stage = wp.pipelineStage;
    if (stage && grouped[stage]) {
      grouped[stage].push(wp);
    }
  }

  return (
    <div style={{ padding: 'var(--sp-8)' }}>
      <h1
        style={{
          margin: '0 0 var(--sp-2)',
          fontSize: 'var(--text-2xl)',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
        }}
      >
        Pipeline Monitor
      </h1>
      <p
        style={{
          margin: '0 0 var(--sp-6)',
          fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}
      >
        Active work packets flowing through Planner → Builder → Auditor pipeline
      </p>

      {/* Pipeline columns */}
      <div
        style={{
          display: 'flex',
          gap: 'var(--sp-3)',
          overflowX: 'auto',
          paddingBottom: 'var(--sp-4)',
        }}
      >
        {stages.map((stage) => (
          <PipelineStageColumn key={stage} stage={stage} packets={grouped[stage]} />
        ))}
      </div>

      {/* Agent status footer */}
      <div
        style={{
          marginTop: 'var(--sp-8)',
          padding: 'var(--sp-4)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
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
            }}
          >
            Active Agents
          </h3>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            Last updated: {new Date(agentStatusData.lastUpdated).toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {agentStatusData.agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-4)',
                padding: 'var(--sp-2) var(--sp-3)',
                background: 'var(--bg-raised)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <span style={{ color: 'var(--green)', fontWeight: 600, minWidth: 80 }}>
                {agent.id}
              </span>
              <span style={{ color: 'var(--text-secondary)', minWidth: 160 }}>
                {agent.repo}
              </span>
              <span style={{ color: 'var(--text-muted)', minWidth: 80 }}>
                {agent.workPacket}
              </span>
              <span style={{ color: 'var(--yellow)' }}>{agent.currentPhase}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
