import React from "react";
import { Badge } from "../../components/Badges";

export default function Lens(){
  const [data,setData]=React.useState(null);
  const [busy,setBusy]=React.useState(false);
  React.useEffect(()=>{ fetch('/api/lens/list').then(r=>r.json()).then(setData); },[]);
  async function open(full, mode){
    setBusy(true);
    const r = await fetch('/api/lens/open',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full,mode})}).then(r=>r.json());
    setBusy(false);
    if(r.url) location.href = r.url;
  }
  async function recall(full){
    setBusy(true);
    await fetch('/api/lens/recall',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({full})});
    setBusy(false);
  }
  if(!data) return <div style={{padding:16}}>Loading…</div>;
  return (
    <div style={{padding:16}}>
      <h2 style={{marginTop:0}}>Repo‑Lens</h2>
      <div style={{marginBottom:8,color:"#6B7280"}}>Owner: {data.owner} • {data.count} repos</div>
      <ul style={{listStyle:"none",padding:0,margin:0}}>
        {data.repos.map(r=>(
          <li key={r.full} style={{border:"1px solid #E5E7EB",borderRadius:10, padding:12, marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontWeight:600}}>{r.full}</div>
                <div style={{fontSize:12,color:"#6B7280"}}>updated {new Date(r.updatedAt).toLocaleString()}</div>
              </div>
              <div>
                <Badge ok={null} label="HEIR: n/a" />
                <Badge ok={null} label="ENV: n/a" />
                <Badge ok={null} label="Deploy: n/a" />
              </div>
            </div>
            <div style={{marginTop:8}}>
              <button disabled={busy} onClick={()=>open(r.full,'factory')}>Open in Factory</button>{' '}
              <button disabled={busy} onClick={()=>open(r.full,'mechanic')}>Open in Mechanic</button>{' '}
              <button disabled={busy} onClick={()=>recall(r.full)}>Queue Recall</button>{' '}
              <a href={`/cockpit?repo=${encodeURIComponent(r.full)}`}>(Status)</a>{' '}
              <a href={r.url} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}