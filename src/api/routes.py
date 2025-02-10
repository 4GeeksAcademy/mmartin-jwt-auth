"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Secret
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
import logging

api = Blueprint('api', __name__)
# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/token', methods=['POST'])
def get_token():
    email = request.json.get("email",None)
    password = request.json.get("password",None)
    user = User.query.filter_by(email = email).first()
    if user:
        password_check = user.password
        if password == password_check:
            access_token = create_access_token(identity=email)
            return jsonify(access_token),201  
    return jsonify('Email or password are incorrect, please try again'), 401

@api.route('/signup', methods=['POST'])
def signup_user():
    email = request.json.get("email",None)
    password = request.json.get("password",None)
    try:
        user = User.query.filter_by(email=email).first()
        if not user:
            new_user = User(email=email,password=password,is_active=True)
            db.session.add(new_user)
            db.session.commit()
            return jsonify('User registered correctly'),201
        else:
            return jsonify('Email already in use'), 409
    except Exception as e:
        db.session.rollback()
        logging.error(f"Error occurred: {e}")
        return jsonify('Server Error'),500


@api.route('/private', methods=['GET'])
@jwt_required()
def view_secrets():
    current_user = get_jwt_identity();
    try:
        messages = Secret.query.filter_by(email = current_user)
        if messages:
            gen_list = [message.serialize() for message in messages]
            return jsonify(gen_list), 201
        else:
            return jsonify('No secrets in the vault'), 201
    except Exception as e:
        return jsonify('Error, bad request'), 400
    
@api.route('/private', methods=['POST'])
@jwt_required()
def add_secrets():
    current_user = get_jwt_identity();
    try:
        text = request.json.get("message",None)
        new_secret = Secret(email=current_user,message=text)
        if new_secret:
            db.session.add(new_secret)
            db.session.commit()
            return jsonify(new_secret.serialize()), 201
    except Exception as e:
        return jsonify('Error adding message'), 400

@api.route('/private', methods=['DELETE'])
@jwt_required()
def delete_secrets():
    current_user = get_jwt_identity();
    try:
        secret_id = request.json.get("id",None)
        secret = Secret.query.filter_by(email=current_user,id=secret_id).first()
        if secret:
            db.session.delete(secret)
            db.session.commit()
            return jsonify('Deleted, successfully'), 201
    except Exception as e:
        return jsonify('Error deleting message message'), 400
    