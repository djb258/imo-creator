import React from 'react';
function useQuery(){ const p=new URLSearchParams(typeof window!=='undefined'?location.search:''); return Object.fromEntries(p.entries()) as any; }
export default function Cockpit(){
  const q=useQuery(); const repo=q.repo||''; const mode=q.mode||'factory';
  const [status,setStatus]=React.useState<any>(null);
  React.useEffect(()=>{ (async ()=>{
    const s = await fetch(`/api/cockpit/status?repo=${encodeURIComponent(repo)}`,{headers:{'x-imo-ui':process.env.NEXT_PUBLIC_API_UI_TOKEN||''}}).then(r=>r.json());
    const wikiName = repo?.split('/')[1]||'';
    setStatus({...s, wiki:`/docs/wiki/${wikiName}/index.md`});
  })(); },[repo]);
  async function addMission(type:string){
    await fetch('/api/cockpit/missions',{method:'POST',headers:{'Content-Type':'application/json','x-imo-ui':process.env.NEXT_PUBLIC_API_UI_TOKEN||''},body:JSON.stringify({repo,type})});
  }
  return <div style={{padding:16,fontFamily:'system-ui'}}>
    <h2>Cockpit</h2>
    <div>Repo: <b>{repo}</b> • Mode: <b>{mode}</b> • <a href="/launchpad" target="_blank" rel="noreferrer">Launchpad</a></div>
    {status && <div style={{margin:'8px 0'}}>
      <div>Local Path: {status.local||'(not cloned yet)'}</div>
      <div>Last Recall: {status.lastRecall? new Date(status.lastRecall).toLocaleString():'—'}</div>
      <div>Health: {status.health?.ok===null?'(unknown)':(status.health?.ok?'✅':'❌')}</div>
      <div><a href={status.wiki} target="_blank" rel="noreferrer">Open Deep Wiki</a></div>
    </div>}
    <div style={{marginTop:12}}>
      <button onClick={()=>addMission('scaffold')}>Mission: Scaffold</button>
      <button onClick={()=>addMission('recall')}>Mission: Recall</button>
      <button onClick={()=>addMission('upgrade')}>Mission: Upgrade</button>
    </div>
  </div>;
}