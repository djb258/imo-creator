#!/usr/bin/env python3
import json, glob, statistics, os, sys
os.makedirs("logs/baseline", exist_ok=True)
def load_durations():
  items=[]
  for f in sorted(glob.glob("logs/bmad/*.json"))[-200:]:
    try:
      with open(f) as fh:
        obj=json.load(fh)
        tgt=obj.get("target","_default")
        dur=float(obj.get("duration_s") or obj.get("duration_ms",0)/1000)
        if dur>0: items.append((tgt,dur))
    except: pass
  return items
items=load_durations()
by={}
for t,d in items:
  by.setdefault(t,[]).append(d)
baseline={}
for t,arr in by.items():
  arr=arr[-7:]
  try: baseline[t]=statistics.median(arr)
  except statistics.StatisticsError: baseline[t]=None
with open("logs/baseline/rolling_median.json","w") as f: json.dump(baseline,f)
print(json.dumps(baseline))