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



app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app, resources={
    r"/*": {
        "origins": "*",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"]
    }
})

app.config.from_object(Config)
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
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    try:
        # First try to serve static files from the frontend/build directory
        return app.send_static_file(path)
    except:
        # If not found, return index.html for client-side routing
        return app.send_static_file('index.html')
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=True)

