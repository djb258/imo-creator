import { request } from 'undici';
async function j(u){ try{ const r=await request(u,{throwOnError:false}); return await r.body.json(); }catch{ return null; } }
export async function healthFrom(dashboardBase){ if(!dashboardBase) return {ok:null,raw:null}; const u=`${dashboardBase.replace(/\/$/,'')}/health`; const h=await j(u); return { ok: !!(h && (h.ok===true||h.status==='ok')), raw: h }; }