import openai
from config import Config

openai.api_key = Config.OPENAI_API_KEY

def generate_smart_contract(token_data):
    try:
        base_prompt = f"""
        Write a secure smart contract with the following specifications:
        - Token Name: {token_data['token_name']}
        - Symbol: {token_data['token_symbol']}
        - Total Supply: {token_data['total_supply']}
        - Decimals: {token_data['decimals']}
        - Network: {token_data['network']}
        - Burn Rate: {token_data['burn_rate']}%
        - Staking Enabled: {'Yes' if token_data['staking'] else 'No'}
        - Mintable: {'Yes' if token_data['mintable'] else 'No'}
        - Uses pragma solidity ^0.8.20;
        - Uses OpenZeppelin v5.2.0
        """

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a smart contract expert that writes secure, efficient Solidity code."},
                {"role": "user", "content": base_prompt}
            ],
            temperature=0.2,
            max_tokens=2000
        )

        contract_code = response.choices[0].message.content

        # Clean up the response
        if "```solidity" in contract_code:
            contract_code = contract_code.split("```solidity")[1].split("```")[0].strip()
        elif "```" in contract_code:
            contract_code = contract_code.split("```")[1].strip()

        return contract_code

    except Exception as e:
        print("❌ Generation Error:", str(e))
        return f"Error generating smart contract: {str(e)}"