import React from 'react';
export function useToast(){ const [m,setM]=React.useState<string|undefined>(); return { m, show:(s:string)=>setM(s), clear:()=>setM(undefined) }; }
export function Toast({text}:{text?:string}){ return text? <div style={{position:'fixed',right:16,top:16,background:'#222',color:'#fff',padding:'8px 12px',borderRadius:6,opacity:.95}}>{text}</div>:null; }