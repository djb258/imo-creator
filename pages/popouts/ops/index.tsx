import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function OpsPop(){
  const { repo, mode } = getQuery();
  return <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
    <header style={{padding:10,borderBottom:'1px solid #eee'}}>OPS • {repo||'(none)'} • {mode}</header>
    <div style={{display:'flex',gap:12,padding:10,borderBottom:'1px solid #eee'}}>
      <a href="/lens" target="_blank" rel="noreferrer">Repo‑Lens</a>
      <a href={`/cockpit?repo=${encodeURIComponent(repo)}&mode=${encodeURIComponent(mode)}`} target="_blank" rel="noreferrer">Cockpit Status</a>
      <a href="/logs" target="_blank" rel="noreferrer">Logs</a>
    </div>
    <div style={{padding:12,color:'#666',fontSize:13}}>Keep this window on your Ops screen for recalls, health, missions, and error feed.</div>
  </div>;
}