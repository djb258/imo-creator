import React from "react";
import CockpitLayout from "../../components/CockpitLayout";
import { Badge, Stat } from "../../components/Badges";

function useQuery(){ const p=new URLSearchParams(typeof window!=='undefined'?location.search:''); return Object.fromEntries(p.entries()); }

export default function Cockpit(){
  const q=useQuery();
  const repo=q.repo||''; const mode=q.mode||'factory';
  const [status,setStatus]=React.useState(null);
  const [busy,setBusy]=React.useState(false);
  const wikiName = repo?.split('/')[1]||'';
  React.useEffect(()=>{ (async ()=>{
    const s = await fetch(`/api/cockpit/status?repo=${encodeURIComponent(repo)}`).then(r=>r.json());
    setStatus({...s, wiki:`/docs/wiki/${wikiName}/index.md`});
  })(); },[repo]);

  async function addMission(type){
    await fetch('/api/cockpit/missions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({repo,type})});
  }
  async function eject(){
    setBusy(true);
    const r = await fetch('/api/cockpit/eject',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({repo})}).then(r=>r.json());
    setBusy(false);
    alert(r.ok ? `Ejected OK. Tag: ${r.next.tag}` : `HEIR failed. See logs.`);
  }

  return (
    <CockpitLayout title="Cockpit"
      right={<div>
        <a href="/lens" style={{marginRight:12}}>Back to Lens</a>
        <button disabled={busy} onClick={eject}>Finalize & Eject</button>
      </div>}
    >
      <div style={{border:"1px solid #E5E7EB",borderRadius:10,padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontSize:12,color:"#6B7280"}}>Repo</div><div style={{fontWeight:600}}>{repo}</div></div>
          <div>
            <Badge ok={status?.health?.ok} label="Health" />
            <Badge ok={status?.heir} label="HEIR" />
            <Badge ok={status?.env} label="Env" />
            <span style={{marginLeft:12,fontSize:12,color:"#6B7280"}}>Mode: {mode}</span>
          </div>
        </div>
        <div style={{display:"flex",marginTop:10}}>
          <Stat label="Local Path" value={status?.local || "—"} />
          <Stat label="Last Recall" value={status?.lastRecall ? new Date(status.lastRecall).toLocaleString() : "—"} />
        </div>
        <div style={{marginTop:10}}>
          <a href={status?.wiki} target="_blank" rel="noreferrer">Open Deep Wiki</a>
        </div>
      </div>

      <div style={{border:"1px solid #E5E7EB",borderRadius:10,padding:12}}>
        <div style={{fontWeight:600, marginBottom:8}}>Missions</div>
        <button onClick={()=>addMission('scaffold')}>Add: Scaffold</button>{' '}
        <button onClick={()=>addMission('recall')}>Add: Recall</button>{' '}
        <button onClick={()=>addMission('upgrade')}>Add: Upgrade</button>
      </div>
    </CockpitLayout>
  );
}