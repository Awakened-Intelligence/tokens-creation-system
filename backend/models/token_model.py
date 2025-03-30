from database.db import db

class TokenModel:
    def __init__(self, db):
        self.collection = db.tokens  # Collection name

    def create_token(self, data):
        return self.collection.insert_one(data)

    def get_tokens(self, user_id):
        return list(self.collection.find({"user_id": user_id}, {"_id": 0}))  # Exclude ObjectId

token_model = TokenModel(db)
