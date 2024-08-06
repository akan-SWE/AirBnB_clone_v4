#!/usr/bin/python3
"""Create Flask app blueprint"""
from flask import jsonify, abort, request, make_response
from models.state import State
from models import storage
from api.v1.views import app_views


@app_views.route('/states', methods=['GET'], strict_slashes=False)
def get_states():
    """Retrieve all the state"""
    states = storage.all(State).values()
    state_list = [state.to_dict() for state in states]
    return jsonify(state_list)


@app_views.route('/states/<state_id>', methods=['GET'], strict_slashes=False)
def get_state(state_id):
    """Get state obj by id"""
    state = storage.get(State, state_id)

    if state:
        return jsonify(state.to_dict())
    else:
        return abort(404)


@app_views.route('/states/<state_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_state(state_id):
    """Get state obj by id"""
    state = storage.get(State, state_id)

    if state:
        storage.delete(state)
        storage.save()
        return jsonify({}), 200
    else:
        abort(404)


@app_views.route('/states', methods=['POST'], strict_slashes=False)
def create_state():
    """Create a new State"""
    if request.content_type != 'application/json':
        return abort(404, 'Not a JSON')
    if not request.get_json():
        return abort(404, 'Not a JSON')
    kwargs = request.get_json()
    if 'name' not in kwargs:
        abort(400, 'Missing name')
    state = State(**kwargs)
    state.save()


@app_views.route('/states/<state_id>', methods=['PUT'], strict_slashes=False)
def update_state(state_id):
    """Update state"""
    state = storage.get(State, state_id)
    if not state:
        abort(404)
    data = request.get_json()
    if not data:
        return jsonify({"error": "Not a JSON"}), 400
    for key, value in data.items():
        if key not in ['id', 'created_at', 'updated_at']:
            setattr(state, key, value)
    storage.save()
    return make_response(jsonify(state.to_dict()), 200)
