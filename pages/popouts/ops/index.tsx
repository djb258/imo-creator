import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function OpsPop() {
  const { repo, mode } = getQuery();
  const healthHref = `/cockpit?repo=${encodeURIComponent(repo)}&mode=${encodeURIComponent(mode)}`;
  return (
    <div style={wrap}>
      <header style={hdr}>OPS • {repo || '(none)'} • {mode}</header>
      <div style={{display:'flex',gap:12,padding:10,borderBottom:'1px solid #eee'}}>
        <a href="/lens" target="_blank" rel="noreferrer">Repo‑Lens</a>
        <a href={healthHref} target="_blank" rel="noreferrer">Cockpit Status</a>
        <a href="/logs" target="_blank" rel="noreferrer">Logs (Sidecar/HEIR)</a>
      </div>
      <div style={{padding:12, color:'#666', fontSize:13}}>
        Keep this on your Ops screen for missions, recalls, health badges, and error feed to master_error_log.
      </div>
    </div>
  );
}
const wrap: React.CSSProperties = { height:'100vh', display:'flex', flexDirection:'column', background:'#fff' };
const hdr:  React.CSSProperties = { padding:10, borderBottom:'1px solid #eee', fontWeight:600 };