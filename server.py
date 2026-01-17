#!/usr/bin/env python3
"""
Simple local web server for testing the website.
Serves the website at http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
from pathlib import Path

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add headers to prevent caching
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        url = f"http://localhost:{PORT}"
        print(f"\n🚀 Server running at {url}")
        print(f"📁 Serving files from: {DIRECTORY}")
        print(f"⌨️  Press Ctrl+C to stop the server\n")
        
        # Open browser automatically
        try:
            webbrowser.open(url)
        except:
            print(f"⚠️  Could not open browser automatically. Visit {url} manually.\n")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped.")

if __name__ == "__main__":
    main()
