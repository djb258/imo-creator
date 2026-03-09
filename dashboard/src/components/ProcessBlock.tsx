import type { Process } from '../data/types';
import { StatusBadge } from './StatusBadge';

export function ProcessBlock({ process }: { process: Process }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Key */}
      <ProcessKey />

      {/* HEIR */}
      <div>
        <SectionHeader>HEIR</SectionHeader>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-1)' }}>
          {process.heir.repos.map((r) => (
            <Badge key={r} label={r} color="var(--blue)" bg="var(--blue-dim)" />
          ))}
          {process.heir.subHubs?.map((s) => (
            <Badge key={s} label={s} color="var(--purple)" bg="var(--purple-dim)" />
          ))}
          {process.heir.tools?.map((t) => (
            <Badge key={t} label={t} color="var(--green)" bg="var(--green-dim)" />
          ))}
          {process.heir.services?.map((s) => (
            <Badge key={s} label={s} color="var(--orange)" bg="var(--orange-dim)" />
          ))}
          {process.heir.skills?.map((sk) => (
            <Badge key={sk} label={sk} color="var(--accent)" bg="var(--bg-hover)" />
          ))}
        </div>
      </div>

      {/* IMO */}
      <div>
        <SectionHeader>IMO</SectionHeader>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1fr',
            gap: 'var(--sp-2)',
            alignItems: 'stretch',
          }}
        >
          <IMOColumn title="Ingress">
            <IMORow label="Trigger" value={process.imo.ingress.trigger} />
            <IMORow label="Schema" value={process.imo.ingress.schema} mono />
          </IMOColumn>
          <Arrow />
          <IMOColumn title="Middle">
            <IMOList label="Steps" items={process.imo.middle.steps} />
            <IMOList label="Decisions" items={process.imo.middle.decisions} />
            <IMOList label="State Tables" items={process.imo.middle.stateTables} mono />
          </IMOColumn>
          <Arrow />
          <IMOColumn title="Egress">
            <IMOList label="Outputs" items={process.imo.egress.outputs} mono />
            <IMOList label="Consumers" items={process.imo.egress.consumers} />
          </IMOColumn>
        </div>
      </div>

      {/* ERD */}
      <div>
        <SectionHeader>ERD</SectionHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 1fr 80px',
              gap: 'var(--sp-2)',
              padding: '4px var(--sp-2)',
              fontSize: 'var(--text-xs)',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <span>#</span>
            <span>Table</span>
            <span>Repo</span>
            <span>Access</span>
          </div>
          {process.erd.tables.map((t) => (
            <div
              key={`${t.table}-${t.order}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 1fr 80px',
                gap: 'var(--sp-2)',
                padding: '4px var(--sp-2)',
                fontSize: 'var(--text-xs)',
                background: t.order % 2 === 0 ? 'var(--bg-raised)' : 'transparent',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {t.order}
              </span>
              <span style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                {t.table}
              </span>
              <span style={{ color: 'var(--text-secondary)' }}>{t.repo}</span>
              <Badge
                label={t.access}
                color={
                  t.access === 'WRITE'
                    ? 'var(--orange)'
                    : t.access === 'READ'
                      ? 'var(--green)'
                      : 'var(--yellow)'
                }
                bg={
                  t.access === 'WRITE'
                    ? 'var(--orange-dim)'
                    : t.access === 'READ'
                      ? 'var(--green-dim)'
                      : 'var(--yellow-dim)'
                }
              />
            </div>
          ))}
        </div>
      </div>

      {/* ORBT + CTB — two-column bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
        <div>
          <SectionHeader>ORBT</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <div style={{ display: 'flex', gap: 'var(--sp-2)', alignItems: 'center' }}>
              <StatusBadge status={process.orbt.mode} />
              <StatusBadge status={process.orbt.health} />
            </div>
            {process.orbt.notes && (
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {process.orbt.notes}
              </div>
            )}
          </div>
        </div>
        <div>
          <SectionHeader>CTB</SectionHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <CTBRow label="Canonical" items={process.ctb.canonicalTables} />
            <CTBRow label="Error" items={process.ctb.errorTables} />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
              <span>Promotion: </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                }}
              >
                {process.ctb.promotionPath.join(' → ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessKey() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 'var(--sp-3)',
        padding: 'var(--sp-3) var(--sp-4)',
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-sm)',
        alignItems: 'center',
      }}
    >
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginRight: 'var(--sp-1)',
        }}
      >
        Key
      </span>
      <KeyItem color="var(--blue)" bg="var(--blue-dim)" label="Repo" />
      <KeyItem color="var(--purple)" bg="var(--purple-dim)" label="Sub-Hub" />
      <KeyItem color="var(--green)" bg="var(--green-dim)" label="Tool" />
      <KeyItem color="var(--orange)" bg="var(--orange-dim)" label="Service" />
      <KeyItem color="var(--accent)" bg="var(--bg-hover)" label="Skill" />
      <span style={{ width: 1, height: 16, background: 'var(--border-subtle)', flexShrink: 0 }} />
      <KeyItem color="var(--green)" bg="var(--green-dim)" label="READ" />
      <KeyItem color="var(--orange)" bg="var(--orange-dim)" label="WRITE" />
      <KeyItem color="var(--yellow)" bg="var(--yellow-dim)" label="READ/WRITE" />
    </div>
  );
}

function KeyItem({ color, label }: { color: string; bg?: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          display: 'inline-block',
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-secondary)',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SectionHeader({ children }: { children: string }) {
  return (
    <div
      style={{
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        color: 'var(--text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 'var(--sp-2)',
      }}
    >
      {children}
    </div>
  );
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '1px var(--sp-2)',
        borderRadius: '999px',
        background: bg,
        color,
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

function Arrow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: 'var(--text-sm)',
        paddingTop: 'var(--sp-5)',
      }}
    >
      →
    </div>
  );
}

function IMOColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--sp-3)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-2)',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontWeight: 700,
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function IMORow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.5 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
      <span
        style={{
          color: 'var(--text-secondary)',
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
        }}
      >
        {value}
      </span>
    </div>
  );
}

function IMOList({ label, items, mono }: { label: string; items: string[]; mono?: boolean }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)' }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <ul
        style={{
          margin: 0,
          paddingLeft: 'var(--sp-4)',
          color: 'var(--text-secondary)',
          fontFamily: mono ? 'var(--font-mono)' : 'inherit',
          lineHeight: 1.6,
        }}
      >
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function CTBRow({ label, items }: { label: string; items: string[] }) {
  return (
    <div style={{ fontSize: 'var(--text-xs)' }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
        {items.join(', ')}
      </span>
    </div>
  );
}
