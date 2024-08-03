#!/usr/bin/python3
"""Create a Flask web application API.
"""
from os import getenv
from flask import Flask
from models import storage
from api.v1.views import app_views

app = Flask(__name__)

"""A Flask web application instance."""
app.register_blueprint(app_views)

@app.teardown_appcontext
def teardown_flask(exception):
    """Flask request context."""
    storage.close()


if __name__ == "__main__":
    HOST = getenv('HBNB_API_HOST', '0.0.0.0')
    PORT = int(getenv('HBNB_API_PORT', 5000))
    app.run(host=HOST, port=PORT, threaded=True)
