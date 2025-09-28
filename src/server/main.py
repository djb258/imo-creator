from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import PlainTextResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import yaml
import json
import subprocess
import sys
import os
import requests
import hashlib
import time
import base64
from typing import Optional, Dict, Any

app = FastAPI(title="Blueprint API")

# CORS configuration
allow_origin = os.getenv("ALLOW_ORIGIN", "http://localhost:7002")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin, "http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).parent.parent.parent
BLUEPRINTS_DIR = BASE_DIR / "docs" / "blueprints"

@app.get("/blueprints/{slug}/manifest", response_class=PlainTextResponse)
async def get_manifest(slug: str):
    """Get manifest YAML for a blueprint"""
    manifest_path = BLUEPRINTS_DIR / slug / "manifest.yaml"
    if not manifest_path.exists():
        return PlainTextResponse(f"Manifest not found for {slug}. Create it at {manifest_path}", status_code=404)
    
    with open(manifest_path, 'r') as f:
        return f.read()

@app.put("/blueprints/{slug}/manifest")
async def put_manifest(slug: str, body: bytes):
    """Update manifest YAML for a blueprint"""
    blueprint_dir = BLUEPRINTS_DIR / slug
    blueprint_dir.mkdir(parents=True, exist_ok=True)
    
    manifest_path = blueprint_dir / "manifest.yaml"
    
    try:
        yaml.safe_load(body.decode())
    except yaml.YAMLError as e:
        raise HTTPException(status_code=400, detail=f"Invalid YAML: {e}")
    
    with open(manifest_path, 'wb') as f:
        f.write(body)
    
    return {"message": f"Manifest saved for {slug}", "path": str(manifest_path)}

@app.post("/blueprints/{slug}/score")
async def score_blueprint(slug: str):
    """Run scorer and return progress JSON"""
    blueprint_dir = BLUEPRINTS_DIR / slug
    if not (blueprint_dir / "manifest.yaml").exists():
        return JSONResponse({"error": f"No manifest found for {slug}"}, status_code=404)
    
    try:
        result = subprocess.run(
            [sys.executable, str(BASE_DIR / "tools" / "blueprint_score.py"), slug],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode != 0:
            return JSONResponse({"error": result.stderr}, status_code=500)
        
        progress_path = blueprint_dir / "progress.json"
        if progress_path.exists():
            with open(progress_path, 'r') as f:
                return json.load(f)
        else:
            return JSONResponse({"error": "Progress file not generated"}, status_code=500)
            
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/blueprints/{slug}/visuals")
async def generate_visuals(slug: str):
    """Run visual generator and return paths"""
    blueprint_dir = BLUEPRINTS_DIR / slug
    if not (blueprint_dir / "manifest.yaml").exists():
        return JSONResponse({"error": f"No manifest found for {slug}"}, status_code=404)
    
    try:
        result = subprocess.run(
            [sys.executable, str(BASE_DIR / "tools" / "blueprint_visual.py"), slug],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode != 0:
            return JSONResponse({"error": result.stderr}, status_code=500)
        
        files = [
            "tree_overview.mmd",
            "ladder_input.mmd",
            "ladder_middle.mmd",
            "ladder_output.mmd"
        ]
        
        paths = {}
        for file in files:
            file_path = blueprint_dir / file
            if file_path.exists():
                paths[file] = str(file_path)
        
        return {"message": "Visuals generated", "paths": paths}
        
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)

@app.post("/llm")
async def llm_endpoint(request: Request):
    """LLM endpoint mirroring Vercel function with concurrent provider support"""
    try:
        body = await request.json()
        
        requested_provider = body.get("provider")
        model = body.get("model")
        system = body.get("system")
        prompt = body.get("prompt")
        json_mode = body.get("json", False)
        max_tokens = body.get("max_tokens", 1024)
        
        if not prompt:
            return JSONResponse({"error": "Prompt is required"}, status_code=400)
        
        # Provider selection algorithm
        anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")
        default_provider = os.getenv("LLM_DEFAULT_PROVIDER", "openai")
        
        # 1. If provider explicitly requested
        if requested_provider:
            provider = requested_provider
            if provider == "anthropic" and not anthropic_key:
                return JSONResponse({
                    "error": "Anthropic API key not configured",
                    "help": "Add ANTHROPIC_API_KEY=sk-ant-xxx to your .env file",
                    "provider": "anthropic"
                }, status_code=502)
            if provider == "openai" and not openai_key:
                return JSONResponse({
                    "error": "OpenAI API key not configured",
                    "help": "Add OPENAI_API_KEY=sk-xxx to your .env file", 
                    "provider": "openai"
                }, status_code=502)
        # 2. Infer from model name
        elif model:
            if "claude" in model.lower():
                provider = "anthropic"
            elif "gpt" in model.lower() or model.lower().startswith("o"):
                provider = "openai"
            else:
                provider = default_provider
        # 3. Use default provider
        elif default_provider == "anthropic" and anthropic_key:
            provider = "anthropic"
        elif default_provider == "openai" and openai_key:
            provider = "openai"
        # 4. Use whichever single key is available
        elif anthropic_key and not openai_key:
            provider = "anthropic"
        elif openai_key and not anthropic_key:
            provider = "openai"
        # 5. No provider available - graceful degradation
        else:
            return JSONResponse({
                "error": "No API keys configured yet. Add ANTHROPIC_API_KEY and/or OPENAI_API_KEY to .env file.",
                "help": "Copy .env.example to .env and add your API keys"
            }, status_code=502)
        
        # Validate selected provider has key - with helpful messages
        if provider == "anthropic" and not anthropic_key:
            return JSONResponse({
                "error": "Anthropic API key not configured",
                "help": "Add ANTHROPIC_API_KEY=sk-ant-xxx to your .env file",
                "provider": "anthropic"
            }, status_code=502)
        if provider == "openai" and not openai_key:
            return JSONResponse({
                "error": "OpenAI API key not configured", 
                "help": "Add OPENAI_API_KEY=sk-xxx to your .env file",
                "provider": "openai"
            }, status_code=502)
        
        if provider == "anthropic":
            default_model = "claude-3-5-sonnet-20240620"
            anthropic_model = model or default_model
            
            anthropic_body = {
                "model": anthropic_model,
                "max_tokens": max_tokens,
                "messages": [{"role": "user", "content": prompt}]
            }
            
            if system:
                anthropic_body["system"] = system
            
            if json_mode:
                anthropic_body["tools"] = [{
                    "name": "json_response",
                    "description": "Return the response as valid JSON",
                    "input_schema": {
                        "type": "object",
                        "properties": {
                            "response": {"type": "object", "description": "The JSON response"}
                        },
                        "required": ["response"]
                    }
                }]
                anthropic_body["tool_choice"] = {"type": "tool", "name": "json_response"}
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": anthropic_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                json=anthropic_body,
                timeout=30
            )
            
            if not response.ok:
                error_data = response.json()
                raise Exception(error_data.get("error", {}).get("message", "Anthropic API error"))
            
            result = response.json()
            
            if json_mode and result.get("content") and result["content"][0].get("type") == "tool_use":
                return JSONResponse({
                    "json": result["content"][0]["input"]["response"],
                    "model": anthropic_model,
                    "provider": "anthropic"
                })
            else:
                text = result.get("content", [{}])[0].get("text", "")
                if json_mode:
                    try:
                        parsed_json = json.loads(text)
                        return JSONResponse({
                            "json": parsed_json,
                            "model": anthropic_model,
                            "provider": "anthropic"
                        })
                    except json.JSONDecodeError:
                        pass
                
                return JSONResponse({
                    "text": text,
                    "model": anthropic_model,
                    "provider": "anthropic"
                })
        
        else:  # OpenAI
            default_model = "gpt-4o-mini"
            openai_model = model or default_model
            
            messages = []
            if system:
                messages.append({"role": "system", "content": system})
            messages.append({"role": "user", "content": prompt})
            
            openai_body = {
                "model": openai_model,
                "max_tokens": max_tokens,
                "messages": messages
            }
            
            if json_mode:
                openai_body["response_format"] = {"type": "json_object"}
                # Ensure JSON instruction
                json_instruction = "You must respond with valid JSON only."
                if system:
                    messages[0]["content"] += " " + json_instruction
                else:
                    messages.insert(0, {"role": "system", "content": json_instruction})
            
            response = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {openai_key}",
                    "Content-Type": "application/json"
                },
                json=openai_body,
                timeout=30
            )
            
            if not response.ok:
                error_data = response.json()
                raise Exception(error_data.get("error", {}).get("message", "OpenAI API error"))
            
            result = response.json()
            text = result.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            if json_mode:
                try:
                    parsed_json = json.loads(text)
                    return JSONResponse({
                        "json": parsed_json,
                        "model": openai_model,
                        "provider": "openai"
                    })
                except json.JSONDecodeError:
                    pass
            
            return JSONResponse({
                "text": text,
                "model": openai_model,
                "provider": "openai"
            })
    
    except Exception as error:
        print(f"LLM API error: {error}")
        return JSONResponse({"error": str(error)}, status_code=502)

# SSOT processing utilities
def _ts_ms() -> int:
    return int(time.time() * 1000)

def _rand16(seed: str) -> str:
    h = hashlib.sha256(seed.encode('utf8')).digest()
    return base64.b64encode(h[:10]).decode().replace('=', '').replace('+', '-').replace('/', '_')

def _compact_ts(ts_ms: int) -> str:
    import datetime
    t = datetime.datetime.utcfromtimestamp(ts_ms / 1000)
    return f"{t.year:04d}{t.month:02d}{t.day:02d}-{t.hour:02d}{t.minute:02d}{t.second:02d}"

def generate_unique_id(ssot: Dict[str, Any]) -> str:
    db = os.getenv("DOCTRINE_DB", "shq")
    subhive = os.getenv("DOCTRINE_SUBHIVE", "03")
    app = os.getenv("DOCTRINE_APP", "imo")
    ts_ms = ssot.get("meta", {}).get("_created_at_ms", _ts_ms())
    app_name = (ssot.get("meta", {}).get("app_name", "imo-creator") or "").strip()
    seed = f"{db}|{subhive}|{app}|{app_name}|{ts_ms}"
    r = _rand16(seed)
    return f"{db}-{subhive}-{app}-{_compact_ts(ts_ms)}-{r}"

def generate_process_id(ssot: Dict[str, Any]) -> str:
    db = os.getenv("DOCTRINE_DB", "shq")
    subhive = os.getenv("DOCTRINE_SUBHIVE", "03")
    app = os.getenv("DOCTRINE_APP", "imo")
    ver = os.getenv("DOCTRINE_VER", "1")
    
    stage = (ssot.get("meta", {}).get("stage", "overview") or "").lower()
    ts_ms = ssot.get("meta", {}).get("_created_at_ms", _ts_ms())
    ymd = _compact_ts(ts_ms).split("-")[0]
    return f"{db}.{subhive}.{app}.V{ver}.{ymd}.{stage}"

def ensure_ids(ssot: Dict[str, Any]) -> Dict[str, Any]:
    ssot = dict(ssot or {})
    meta = dict(ssot.get("meta", {}))
    
    if not meta.get("_created_at_ms"):
        meta["_created_at_ms"] = _ts_ms()
    ssot["meta"] = meta
    
    doctrine = dict(ssot.get("doctrine", {}))
    if not doctrine.get("unique_id"):
        doctrine["unique_id"] = generate_unique_id(ssot)
    if not doctrine.get("process_id"):
        doctrine["process_id"] = generate_process_id(ssot)
    if not doctrine.get("schema_version"):
        doctrine["schema_version"] = "HEIR/1.0"
    ssot["doctrine"] = doctrine
    
    return ssot

def _scrub(o):
    OMIT = {"timestamp_last_touched", "_created_at_ms", "blueprint_version_hash"}
    
    if isinstance(o, dict):
        result = {}
        for k in sorted(o.keys()):
            if k not in OMIT:
                result[k] = _scrub(o[k])
        return result
    elif isinstance(o, list):
        return [_scrub(v) for v in o]
    else:
        return o

def stamp_version_hash(ssot: Dict[str, Any]) -> Dict[str, Any]:
    canon = json.dumps(_scrub(ssot))
    h = hashlib.sha256(canon.encode('utf8')).hexdigest()
    
    ssot = dict(ssot)
    doctrine = dict(ssot.get("doctrine", {}))
    doctrine["blueprint_version_hash"] = h
    ssot["doctrine"] = doctrine
    
    return ssot

@app.post("/api/ssot/save")
async def save_ssot(request: Request):
    """SSOT processing with doctrine-safe IDs"""
    try:
        body = await request.json()
        ssot = body.get("ssot", {})
        ssot = ensure_ids(ssot)
        ssot = stamp_version_hash(ssot)
        
        return JSONResponse({"ok": True, "ssot": ssot})
    except Exception as error:
        print(f"SSOT processing error: {error}")
        return JSONResponse({"error": f"Failed to process SSOT: {str(error)}"}, status_code=500)

@app.get("/api/subagents")
async def get_subagents():
    """Subagent registry with garage-mcp integration"""
    BASE = os.getenv("GARAGE_MCP_URL")
    TOKEN = os.getenv("GARAGE_MCP_TOKEN")
    PATH = os.getenv("SUBAGENT_REGISTRY_PATH", "/registry/subagents")
    
    FALLBACK = [
        {"id": "validate-ssot", "bay": "frontend", "desc": "Validate SSOT against HEIR schema"},
        {"id": "heir-check", "bay": "backend", "desc": "Run HEIR checks on blueprint"},
        {"id": "register-blueprint", "bay": "backend", "desc": "Persist + emit registration event"},
    ]
    
    # If no garage-mcp URL configured, return fallback
    if not BASE:
        return JSONResponse({"items": FALLBACK})
    
    try:
        headers = {"Content-Type": "application/json"}
        if TOKEN:
            headers["Authorization"] = f"Bearer {TOKEN}"
        
        response = requests.get(f"{BASE}{PATH}", headers=headers, timeout=5)
        
        if not response.ok:
            raise Exception(f"HTTP {response.status_code}: {response.reason}")
        
        data = response.json()
        items = data if isinstance(data, list) else data.get("items", [])
        
        processed_items = []
        for item in items:
            processed_items.append({
                "id": item.get("id") or item.get("name", "unknown"),
                "bay": item.get("bay") or item.get("namespace", "unknown"),
                "desc": item.get("description") or item.get("desc", "")
            })
        
        # Return processed items or fallback if empty
        return JSONResponse({
            "items": processed_items if processed_items else FALLBACK
        })
        
    except Exception as error:
        print(f"Garage-MCP fetch error: {error}")
        # Gracefully fall back to static list
        return JSONResponse({"items": FALLBACK})

@app.get("/health")
async def health():
    return {"status": "ok", "service": "imo-creator-backend"}

@app.get("/api/composio/_21risk")
async def composio_21risk():
    """21RISK toolkit endpoint - Risk Management & Compliance"""
    return {
        "toolkit": "_21RISK",
        "category": "Risk Management & Compliance",
        "tools": 9,
        "status": "active",
        "description": "Risk management and compliance operations"
    }

@app.get("/api/composio/_2chat")
async def composio_2chat():
    """2CHAT toolkit endpoint - Chat & Communication"""
    return {
        "toolkit": "_2CHAT",
        "category": "Chat & Communication",
        "tools": 5,
        "status": "active",
        "description": "WhatsApp and communication management"
    }

@app.get("/api/composio/ably")
async def composio_ably():
    """ABLY toolkit endpoint - Real-time Messaging & Presence"""
    return {
        "toolkit": "ABLY",
        "category": "Real-time Messaging & Presence",
        "tools": 6,
        "status": "active",
        "description": "Real-time messaging and presence tracking"
    }

@app.get("/api/composio/builder")
async def composio_builder():
    """Builder.io toolkit endpoint - Visual Development & UI/UX"""
    return {
        "toolkit": "Builder.io",
        "category": "Visual Development & UI/UX",
        "tools": 0,
        "status": "active",
        "description": "Visual development and UI generation"
    }

@app.get("/")
async def root():
    return {"message": "IMO-Creator Backend API", "endpoints": [
        "/health",
        "/blueprints/{slug}/manifest",
        "/blueprints/{slug}/score",
        "/blueprints/{slug}/visuals",
        "/llm",
        "/api/ssot/save",
        "/api/subagents",
        "/api/composio/_21risk",
        "/api/composio/_2chat",
        "/api/composio/ably",
        "/api/composio/builder"
    ]}