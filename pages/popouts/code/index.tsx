import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function CodePop(){
  const { repo, mode } = getQuery();
  const url = process.env.NEXT_PUBLIC_CODE_SERVER_URL || '';
  return <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
    <header style={{padding:10,borderBottom:'1px solid #eee'}}>CODE • {repo||'(none)'} • {mode}</header>
    {url? <iframe src={url} style={{flex:1,border:'none'}}/> : <div style={{padding:16}}>Set <code>NEXT_PUBLIC_CODE_SERVER_URL</code> to embed code-server, or open local VS Code manually.</div>}
  </div>;
}