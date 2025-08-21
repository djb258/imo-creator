import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function WikiPop() {
  const { repo } = getQuery();
  const wiki = repo ? `/docs/wiki/${repo.split('/')[1]}/index.md` : '/docs/wiki';
  return (
    <div style={wrap}>
      <header style={hdr}>WIKI • {repo || '(no repo selected)'}</header>
      <div style={{padding:12}}>
        <a href={wiki} target="_blank" rel="noreferrer">Open Deep Wiki</a>
        <div style={{marginTop:8, color:'#777', fontSize:12}}>This opens your auto‑generated Christmas‑tree docs (Input → Middle → Output).</div>
      </div>
      <iframe src={wiki} style={frame} title="wiki" />
    </div>
  );
}
const wrap: React.CSSProperties = { height:'100vh', display:'flex', flexDirection:'column', background:'#fff' };
const hdr:  React.CSSProperties = { padding:10, borderBottom:'1px solid #eee', fontWeight:600 };
const frame:React.CSSProperties = { flex:1, border:'none', background:'#fcfcfc' };