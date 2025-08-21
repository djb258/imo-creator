import React from 'react';
export default function Lens(){
  const [data,setData]=React.useState(null); const [busy,setBusy]=React.useState(false);
  React.useEffect(()=>{ fetch('/api/lens/list').then(r=>r.json()).then(setData); },[]);
  async function open(full, mode){ setBusy(true); const r=await fetch('/api/lens/open',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full,mode})}).then(r=>r.json()); setBusy(false); if(r.url) location.href=r.url; }
  async function recall(full){ setBusy(true); await fetch('/api/lens/recall',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full})}); setBusy(false); }
  if(!data) return <div>Loading…</div>;
  return <div style={{padding:16}}>
    <h2>Repo‑Lens</h2>
    <div>Owner: {data.owner} • Repos: {data.count}</div>
    <ul>
      {data.repos.map(r=>(<li key={r.full}>
        <strong>{r.full}</strong> &nbsp; <small>updated {new Date(r.updatedAt).toLocaleString()}</small>
        &nbsp; <button disabled={busy} onClick={()=>open(r.full,'factory')}>Open in Factory</button>
        &nbsp; <button disabled={busy} onClick={()=>open(r.full,'mechanic')}>Open in Mechanic</button>
        &nbsp; <button disabled={busy} onClick={()=>recall(r.full)}>Queue Recall</button>
        &nbsp; <a href={`/cockpit?repo=${encodeURIComponent(r.full)}`}>(Status)</a>
        &nbsp; <a href={`/docs/wiki/${encodeURIComponent(r.name)}/index.md`} target="_blank" rel="noreferrer">Wiki</a>
        &nbsp; <a href={r.url} target="_blank" rel="noreferrer">GitHub</a>
      </li>))}
    </ul>
  </div>;
}