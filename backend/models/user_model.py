from flask_bcrypt import generate_password_hash, check_password_hash
from bson import ObjectId 
from datetime import datetime

class UserModel:
    def __init__(self, db):
        self.collection = db['users']

    def create_user(self, username, email, password, verification_token,wallet_address=None):
        hashed_password = generate_password_hash(password).decode('utf-8')
        user_data = {
            "username": username,
            "email": email,
            "password": hashed_password,
            "is_verified": False,
            "verification_token": verification_token,
            "created_at": datetime.utcnow(),
            "walletAddress": wallet_address
        }
        return self.collection.insert_one(user_data)

    def find_by_email(self, email):
        return self.collection.find_one({"email": email})
    
    # 🆕 Find user by MongoDB ObjectID
    def find_by_id(self, user_id):
        try:
            return self.collection.find_one({"_id": ObjectId(user_id)})
        except Exception as e:
            print("Error finding user by ID:", e)
            return None

    def verify_password(self, password, hashed_password):
        return check_password_hash(hashed_password, password)

    def update_password(self, email, new_password):
        """Update user password and hash it before storing."""
        hashed_password = generate_password_hash(new_password).decode('utf-8')
        return self.collection.update_one(
            {"email": email},
            {"$set": {"password": hashed_password}}
        )

    def find_by_reset_token(self, reset_token):
        """Find user by reset token."""
        return self.collection.find_one({"reset_token": reset_token})

    def set_reset_token(self, email, reset_token):
        """Store a reset token for password reset."""
        return self.collection.update_one(
            {"email": email},
            {"$set": {"reset_token": reset_token}}
        )

    def clear_reset_token(self, email):
        """Remove the reset token after password reset is completed."""
        return self.collection.update_one(
            {"email": email},
            {"$unset": {"reset_token": ""}}
        )

      # 🆕 Unified Method: Save wallet address by email or ObjectID
    def save_wallet_address(self, email_or_id, wallet_address):
        try:
            if ObjectId.is_valid(email_or_id):
                # If the input is a valid ObjectID, use it for querying
                query = {"_id": ObjectId(email_or_id)}
            else:
                # Otherwise, treat it as an email
                query = {"email": email_or_id}
            
            return self.collection.update_one(
                query,
                {"$set": {"walletAddress": wallet_address}}
            )
        except Exception as e:
            print("Error saving wallet address:", e)
            return None

    # 🆕 Unified Method: Retrieve the wallet address by email or ObjectID
    def get_wallet_address(self, email_or_id):
        try:
            user = self.find_by_id(email_or_id) or self.find_by_email(email_or_id)
            return user.get("walletAddress") if user else None
        except Exception as e:
            print("Error getting wallet address:", e)
            return None
        
    def find_by_wallet_address(self, wallet_address):
      """Find a user by wallet address."""
      return self.collection.find_one({"walletAddress": wallet_address})
