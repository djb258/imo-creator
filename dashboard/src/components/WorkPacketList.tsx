import type { WorkPacket } from '../data/types';
import { WorkPacketCard } from './WorkPacketCard';

export function WorkPacketList({ packets }: { packets: WorkPacket[] }) {
  const active = packets.filter((p) => p.status !== 'COMPLETE');
  const completed = packets.filter((p) => p.status === 'COMPLETE');

  return (
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
        }}
      >
        Work Packets
      </h3>

      {packets.length === 0 && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
          No work packets
        </div>
      )}

      {active.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
          {active.map((wp) => (
            <WorkPacketCard key={wp.id} wp={wp} />
          ))}
        </div>
      )}

      {completed.length > 0 && (
        <div style={{ marginTop: 'var(--sp-3)' }}>
          <div
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--text-muted)',
              marginBottom: 'var(--sp-2)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Completed
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            {completed.map((wp) => (
              <WorkPacketCard key={wp.id} wp={wp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
