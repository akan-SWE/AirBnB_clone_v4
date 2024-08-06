#!/usr/bin/python3
""""Create flask app"""
from flask import jsonify
from api.v1.views import app_views

@app_views.route('/status', methods=['GET'], strict_slashes=False)
def status():
    """Return the status"""
    response = {'status': "OK"}
    return jsonify(response)
