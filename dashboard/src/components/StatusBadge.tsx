import type { ImplStatus, WPStatus, DocStatus, Priority, ORBTMode, HealthStatus } from '../data/types';

type BadgeType = ImplStatus | WPStatus | DocStatus | Priority | ORBTMode | HealthStatus;

const colorMap: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIVE: { bg: 'var(--green-dim)', text: 'var(--green)', dot: 'var(--green)' },
  PRESENT: { bg: 'var(--green-dim)', text: 'var(--green)', dot: 'var(--green)' },
  COMPLETE: { bg: 'var(--green-dim)', text: 'var(--green)', dot: 'var(--green)' },
  IN_PROGRESS: { bg: 'var(--yellow-dim)', text: 'var(--yellow)', dot: 'var(--yellow)' },
  SKELETON: { bg: 'var(--blue-dim)', text: 'var(--blue)', dot: 'var(--blue)' },
  PENDING: { bg: 'var(--gray-dim)', text: 'var(--gray)', dot: 'var(--gray)' },
  PLANNED: { bg: 'var(--purple-dim)', text: 'var(--purple)', dot: 'var(--purple)' },
  MISSING: { bg: 'var(--red-dim)', text: 'var(--red)', dot: 'var(--red)' },
  CRITICAL: { bg: 'var(--red-dim)', text: 'var(--red)', dot: 'var(--red)' },
  HIGH: { bg: 'var(--orange-dim)', text: 'var(--orange)', dot: 'var(--orange)' },
  NORMAL: { bg: 'var(--gray-dim)', text: 'var(--text-secondary)', dot: 'var(--gray)' },
  OPERATE: { bg: 'var(--green-dim)', text: 'var(--green)', dot: 'var(--green)' },
  REPAIR: { bg: 'var(--orange-dim)', text: 'var(--orange)', dot: 'var(--orange)' },
  BUILD: { bg: 'var(--blue-dim)', text: 'var(--blue)', dot: 'var(--blue)' },
  TROUBLESHOOT: { bg: 'var(--red-dim)', text: 'var(--red)', dot: 'var(--red)' },
  GREEN: { bg: 'var(--green-dim)', text: 'var(--green)', dot: 'var(--green)' },
  YELLOW: { bg: 'var(--yellow-dim)', text: 'var(--yellow)', dot: 'var(--yellow)' },
  RED: { bg: 'var(--red-dim)', text: 'var(--red)', dot: 'var(--red)' },
};

export function StatusBadge({ status }: { status: BadgeType }) {
  const colors = colorMap[status] ?? colorMap.NORMAL;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--sp-1)',
        padding: '2px var(--sp-2)',
        borderRadius: '999px',
        background: colors.bg,
        color: colors.text,
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        lineHeight: 1.6,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.dot,
          flexShrink: 0,
        }}
      />
      {status.replace('_', ' ')}
    </span>
  );
}
