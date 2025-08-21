import React from 'react';
import { getQuery } from '../../src/shared/query';
import { openPopout } from '../../src/shared/popout';

export default function Launchpad() {
  const { repo, mode } = getQuery();
  const ctx = `?repo=${encodeURIComponent(repo)}&mode=${encodeURIComponent(mode)}`;

  return (
    <div style={{padding:24,fontFamily:'system-ui, sans-serif'}}>
      <h2>IMO Launchpad</h2>
      <div style={{margin:'8px 0',color:'#666'}}>Context → repo: <b>{repo || '(none)'}</b> • mode: <b>{mode}</b></div>
      <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
        <button onClick={()=>openPopout('code', `/popouts/code${ctx}`)} style={btn}>Open CODE Window</button>
        <button onClick={()=>openPopout('wiki', `/popouts/wiki${ctx}`)} style={btn}>Open WIKI Window</button>
        <button onClick={()=>openPopout('ops',  `/popouts/ops${ctx}`)}  style={btn}>Open OPS Window</button>
        <button onClick={()=>{ openPopout('code', `/popouts/code${ctx}`); openPopout('wiki', `/popouts/wiki${ctx}`); openPopout('ops', `/popouts/ops${ctx}`); }} style={btnPrimary}>Open ALL 3</button>
      </div>
      <p style={{marginTop:12,color:'#888',fontSize:12}}>
        Tip: allow pop‑ups for this site so each opens in its own window. Positions/sizes persist per window.
      </p>
    </div>
  );
}
const btn: React.CSSProperties = { padding:'10px 16px', border:'1px solid #ccc', borderRadius:6, background:'#fafafa', cursor:'pointer' };
const btnPrimary: React.CSSProperties = { ...btn, background:'#0d6efd', color:'#fff', borderColor:'#0d6efd' };