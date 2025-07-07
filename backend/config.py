import os
from web3 import Web3
from dotenv import load_dotenv
from datetime import timedelta


load_dotenv()

class Config:
    # GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
   #  API_BASE_URL = os.getenv("API_BASE_URL", "https://49a2f327-6c4f-4d57-be79-c89166596690-00-1p2yyelcsyfe2.sisko.replit.dev")
    API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:5000")
   
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    # FRONTEND_URL = os.getenv("FRONTEND_URL", "https://main.d201un3f52wjey.amplifyapp.com")
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    ETHEREUM_URL=os.getenv("ETHEREUM_URL")
   #  INFURA_PRIVATE_KEY=os.getenv("INFURA_PRIVATE_KEY")
   #  WALLET_ADDRESS=os.getenv("WALLET_ADDRESS")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)  # Token expires after 2 hours



 # Web3 Instance
    web3 = Web3(Web3.HTTPProvider(ETHEREUM_URL))
    if web3.is_connected():
     print("Connected to Ethereum Sepolia via Infura")
    else:
     print(" Failed to connect to Ethereum network")

     # Ethereum account derived from private key
   #   ACCOUNT = web3.eth.account.from_key(INFURA_PRIVATE_KEY)
   #   WALLET_ADDRESS = ACCOUNT.address