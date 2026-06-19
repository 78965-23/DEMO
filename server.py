#!/usr/bin/env python3
import http.server
import socketserver
import json
import os
import urllib.parse
import time

PORT = 8000
DATA_FILE = 'data.json'

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/api/applications':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            data = self.read_data()
            self.wfile.write(json.dumps(data).encode())
            return
        return super().do_GET()

    def do_POST(self):
        if self.path == '/api/applications':
            content_len = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_len)
            try:
                new_app = json.loads(post_body)
                data = self.read_data()
                new_app['id'] = int(time.time() * 1000)
                data.append(new_app)
                self.write_data(data)
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(new_app).encode())
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        self.send_response(404)
        self.end_headers()

    def do_PUT(self):
        if self.path.startswith('/api/applications/'):
            app_id = int(self.path.split('/')[-1])
            content_len = int(self.headers.get('Content-Length', 0))
            put_body = self.rfile.read(content_len)
            try:
                update_data = json.loads(put_body)
                data = self.read_data()
                found = False
                for app in data:
                    if app['id'] == app_id:
                        app.update(update_data)
                        found = True
                        break
                if not found:
                    self.send_response(404)
                    self.end_headers()
                    return
                self.write_data(data)
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(update_data).encode())
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            return
        self.send_response(404)
        self.end_headers()

    def do_DELETE(self):
        if self.path.startswith('/api/applications/'):
            app_id = int(self.path.split('/')[-1])
            data = self.read_data()
            data = [app for app in data if app['id'] != app_id]
            self.write_data(data)
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            return
        self.send_response(404)
        self.end_headers()

    def read_data(self):
        if not os.path.exists(DATA_FILE):
            return []
        with open(DATA_FILE, 'r') as f:
            return json.load(f)

    def write_data(self, data):
        with open(DATA_FILE, 'w') as f:
            json.dump(data, f, indent=2)

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
        print(f"✅ Server running at http://localhost:{PORT}")
        print(f"📁 Data stored in {DATA_FILE}")
        print("🔑 Admin Password: 08092003")
        print("Press Ctrl+C to stop.")
        httpd.serve_forever()
