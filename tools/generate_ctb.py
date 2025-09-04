#!/usr/bin/env python3
"""
Horizontal CTB (Christmas Tree Backbone) + altitude pages generator.
- Input: YAML or JSON spec (see /spec/process_map.yaml)
- Output: docs/ctb_horiz.md and docs/altitude/{30k,20k,10k,5k}.md + docs/catalog.md + docs/flows.md

Usage:
  python tools/generate_ctb.py spec/process_map.yaml
  # or:
  python tools/generate_ctb.py spec/process_map.json
"""
import sys, os, json, textwrap
from pathlib import Path

HAVE_YAML = False
try:
    import yaml  # type: ignore
    HAVE_YAML = True
except Exception:
    pass

def load_spec(path: Path):
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() in (".yml", ".yaml"):
        if not HAVE_YAML:
            raise SystemExit("YAML file provided but PyYAML not installed. Either `pip install pyyaml` "
                             "or save the spec as JSON and re-run.")
        return yaml.safe_load(text)
    return json.loads(text)

def md_fence(block: str, lang=""):
    return f"```{lang}\n{block.rstrip()}\n```"

def box(label: str) -> str:
    return f"[{label.strip()}]"

def horiz_connector(boxes):
    if not boxes: return ""
    line = ""
    for i, b in enumerate(boxes):
        line += b if i == 0 else f"───{b}"
    return line

def make_ctb_ascii(star: str, nodes: list, order: list|None) -> str:
    ordered = nodes
    if order:
        id2n = {n["id"]: n for n in nodes}
        ordered = [id2n[i] for i in order if i in id2n]
    row = [box(star)] + [box(n["label"]) for n in ordered]
    return horiz_connector(row)

def list_db_catalog(spec: dict) -> str:
    out = []
    out.append("## Databases / Schemas / Tables\n")
    for db in spec.get("databases", []):
        role = db.get("role","")
        out.append(f"- **{db.get('name','')}** — {role}".rstrip())
        for sch in db.get("schemas", []):
            out.append(f"  - `{sch.get('name','')}` schema")
            for t in sch.get("tables", []):
                tid = t.get("id","")
                out.append(f"    - {t.get('name','')} {f'({tid})' if tid else ''}".rstrip())
        for col in db.get("collections", []):
            out.append(f"  - collection: `{col.get('name','')}`")
        for ds in db.get("datasets", []):
            out.append(f"  - dataset: `{ds.get('name','')}`")
            for t in ds.get("tables", []):
                out.append(f"    - {t}")
    out.append("\n## Tools\n")
    for tool in spec.get("tools", []):
        out.append(f"- **{tool.get('name','')}** — {tool.get('purpose','')}")
    out.append("\n## MCP Servers\n")
    for m in spec.get("mcps", []):
        ops = ", ".join(m.get("ops", []))
        out.append(f"- **{m.get('name','')}** (port {m.get('port','?')}) — ops: {ops}")
    return "\n".join(out)

def lane_block(lane: dict, width=80) -> str:
    title = lane.get("name","").upper()
    items = lane.get("items", [])
    bar = "-"*width
    lines = [bar, title.center(width), bar]
    for it in items:
        s = f"• {it}"
        lines.append(s if len(s)<=width else textwrap.shorten(s, width=width, placeholder="…"))
    lines.append(bar)
    return "\n".join(lines)

def write_altitude_pages(spec: dict, outdir: Path):
    alt = spec.get("altitudes", {})
    outdir.mkdir(parents=True, exist_ok=True)

    a30 = alt.get("a30k", {})
    a30_md = [f"# {a30.get('title','30,000 ft')}", "", a30.get("summary","")]
    lanes = a30.get("lanes", [])
    if lanes:
        blocks = [lane_block(l) for l in lanes]
        a30_md.append(md_fence("\n\n".join(blocks)))
    (outdir / "30k.md").write_text("\n".join(a30_md), encoding="utf-8")

    a20 = alt.get("a20k", {})
    a20_md = [f"# {a20.get('title','20,000 ft')}", ""]
    if a20.get("stages"):
        a20_md.append("**Major Stages**")
        a20_md += [f"- {s}" for s in a20["stages"]]
        a20_md.append("")
    if a20.get("roles"):
        a20_md.append("**Roles**")
        a20_md += [f"- {r}" for r in a20["roles"]]
    (outdir / "20k.md").write_text("\n".join(a20_md), encoding="utf-8")

    a10 = alt.get("a10k", {})
    a10_md = [f"# {a10.get('title','10,000 ft')}", ""]
    if a10.get("steps"):
        a10_md.append("**Step-by-Step**")
        for s in a10["steps"]:
            a10_md.append(f"- {s}")
        a10_md.append("")
    if a10.get("decisions"):
        a10_md.append("**Decision Points**")
        for d in a10["decisions"]:
            a10_md.append(f"- {d}")
    (outdir / "10k.md").write_text("\n".join(a10_md), encoding="utf-8")

    a5 = alt.get("a5k", {})
    a5_md = [f"# {a5.get('title','5,000 ft')}", ""]
    for k in ("apis","contracts","guardrails"):
        if a5.get(k):
            a5_md.append(f"**{k.capitalize()}**")
            for item in a5[k]:
                a5_md.append(f"- {item}")
            a5_md.append("")
    (outdir / "5k.md").write_text("\n".join(a5_md), encoding="utf-8")

def write_ctb(spec: dict, docs_dir: Path):
    ctb = spec.get("ctb", {})
    star = ctb.get("star", "⭐ 40k Star")
    nodes = ctb.get("nodes", [])
    order = ctb.get("order")
    ascii_line = make_ctb_ascii(star, nodes, order)
    md = []
    md.append("# Horizontal CTB (Christmas Tree Backbone)")
    md.append("")
    md.append(md_fence(ascii_line))
    md.append("")
    md.append("_Backbone order reflects 40k → nodes; detailed flows live in altitude pages._")
    (docs_dir / "ctb_horiz.md").write_text("\n".join(md), encoding="utf-8")

def write_flows(spec: dict, docs_dir: Path):
    flows = spec.get("flows", [])
    if not flows: return
    lines = ["# Information Flows", ""]
    for f in flows:
        lines.append(f"- **{f.get('from','?')}** → **{f.get('to','?')}**")
    (docs_dir / "flows.md").write_text("\n".join(lines), encoding="utf-8")

def write_catalog(spec: dict, docs_dir: Path):
    docs_dir.mkdir(parents=True, exist_ok=True)
    catalog_md = list_db_catalog(spec)
    (docs_dir / "catalog.md").write_text(catalog_md, encoding="utf-8")

def main():
    if len(sys.argv) < 2:
        print("Usage: python tools/generate_ctb.py spec/process_map.yaml")
        sys.exit(1)
    inpath = Path(sys.argv[1])
    if not inpath.exists():
        raise SystemExit(f"Spec not found: {inpath}")
    spec = load_spec(inpath)

    out_docs = Path("docs")
    out_alt = out_docs / "altitude"
    out_docs.mkdir(parents=True, exist_ok=True)

    write_ctb(spec, out_docs)
    write_altitude_pages(spec, out_alt)
    write_flows(spec, out_docs)
    write_catalog(spec, out_docs)

    print("Generated:")
    print(f"- {out_docs/'ctb_horiz.md'}")
    print(f"- {out_docs/'flows.md'}")
    print(f"- {out_docs/'catalog.md'}")
    print(f"- {out_alt/'30k.md'}")
    print(f"- {out_alt/'20k.md'}")
    print(f"- {out_alt/'10k.md'}")
    print(f"- {out_alt/'5k.md'}")

if __name__ == "__main__":
    main()