# from openai import OpenAI

# API_KEY = "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"

# client = OpenAI(api_key=API_KEY)

# try:
#     models = client.models.list()
#     print(" Available Models:")
#     for model in models.data:
#         print("-", model.id)
# except Exception as e:
#     print(" Error:", e)
import requests
from config import Config

API_URL = "https://api.deepseek.com/v1/chat/completions"  # Replace with actual Deepseek API endpoint
API_KEY = Config.DEEPSEEK_API_KEY

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

def generate_smart_contract(parameters):
    try:
        payload = {
            "model": "deepseek-coder",  # Replace with appropriate Deepseek model
            "messages": [
                {
                    "role": "user",
                    "content": f"Generate a Solidity smart contract with these parameters: {parameters}"
                }
            ]
        }
        
        response = requests.post(API_URL, headers=headers, json=payload)
        response.raise_for_status()
        
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        return f"Error generating Solidity contract: {str(e)}"