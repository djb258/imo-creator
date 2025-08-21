import React from 'react';
function useQuery(){ const p=new URLSearchParams(typeof window!=='undefined'?location.search:''); return Object.fromEntries(p.entries()); }
export default function Cockpit(){
  const q=useQuery(); const repo=q.repo||''; const mode=q.mode||'factory'; const [status,setStatus]=React.useState(null); const [missions,setM]=React.useState([]);
  React.useEffect(()=>{ (async ()=>{
    const wikiName = repo?.split('/')[1]||'';
    const dashboard = ''; // optional: pass from lens if known
    const s = await fetch(`/api/cockpit/status?repo=${encodeURIComponent(repo)}&dashboard=${encodeURIComponent(dashboard)}`).then(r=>r.json());
    setStatus({...s, wiki:`/docs/wiki/${wikiName}/index.md`});
    const m = await fetch(`/api/cockpit/missions?repo=${encodeURIComponent(repo)}`).then(r=>r.json());
    setM(m.missions||[]);
  })(); },[repo]);
  async function addMission(type){ const r=await fetch('/api/cockpit/missions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({repo,type})}).then(r=>r.json()); setM(r.missions); }
  return <div style={{padding:16}}>
    <h2>Cockpit</h2>
    <div>Repo: <strong>{repo}</strong> • Mode: {mode}</div>
    {status && <div style={{margin:'8px 0'}}>
      <div>Local Path: {status.local||'(not cloned yet)'}</div>
      <div>Last Recall: {status.lastRecall? new Date(status.lastRecall).toLocaleString():'—'}</div>
      <div>Health: {status.health?.ok===null?'(unknown)':(status.health?.ok?'✅':'❌')}</div>
      <div>
        <a href={status.wiki} target="_blank" rel="noreferrer">Open Deep Wiki</a>
        &nbsp;|&nbsp; <a href={`/lens`}>Back to Lens</a>
      </div>
    </div>}
    <div style={{marginTop:12}}>
      <button onClick={()=>addMission('scaffold')}>Add Mission: Scaffold</button>
      <button onClick={()=>addMission('recall')}>Add Mission: Recall</button>
      <button onClick={()=>addMission('upgrade')}>Add Mission: Upgrade</button>
    </div>
    <h3>Missions</h3>
    <ul>{missions.map((m,i)=><li key={i}><code>{m.type}</code> {m.notes||''} <small>({new Date(m.ts).toLocaleString()})</small></li>)}</ul>
  </div>;
}