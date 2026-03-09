import type { TodoItem } from '../data/types';
import { StatusBadge } from './StatusBadge';

export function TodoPanel({ todos }: { todos: TodoItem[] }) {
  const sorted = [...todos].sort((a, b) => {
    const order = { CRITICAL: 0, HIGH: 1, NORMAL: 2 };
    return order[a.priority] - order[b.priority];
  });

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
        Todo
      </h3>
      {sorted.length === 0 && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>All clear</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        {sorted.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              padding: 'var(--sp-2) var(--sp-3)',
              background: 'var(--bg-raised)',
              borderRadius: 'var(--radius-sm)',
              opacity: t.done ? 0.5 : 1,
            }}
          >
            <span
              style={{
                width: 14,
                height: 14,
                borderRadius: 3,
                border: t.done
                  ? '2px solid var(--green)'
                  : '2px solid var(--border-default)',
                background: t.done ? 'var(--green)' : 'transparent',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 9,
                color: 'var(--text-inverse)',
              }}
            >
              {t.done && '✓'}
            </span>
            <span
              style={{
                flex: 1,
                fontSize: 'var(--text-xs)',
                color: 'var(--text-secondary)',
                textDecoration: t.done ? 'line-through' : 'none',
              }}
            >
              {t.text}
            </span>
            <StatusBadge status={t.priority} />
          </div>
        ))}
      </div>
    </div>
  );
}
