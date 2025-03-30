import uuid
from flask_jwt_extended import create_access_token
from models.user_model import UserModel
from bson import ObjectId
from database.db import db
from services.Email_service import send_verification_email, send_password_reset_email

class AuthService:
    def __init__(self):
        self.user_model = UserModel(db)

    def register_user(self, data):
        if self.user_model.find_by_email(data['email']):
            return {"success": False, "message": "Email already registered."}

        verification_token = str(uuid.uuid4())
        self.user_model.create_user(data['username'], data['email'], data['password'], verification_token)
        send_verification_email(data['email'], verification_token)

        return {"success": True, "message": "Verification email sent."}

    def login_user(self, data):
        user = self.user_model.find_by_email(data['email'])
        if user and self.user_model.verify_password(data['password'], user['password']):
            if not user.get('is_verified'):
                return {"success": False, "message": "Email not verified."}

            token = create_access_token(identity=str(user['_id']))
            return {"success": True, "token": token,"user_id": str(user['_id']),  "message": "Login successful!"}
        return {"success": False, "message": "Invalid credentials."}

    def verify_email(self, token):
        user = self.user_model.collection.find_one({"verification_token": token})
        if user:
            self.user_model.collection.update_one(
                {"_id": user["_id"]},
                {"$set": {"is_verified": True}, "$unset": {"verification_token": ""}}
            )
            return {"success": True, "message": "Email verified successfully!"}
        return {"success": False, "message": "Invalid or expired verification link."}

    def request_password_reset(self, email):
        user = self.user_model.find_by_email(email)
        if not user:
            return {"success": False, "message": "Email not found."}

        reset_token = str(uuid.uuid4())
        self.user_model.set_reset_token(email, reset_token)

        send_password_reset_email(email, reset_token)
        return {"success": True, "message": "Password reset link sent to your email."}

    def reset_password(self, reset_token, new_password):
        user = self.user_model.find_by_reset_token(reset_token)
        if not user:
            return {"success": False, "message": "Invalid or expired reset link."}

        self.user_model.update_password(user['email'], new_password)
        self.user_model.clear_reset_token(user['email'])

        new_jwt = create_access_token(identity=str(user['_id']))
        return {"success": True, "message": "Password reset successfully!", "token": new_jwt}

    def save_wallet_address(self, email_or_id, wallet_address):
        if not email_or_id or not wallet_address:
            return {'success': False, 'message': 'User ID and wallet address are required.'}
        
        user = None

        # 🟢 Validate and determine if input is ObjectID or email
        if ObjectId.is_valid(email_or_id):
            print(f"Handling as ObjectID: {email_or_id}")
            user = self.user_model.find_by_id(email_or_id)
        else:
            print(f"Handling as Email: {email_or_id}")
            user = self.user_model.find_by_email(email_or_id)

        if not user:
            return {'success': False, 'message': 'User not found.'}

        if user.get("walletAddress"):
            return {'success': False, 'message': 'Wallet address already exists for this user.'}
        
        # 🟢 Use ObjectId for user_id when saving wallet address
        self.user_model.save_wallet_address(user["_id"], wallet_address)
        return {'success': True, 'message': 'Wallet address saved successfully.'}

    # 🆕 Function to get the wallet address by email or user ID
    def get_wallet_address(self, email_or_id):
        if not email_or_id:
            return {'success': False, 'message': 'User ID or email is required.'}

        user = None

        # 🟢 Validate and determine if input is ObjectID or email
        if ObjectId.is_valid(email_or_id):
            print(f"Handling as ObjectID: {email_or_id}")
            user = self.user_model.find_by_id(email_or_id)
        else:
            print(f"Handling as Email: {email_or_id}")
            user = self.user_model.find_by_email(email_or_id)

        if user and "walletAddress" in user:
            return {'success': True, 'walletAddress': user.get("walletAddress")}
        else:
            return {'success': False, 'message': 'Wallet address not found for this user.'}
        
    def get_user_by_wallet(self, wallet_address):
     """Retrieve a user by their wallet address using the UserModel."""
     if not wallet_address:
        return None
    
     return self.user_model.find_by_wallet_address(wallet_address)
 