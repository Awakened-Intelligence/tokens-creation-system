# import os
# from dotenv import load_dotenv

# # Load environment variables from .env
# load_dotenv()

# class Config:
#     OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
#     API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:5000")
    
#     # Toggle between GPT-3.5 & GPT-4 easily
#     USE_GPT4 = os.getenv("USE_GPT4", "False").lower() == "true"

import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

class Config:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    API_BASE_URL = os.getenv("API_BASE_URL", "http://127.0.0.1:5000")
    FRONTEND_URL = os.getenv("FRONTEND_URL","http://localhost:3000")
    MONGO_URI = os.getenv("MONGO_URI")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    EMAIL_USER = os.getenv("EMAIL_USER")
    EMAIL_PASS = os.getenv("EMAIL_PASS")
    INFURA_URL=os.getenv("INFURA_URL")
    INFURA_PRIVATE_KEY=os.getenv("INFURA_PRIVATE_KEY")
    WALLET_ADDRESS=os.getenv("WALLET_ADDRESS")


 # Web3 Instance
    web3 = Web3(Web3.HTTPProvider(INFURA_URL))
    if web3.is_connected():
     print("Connected to Ethereum Sepolia via Infura")
    else:
     print(" Failed to connect to Ethereum network")

     # Ethereum account derived from private key
     ACCOUNT = web3.eth.account.from_key(INFURA_PRIVATE_KEY)
     WALLET_ADDRESS = ACCOUNT.address