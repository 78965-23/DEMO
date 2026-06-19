#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
import time

PORT = 8000
DATA_FILE = 'data.json'

class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/applications':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = self.load_data()
            self.wfile.write(json.dumps(data).encode())
            return
        super().do_GET()

    def do_POST(self):
        if self.path == '/api/applications':
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode()
            try:
                app = json.loads(body)
                app['id'] = int(time.time() * 1000)
                data = self.load_data()
                data.append(app)
                self.save_data(data)
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(app).encode())
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        if self.path.startswith('/api/applications/'):
            app_id = int(self.path.split('/')[-1])
            length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(length).decode()
            try:
                update = json.loads(body)
                data = self.load_data()
                for app in data:
                    if app['id'] == app_id:
                        app.update(update)
                        break
                self.save_data(data)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(update).encode())
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        if self.path.startswith('/api/applications/'):
            app_id = int(self.path.split('/')[-1])
            data = self.load_data()
            data = [app for app in data if app['id'] != app_id]
            self.save_data(data)
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

    def load_data(self):
        if not os.path.exists(DATA_FILE):
            return []
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except:
            return []

    def save_data(self, data):
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)

print(f"✅ Server running at http://localhost:{PORT}")
print(f"📁 Data stored in {DATA_FILE}")
print("🔑 Admin password: 08092003")
print("Press Ctrl+C to stop.")
httpd = HTTPServer(('', PORT), Handler)
httpd.serve_forever()
