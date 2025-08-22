type WinKey = 'code'|'wiki'|'ops';
const KEYS = { code: 'win_code', wiki: 'win_wiki', ops: 'win_ops' } as const;
export function readRect(k:WinKey){ const r=localStorage.getItem(KEYS[k]); try{ return r?JSON.parse(r):null }catch{return null} }
export function writeRect(k:WinKey,rect:{x:number;y:number;width:number;height:number}){ localStorage.setItem(KEYS[k],JSON.stringify(rect)); }
export function openWin(k:WinKey,url:string){
  const r=readRect(k)||{x:0,y:0,width:1200,height:900};
  const f=`popup=yes,noopener=yes,noreferrer=yes,scrollbars=yes,resizable=yes,width=${r.width},height=${r.height},left=${r.x},top=${r.y}`;
  const w=window.open(url,'_blank',f); if(!w||w.closed) window.open(url,'_blank');
}