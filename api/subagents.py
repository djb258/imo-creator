import json

def handler(request):
    """GET /api/subagents - Return subagent registry items"""
    if request.method != 'GET':
        return (405, {"Content-Type": "application/json"}, json.dumps({"error": "Method not allowed"}))
    
    items = [
        {"id": "validate-ssot", "bay": "frontend", "desc": "Validate SSOT against HEIR schema"},
        {"id": "heir-check", "bay": "backend", "desc": "Run HEIR checks on blueprint"},
        {"id": "register-blueprint", "bay": "backend", "desc": "Persist + emit registration event"},
    ]
    
    return (200, {"Content-Type": "application/json"}, json.dumps({"items": items}))

def __vercel_handler__(request):
    return handler(request)