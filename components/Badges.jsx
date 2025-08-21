import React from "react";
export function Badge({ ok, label }) {
  const color = ok === true ? "#12B981" : ok === false ? "#EF4444" : "#9CA3AF";
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:12,background:color,color:"#fff",fontSize:12,marginRight:8}}>{label}</span>;
}
export function Stat({ label, value }) {
  return <div style={{marginRight:16}}><div style={{fontSize:12,color:"#6B7280"}}>{label}</div><div style={{fontWeight:600}}>{value}</div></div>;
}