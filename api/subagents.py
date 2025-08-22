from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        items = [
            {"id": "validate-ssot", "bay": "frontend", "desc": "Validate SSOT against HEIR schema"},
            {"id": "heir-check", "bay": "backend", "desc": "Run HEIR checks on blueprint"},
            {"id": "register-blueprint", "bay": "backend", "desc": "Persist + emit registration event"},
        ]
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({"items": items}).encode('utf-8'))
        
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()