import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import type { Process } from '../data/types';

let mermaidCounter = 0;

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    primaryColor: '#2563eb',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#3b82f6',
    secondaryColor: '#7c3aed',
    tertiaryColor: '#1e293b',
    lineColor: '#64748b',
    textColor: '#e2e8f0',
    mainBkg: '#1e293b',
    nodeBorder: '#3b82f6',
    clusterBkg: '#0f172a',
    clusterBorder: '#334155',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#1e293b',
    nodeTextColor: '#e2e8f0',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 12,
  },
});

function buildDiagram(process: Process): string {
  const lines: string[] = ['flowchart LR'];

  // Escape mermaid special chars — be aggressive to avoid parse errors
  const esc = (s: string) =>
    s.replace(/[[\](){}|<>#&"]/g, ' ').replace(/\./g, '_').trim();

  // Short label helper — truncate long strings
  const short = (s: string, max = 40) => {
    const cleaned = esc(s);
    return cleaned.length > max ? cleaned.substring(0, max) + '...' : cleaned;
  };

  // ── Hub node (the process itself) ──
  const hubLabel = `${esc(process.shortName)} - ${esc(process.name)}`;
  lines.push(`  HUB["${hubLabel}"]`);
  lines.push(`  style HUB fill:#2563eb,stroke:#3b82f6,color:#fff,stroke-width:3px`);

  // ── Ingress node ──
  const ingressLabel = short(process.imo.ingress.trigger, 50);
  lines.push(`  ING["${ingressLabel}"]`);
  lines.push(`  style ING fill:#166534,stroke:#22c55e,color:#fff`);
  lines.push(`  ING -->|trigger| HUB`);

  // ── Sub-hubs as spokes ──
  const subHubs = process.heir.subHubs ?? [];
  const tablesBySubHub = new Map<string, typeof process.erd.tables>();
  for (const sh of subHubs) {
    tablesBySubHub.set(sh, []);
  }
  for (const t of process.erd.tables) {
    const tableLower = t.table.toLowerCase();
    let matched = false;
    for (const sh of subHubs) {
      const shLower = sh.toLowerCase().replace(/-/g, '_');
      if (tableLower.includes(shLower) || shLower.includes(tableLower.split('.')[0])) {
        tablesBySubHub.get(sh)!.push(t);
        matched = true;
        break;
      }
    }
    if (!matched) {
      if (!tablesBySubHub.has('_other')) tablesBySubHub.set('_other', []);
      tablesBySubHub.get('_other')!.push(t);
    }
  }

  let shIdx = 0;
  for (const sh of subHubs) {
    const shId = `SH${shIdx}`;
    const tables = tablesBySubHub.get(sh) ?? [];

    if (tables.length > 0) {
      lines.push(`  subgraph ${shId}["${esc(sh)}"]`);
      for (const t of tables) {
        const tId = `T${shIdx}_${t.order}`;
        const accessIcon = t.access === 'READ' ? 'R' : t.access === 'WRITE' ? 'W' : 'RW';
        lines.push(`    ${tId}["${accessIcon}: ${esc(t.table)}"]`);
        if (t.access === 'READ') {
          lines.push(`    style ${tId} fill:#166534,stroke:#22c55e,color:#dcfce7`);
        } else if (t.access === 'WRITE') {
          lines.push(`    style ${tId} fill:#9a3412,stroke:#f97316,color:#ffedd5`);
        } else {
          lines.push(`    style ${tId} fill:#854d0e,stroke:#eab308,color:#fef9c3`);
        }
      }
      lines.push(`  end`);
      lines.push(`  style ${shId} fill:#0f172a,stroke:#7c3aed,color:#c4b5fd`);

      const hasWrites = tables.some(t => t.access === 'WRITE' || t.access === 'READ/WRITE');
      const hasReads = tables.some(t => t.access === 'READ' || t.access === 'READ/WRITE');
      if (hasWrites && hasReads) {
        lines.push(`  HUB --- ${shId}`);
      } else if (hasWrites) {
        lines.push(`  HUB -->|write| ${shId}`);
      } else {
        lines.push(`  ${shId} -->|read| HUB`);
      }
    } else {
      lines.push(`  ${shId}(["${esc(sh)}"])`);
      lines.push(`  style ${shId} fill:#2e1065,stroke:#7c3aed,color:#c4b5fd`);
      lines.push(`  HUB --- ${shId}`);
    }
    shIdx++;
  }

  // ── Unmatched tables ──
  const otherTables = tablesBySubHub.get('_other') ?? [];
  if (otherTables.length > 0) {
    lines.push(`  subgraph OTHER["Other Tables"]`);
    for (const t of otherTables) {
      const tId = `TO_${t.order}`;
      const accessIcon = t.access === 'READ' ? 'R' : t.access === 'WRITE' ? 'W' : 'RW';
      lines.push(`    ${tId}["${accessIcon}: ${esc(t.table)}"]`);
    }
    lines.push(`  end`);
    lines.push(`  HUB --- OTHER`);
  }

  // ── Tools as spokes ──
  const tools = process.heir.tools ?? [];
  for (let i = 0; i < tools.length; i++) {
    const id = `TOOL${i}`;
    lines.push(`  ${id}["${esc(tools[i])}"]`);
    lines.push(`  style ${id} fill:#166534,stroke:#22c55e,color:#dcfce7`);
    lines.push(`  ${id} -.->|tool| HUB`);
  }

  // ── Services as spokes ──
  const services = process.heir.services ?? [];
  for (let i = 0; i < services.length; i++) {
    const id = `SVC${i}`;
    lines.push(`  ${id}["${esc(services[i])}"]`);
    lines.push(`  style ${id} fill:#9a3412,stroke:#f97316,color:#ffedd5`);
    lines.push(`  ${id} -.->|service| HUB`);
  }

  // ── Egress outputs ──
  for (let i = 0; i < process.imo.egress.outputs.length; i++) {
    const id = `EGR${i}`;
    lines.push(`  ${id}["${short(process.imo.egress.outputs[i], 45)}"]`);
    lines.push(`  style ${id} fill:#1e40af,stroke:#3b82f6,color:#dbeafe`);
    lines.push(`  HUB -->|output| ${id}`);
  }

  // ── Consumers ──
  for (let i = 0; i < process.imo.egress.consumers.length; i++) {
    const id = `CON${i}`;
    lines.push(`  ${id}(("${esc(process.imo.egress.consumers[i])}"))`);
    lines.push(`  style ${id} fill:#334155,stroke:#64748b,color:#e2e8f0`);
    lines.push(`  HUB -->|feeds| ${id}`);
  }

  return lines.join('\n');
}

export function ProcessMermaid({ process }: { process: Process }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [rawDef, setRawDef] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      if (!containerRef.current) return;

      // Generate a unique ID every render to avoid Mermaid's ID cache
      const uniqueId = `mmd-${process.id}-${++mermaidCounter}`;
      const diagramDef = buildDiagram(process);
      setRawDef(diagramDef);

      try {
        // Remove any leftover temp element from prior renders
        const stale = document.getElementById(uniqueId);
        if (stale) stale.remove();

        const { svg } = await mermaid.render(uniqueId, diagramDef);
        if (cancelled) return;
        containerRef.current.innerHTML = svg;

        // Make SVG responsive
        const svgEl = containerRef.current.querySelector('svg');
        if (svgEl) {
          svgEl.style.maxWidth = '100%';
          svgEl.style.height = 'auto';
        }
        setError(null);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Diagram render failed';
        setError(msg);
        // Clean up the temp element Mermaid may have left in the DOM
        const orphan = document.getElementById('d' + uniqueId);
        if (orphan) orphan.remove();
      }
    };
    render();
    return () => { cancelled = true; };
  }, [process]);

  return (
    <div
      style={{
        background: 'var(--bg-raised)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--sp-5)',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 'var(--sp-4)',
        }}
      >
        Hub & Spoke Diagram
      </div>
      {error && (
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--red)', marginBottom: 'var(--sp-2)' }}>
          Render error: {error}
        </div>
      )}
      <div ref={containerRef} style={{ minHeight: 200 }} />

      {/* Show raw definition on error for debugging */}
      {error && rawDef && (
        <pre
          style={{
            fontSize: 'var(--text-xs)',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-muted)',
            background: 'var(--bg-surface)',
            padding: 'var(--sp-3)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'auto',
            marginTop: 'var(--sp-2)',
            whiteSpace: 'pre-wrap',
          }}
        >
          {rawDef}
        </pre>
      )}

      {/* Diagram legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 'var(--sp-3)',
          marginTop: 'var(--sp-4)',
          paddingTop: 'var(--sp-3)',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-mono)',
          color: 'var(--text-muted)',
        }}
      >
        <LegendItem color="#2563eb" label="Process (Hub)" />
        <LegendItem color="#7c3aed" label="Sub-Hub (Spoke)" />
        <LegendItem color="#22c55e" label="Tool / READ" />
        <LegendItem color="#f97316" label="Service / WRITE" />
        <LegendItem color="#eab308" label="READ/WRITE" />
        <LegendItem color="#3b82f6" label="Output" />
        <LegendItem color="#64748b" label="Consumer" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: 2,
          background: color,
          flexShrink: 0,
        }}
      />
      <span>{label}</span>
    </div>
  );
}
