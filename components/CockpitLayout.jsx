import React from "react";
export default function CockpitLayout({ title, right, children }) {
  return (
    <div style={{padding:16}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <h2 style={{margin:0}}>{title}</h2>
        <div>{right}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>
        {children}
      </div>
    </div>
  );
}