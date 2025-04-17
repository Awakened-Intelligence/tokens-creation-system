from flask import Blueprint, request, jsonify,redirect
from services.Auth_service import AuthService
from database.db import db
from config import Config

auth_bp = Blueprint('auth', __name__)
auth_service = AuthService()



@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
        
        if not all(key in data for key in ['username', 'email', 'password']):
            return jsonify({"success": False, "message": "Missing required fields"}), 400
            
        response = auth_service.register_user(data)
        return jsonify(response), 201 if response['success'] else 400
    except Exception as e:
        print("Signup error:", str(e))
        return jsonify({"success": False, "message": "Server error during signup"}), 500

@auth_bp.route('/signin', methods=['POST'])
def signin():
    try:
        data = request.json
        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400
            
        if not all(key in data for key in ['email', 'password']):
            return jsonify({"success": False, "message": "Missing email or password"}), 400
            
        response = auth_service.login_user(data)
        return jsonify(response), 200 if response['success'] else 401
    except Exception as e:
        print("Signin error:", str(e))
        return jsonify({"success": False, "message": "Server error during signin"}), 500

@auth_bp.route('/verify-email/<token>', methods=['GET'])
def verify_email(token):
    response = auth_service.verify_email(token)
    
    if response['success']:
        return redirect(f"{Config.FRONTEND_URL}/signin")  # Redirect to Sign In page on frontend
    else:
        return redirect(f"{Config.FRONTEND_URL}/verification-failed")


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    response = auth_service.request_password_reset(data['email'])
    return jsonify(response), 200 if response['success'] else 400

@auth_bp.route('/reset-password/<reset_token>', methods=['GET', 'POST'])
def reset_password(reset_token):
    if request.method == 'GET':
        return redirect(f"{Config.FRONTEND_URL}/reset-password/{reset_token}") 
    
    if request.method == 'POST':
        data = request.get_json()
        new_password = data.get('new_password')
        return jsonify(auth_service.reset_password(reset_token, new_password))


# 🆕 Wallet Address API - Save Wallet
@auth_bp.route('/api/save-wallet', methods=['POST'])
def save_wallet_address():
    data = request.json
    email_or_id = data.get('email')  # This is actually the User ID
    wallet_address = data.get('walletAddress')

    print("Received data:", data)  # 🟢 Debug: Check request payload
    print("Email/User ID:", email_or_id)  # 🟢 Debug: Check extracted email or ID
    print("Wallet Address:", wallet_address)

    response = auth_service.save_wallet_address(email_or_id, wallet_address)
    status_code = 200 if response['success'] else 400
    return jsonify(response), status_code

# 🆕 Wallet Address API - Get Wallet
@auth_bp.route('/api/get-wallet', methods=['GET'])
def get_wallet_address():
    email_or_id = request.args.get('email')  # This is actually the User ID
    print("Received User ID for get-wallet:", email_or_id)  # 🟢 Debug log

    response = auth_service.get_wallet_address(email_or_id)
    status_code = 200 if response['success'] else 400
    return jsonify(response), status_code

@auth_bp.route('/api/check-wallet', methods=['GET'])
def check_wallet_address():
    wallet_address = request.args.get('walletAddress')
    
    if not wallet_address:
        return jsonify({'success': False, 'message': 'Wallet address is required.'}), 400

    user = auth_service.get_user_by_wallet(wallet_address)
    
    if user:
        return jsonify({'success': False, 'message': 'Wallet address is already associated with another user.'}), 400
    
    return jsonify({'success': True, 'message': 'Wallet address is available.'}), 200

