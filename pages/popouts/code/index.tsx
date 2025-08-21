import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function CodePop() {
  const { repo, mode } = getQuery();
  const url = process.env.NEXT_PUBLIC_CODE_SERVER_URL || '';
  return (
    <div style={wrap}>
      <header style={hdr}>CODE • {repo || '(none)'} • {mode}</header>
      {url ? <iframe src={url} style={frame} title="code" /> :
        <div style={msg}>
          <b>No code‑server configured.</b>
          <div>Open local VS Code for this repo, or set <code>NEXT_PUBLIC_CODE_SERVER_URL</code> in your env to embed it here.</div>
        </div>}
    </div>
  );
}
const wrap: React.CSSProperties = { height:'100vh', display:'flex', flexDirection:'column', background:'#fff' };
const hdr:  React.CSSProperties = { padding:10, borderBottom:'1px solid #eee', fontWeight:600 };
const frame:React.CSSProperties = { flex:1, border:'none' };
const msg:  React.CSSProperties = { padding:16, color:'#444' };