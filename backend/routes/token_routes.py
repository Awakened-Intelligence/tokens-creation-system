from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.db import db
from models.token_model import token_model

token_bp = Blueprint("token_bp", __name__)

@token_bp.route("/create", methods=["POST"])
@jwt_required()
def create_token():
    user_id = get_jwt_identity()
    data = request.json
    data["user_id"] = user_id  # Associate token with the user
    token_model.create_token(data)
    return jsonify({"success": True, "message": "Token saved successfully!"}), 201

@token_bp.route("/get-tokens", methods=["GET"])
@jwt_required()  # Ensures only authenticated users can access
def get_tokens():
    try:
        current_user = get_jwt_identity()  # Get user ID from token
        tokens = list(db.tokens.find({"user_id": current_user}, {"_id": 0}))  
        return jsonify({"tokens": tokens}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500