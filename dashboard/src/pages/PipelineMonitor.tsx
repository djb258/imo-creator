import { fleet } from '../data/fleet';
import type { PipelineStage, WorkPacket } from '../data/types';
import { PipelineStageColumn } from '../components/PipelineStage';
import agentStatusData from '../data/agent-status.json';
import { useAPI } from '../lib/useAPI';
import { getUnclassifiedEmails, getActivityTimeline } from '../lib/api';
import { useState, useEffect } from 'react';

const stages: PipelineStage[] = ['PLANNER', 'FREEZE', 'BUILDER', 'AUDITOR', 'GATE', 'MERGE'];

interface EmailRow { email_log_id: string; subject: string; from_address: string; received_at: string; inbox: string }
interface ActivityRow { id: string; activity_type: string; subject: string; occurred_at: string; sovereign_id: string }

export function PipelineMonitor() {
  const allPackets: WorkPacket[] = fleet.flatMap((r) => r.workPackets);
  const grouped: Record<PipelineStage, WorkPacket[]> = {
    PLANNER: [], FREEZE: [], BUILDER: [], AUDITOR: [], GATE: [], MERGE: [],
  };
  for (const wp of allPackets) {
    const stage = wp.pipelineStage;
    if (stage && grouped[stage]) grouped[stage].push(wp);
  }

  // Live email triage
  const emails = useAPI<{ emails: EmailRow[] }>(() => getUnclassifiedEmails(), []);

  // Auto-refresh every 60s
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
      emails.refresh();
    }, 60_000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Live activity for first active company (demo)
  const demoSovereignId = 'demo'; // placeholder — real IDs come from fleet
  const activity = useAPI<{ timeline: ActivityRow[] }>(
    () => getActivityTimeline(demoSovereignId).catch(() => ({ timeline: [] })),
    [demoSovereignId]
  );

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
        Active work packets flowing through Planner &rarr; Builder &rarr; Auditor pipeline
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

      {/* Signal Pipeline Flow */}
      <div
        style={{
          marginTop: 'var(--sp-6)',
          padding: 'var(--sp-4)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
        }}
      >
        <h3
          style={{
            margin: '0 0 var(--sp-3)',
            fontSize: 'var(--text-sm)',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            color: 'var(--text-primary)',
          }}
        >
          Signal Pipeline Flow
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 'var(--sp-2)',
            alignItems: 'center',
            flexWrap: 'wrap',
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
          }}
        >
          {[
            { label: 'signal_output', color: 'var(--green)' },
            { label: 'bridge', color: 'var(--yellow)' },
            { label: 'signal_queue', color: 'var(--blue)' },
            { label: 'CID', color: 'var(--purple)' },
            { label: 'SID', color: 'var(--orange)' },
            { label: 'MID', color: 'var(--red)' },
          ].map((step, i, arr) => (
            <span key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
              <span
                style={{
                  padding: '2px var(--sp-2)',
                  borderRadius: 'var(--radius-sm)',
                  background: step.color,
                  color: 'var(--bg-base)',
                  fontWeight: 700,
                }}
              >
                {step.label}
              </span>
              {i < arr.length - 1 && <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Email Triage Panel */}
      <div
        style={{
          marginTop: 'var(--sp-6)',
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
            Unclassified Emails
            {emails.data?.emails && (
              <span
                style={{
                  marginLeft: 'var(--sp-2)',
                  padding: '1px var(--sp-2)',
                  borderRadius: '999px',
                  background: emails.data.emails.length > 0 ? 'var(--red-dim)' : 'var(--green-dim)',
                  color: emails.data.emails.length > 0 ? 'var(--red)' : 'var(--green)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                }}
              >
                {emails.data.emails.length}
              </span>
            )}
          </h3>
          <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
            {emails.loading && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--yellow)', fontFamily: 'var(--font-mono)' }}>
                loading...
              </span>
            )}
            {emails.error && (
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--red)', fontFamily: 'var(--font-mono)' }}>
                offline
              </span>
            )}
            <button
              onClick={emails.refresh}
              style={{
                all: 'unset',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
              }}
            >
              refresh
            </button>
          </div>
        </div>

        {emails.error && (
          <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
            Data source not connected
          </div>
        )}

        {!emails.error && emails.data?.emails && emails.data.emails.length === 0 && (
          <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--green)' }}>
            All emails classified
          </div>
        )}

        {!emails.error && emails.data?.emails && emails.data.emails.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {emails.data.emails.slice(0, 10).map((email) => (
              <div
                key={email.email_log_id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  background: 'var(--bg-raised)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: 'var(--text-muted)', minWidth: 100 }}>
                  {email.inbox}
                </span>
                <span style={{ color: 'var(--text-secondary)', minWidth: 160 }}>
                  {email.from_address?.slice(0, 30)}
                </span>
                <span style={{ color: 'var(--text-primary)', flex: 1 }}>
                  {email.subject?.slice(0, 60)}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {email.received_at ? new Date(email.received_at).toLocaleDateString() : ''}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {!activity.error && activity.data?.timeline && activity.data.timeline.length > 0 && (
        <div
          style={{
            marginTop: 'var(--sp-6)',
            padding: 'var(--sp-4)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <h3
            style={{
              margin: '0 0 var(--sp-3)',
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {activity.data.timeline.slice(0, 10).map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--sp-3)',
                  padding: 'var(--sp-2) var(--sp-3)',
                  background: 'var(--bg-raised)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                <span style={{ color: 'var(--green)', fontWeight: 600, minWidth: 100 }}>
                  {act.activity_type}
                </span>
                <span style={{ color: 'var(--text-primary)', flex: 1 }}>
                  {act.subject}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {act.occurred_at ? new Date(act.occurred_at).toLocaleDateString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

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
