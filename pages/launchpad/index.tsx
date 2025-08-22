import React from 'react';
import { getQuery } from '../../src/shared/query';
import { openWin } from '../../src/shared/popout';
export default function Launchpad(){
  const { repo, mode } = getQuery(); const ctx = `?repo=${encodeURIComponent(repo)}&mode=${encodeURIComponent(mode)}`;
  return <div style={{padding:24,fontFamily:'system-ui'}}>
    <h2>Launchpad</h2>
    <div style={{color:'#666'}}>Context → repo: <b>{repo||'(none)'}</b> • mode: <b>{mode}</b></div>
    <div style={{display:'flex',gap:12,marginTop:8}}>
      <button onClick={()=>openWin('code', `/popouts/code${ctx}`)}>Open CODE Window</button>
      <button onClick={()=>openWin('wiki', `/popouts/wiki${ctx}`)}>Open WIKI Window</button>
      <button onClick={()=>openWin('ops',  `/popouts/ops${ctx}`)}>Open OPS Window</button>
      <button onClick={()=>{openWin('code', `/popouts/code${ctx}`);openWin('wiki', `/popouts/wiki${ctx}`);openWin('ops', `/popouts/ops${ctx}`);}}>Open ALL 3</button>
    </div>
    <div style={{marginTop:12}}><a href="/lens">Back to Lens</a></div>
  </div>;
}