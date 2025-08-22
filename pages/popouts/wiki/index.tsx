import React from 'react';
import { getQuery } from '../../../src/shared/query';
export default function WikiPop(){
  const { repo } = getQuery();
  const wiki = repo? `/docs/wiki/${repo.split('/')[1]}/index.md` : '/docs/wiki';
  return <div style={{height:'100vh',display:'flex',flexDirection:'column'}}>
    <header style={{padding:10,borderBottom:'1px solid #eee'}}>WIKI • {repo||'(none)'}</header>
    <iframe src={wiki} style={{flex:1,border:'none',background:'#fcfcfc'}}/>
  </div>;
}