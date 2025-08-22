import React from 'react';
import { useToast, Toast } from '../../src/ui/toast';
export default function NewRepo(){
  const [name,setName]=React.useState('my-app'); const {m,show,clear}=useToast();
  async function create(){
    const r = await fetch('/api/new/create',{method:'POST',headers:{'Content-Type':'application/json','x-imo-ui':process.env.NEXT_PUBLIC_API_UI_TOKEN||''},body:JSON.stringify({appName:name})}).then(r=>r.json());
    if(r.ok){ show('App scaffolded'); setTimeout(()=>{ window.open(r.wiki,'_blank'); window.location.href=r.cockpit; },750); }
    else{ show('Create failed'); setTimeout(clear,2500); }
  }
  return <div style={{padding:24,fontFamily:'system-ui'}}>
    <h2>New Repo Wizard</h2>
    <label>App Name: <input value={name} onChange={e=>setName(e.target.value)} /></label>
    <div style={{marginTop:12}}><button onClick={create}>Create</button> <a href="/lens" style={{marginLeft:12}}>Back to Lens</a></div>
    <Toast text={m}/>
  </div>;
}