#!/usr/bin/python3
"""Create Flask app blueprint"""
from flask import jsonify, abort, request, make_response
from models.state import User
from models import storage
from api.v1.views import app_views


@app_views.route('/users', methods=['GET'], strict_slashes=False)
def users():
    """ User objects """
    userss = storage.all(User)
    return jsonify([obj.to_dict() for obj in userss.values()])


@app_views.route('/users/<user_id>', methods=['GET'], strict_slashes=False)
def userid(user_id):
    """Users"""
    user = storage.get("User", user_id)
    if not user:
        abort(404)
    return jsonify(user.to_dict())


@app_views.route('/users/<user_id>', methods=['DELETE'],
                 strict_slashes=False)
def delete_user(user_id):
    """ Deletes a User object """
    user = storage.get("User", user_id)
    if not user:
        abort(404)
    user.delete()
    storage.save()
    return make_response(jsonify({}), 200)


@app_views.route('/users', methods=['POST'], strict_slashes=False)
def post_user():
    """ Creates a User object """
    new_user = request.get_json()
    if not new_user:
        abort(400, "Not a JSON")
    if "email" not in new_user:
        abort(400, "Missing email")
    if "password" not in new_user:
        abort(400, "Missing password")

    data = User(**new_user)
    storage.new(data)
    storage.save()
    return make_response(jsonify(data.to_dict()), 201)


@app_views.route('/users/<user_id>', methods=['PUT'], strict_slashes=False)
def put_user(user_id):
    """ Updates a User object """
    user = storage.get("User", user_id)
    if not user:
        abort(404)

    body_request = request.get_json()
    if not body_request:
        abort(400, "Not a JSON")

    for key, value in body_request.items():
        if key not in ['id', 'email', 'created_at', 'updated_at']:
            setattr(user, key, value)

    storage.save()
    return make_response(jsonify(user.to_dict()), 200)
