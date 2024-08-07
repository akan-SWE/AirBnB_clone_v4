#!/usr/bin/python3
"""Create Flask app blueprint"""
from flask import jsonify, abort, request, make_response
from models.state import User
from models import storage
from api.v1.views import app_views


@app_views.route('/users', methods=['GET'], strict_slashes=False)
def users():
    """Retrieve all the state"""
    states = storage.all(User)
    return jsonify([obj.to_dict() for obj in states.values()])


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
def get_user(user_id):
    """Get state obj by id"""
    user = storage.get("User", user_id)
    if not user:
        abort(404)
    return jsonify(user.to_dict())


@app_views.route('/users/<user_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_user(user_id):
    """Get state obj by id"""
    state = storage.get("User", user_id)
    if not state:
        abort(404)
    state.delete()
    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route('/users', methods=['POST'], strict_slashes=False)
def create_state():
    """Create a new State"""
    statess = request.get_json()
    if not statess:
        abort(400, "Not a JSON")
    if "email" not in statess:
        abort(400, "Missing email")
    if "password" not in statess:
        abort(400, "Missing password")
    state = User(**statess)
    storage.new(state)
    storage.save()
    return make_response(jsonify(state.to_dict()), 201)


@app_views.route('/states/<state_id>', methods=['PUT'], strict_slashes=False)
def update_state(state_id):
    """Update state"""
    state = storage.get("State", state_id)
    if not state:
        abort(404)
    data = request.get_json()
    if not data:
        abort(400, "Not a JSON")

    for key, value in data.items():
        if key != 'id' and key != 'created_at' and key != 'updated_at':
            setattr(state, key, value)

    storage.save()
    return make_response(jsonify(state.to_dict()), 200)
