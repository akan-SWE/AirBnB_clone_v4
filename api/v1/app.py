#!/usr/bin/python3
""""Create flask app"""
from os import getenv
from flask import Flask
from models import storage
from api.v1.views import app_views
import os

app = Flask(__name__)
app.register_blueprint(app_views)

@app.teardown_appcontext
def teardown_appcontext(exception):
    """Close storage session"""
    storage.close()

if __name__ == "__main__":
    HOST = os.getenv('HBNB_API_HOST', '0.0.0.0')
    PORT = int(os.getenv('HBNB_API_PORT', '5000'))
    app.run(host=HOST, port=PORT, threaded=True)
