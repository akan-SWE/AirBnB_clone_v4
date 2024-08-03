#!/usr/bin/python3
from flask import Flask
from models import storage
from api.v1.views import app_views
import os

def create_app():
    
    app = Flask(__name__)
    app.register_blueprint(app_views)
    app.teardown_app_context(storage.close)
    return app

app = create_app()


if __name__ == "__main__":
    host = os.getenv('HBNB_API_HOST', '0.0.0.0')
    port = int(os.getenv('HBNB_API_PORT', 5000))
    app.run(host=host, port=port, threaded=True)
