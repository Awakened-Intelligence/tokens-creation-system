from flask import Flask
import os
from flask_cors import CORS
from database.db import db  # Correct import
from flask_jwt_extended import JWTManager
from config import Config
from routes.gpt_routes import gpt_bp
from routes.Auth_routes import auth_bp
from routes.blockchain_routes import blockchain_bp
from routes.token_routes import token_bp



app = Flask(__name__)
CORS(app)

app.config.from_object(Config)
FRONTEND_URL = app.config["FRONTEND_URL"]

# ⑤ apply CORS, restricting to that single origin
CORS(
    app,
    origins=[FRONTEND_URL],
    supports_credentials=True,
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"]
)
jwt = JWTManager(app)

# Register Blueprints
app.register_blueprint(gpt_bp, url_prefix='/gpt')
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(token_bp, url_prefix="/tokens")
app.register_blueprint(blockchain_bp, url_prefix="/blockchain")
# Test Route to Confirm DB Connection
@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        db.command("ping")
        return {"message": "MongoDB Connected Successfully!"}, 200
    except Exception as e:
        return {"error": str(e)}, 500
@app.route('/')
def home():
    return "Hello, this is the root route!"
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)