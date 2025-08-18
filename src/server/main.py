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
from typing import Optional

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

@app.get("/")
async def root():
    return {"message": "Blueprint API", "endpoints": [
        "/blueprints/{slug}/manifest",
        "/blueprints/{slug}/score",
        "/blueprints/{slug}/visuals",
        "/llm"
    ]}