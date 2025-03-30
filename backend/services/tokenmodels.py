
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