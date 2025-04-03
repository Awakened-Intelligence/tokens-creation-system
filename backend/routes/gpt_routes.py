# from flask import Blueprint, request, jsonify
# from services.gpt_service import generate_smart_contract

# gpt_bp = Blueprint("gpt", __name__)

# @gpt_bp.route('/generate-smart-contract', methods=['POST'])
# def generate_contract():
#     try:
#         # Extract JSON payload from frontend or Postman
#         data = request.json  

#         # Debugging: Print the received payload
#         print(" Received Payload:", data)

#         # Ensure all required fields are present
#         required_fields = ["token_name", "token_symbol", "total_supply", "decimals", "burn_rate", "staking", "mintable"]
#         for field in required_fields:
#             if field not in data:
#                 return jsonify({"error": f"Missing required field: {field}"}), 400

#         # Call GPT-4 to generate Solidity smart contract
#         solidity_code = generate_smart_contract(data)  

#         # Return generated contract to frontend/Postman
#         return jsonify({"smart_contract_code": solidity_code}), 200

#     except Exception as e:
#         print(" Backend Error:", str(e))  # Debugging
#         return jsonify({"error": str(e)}), 400

from flask import Blueprint, request, jsonify
from services.gpt_service import generate_smart_contract

gpt_bp = Blueprint("gpt", __name__)

@gpt_bp.route('/generate-smart-contract', methods=['POST'])
def generate_contract():
    try:
        data = request.json
        print("Received Payload:", data)

        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Convert string inputs to appropriate types
        try:
            processed_data = {
                "token_name": str(data.get('token_name', '')),
                "token_symbol": str(data.get('token_symbol', '')),
                "total_supply": int(data.get('total_supply', '')),
                "decimals": int(data.get('decimals', 18)),
                "burn_rate": float(data.get('burn_rate', 0)),
                "staking": bool(data.get('staking', False)),
                "mintable": bool(data.get('mintable', False)),
                "network": str(data.get('network', '')) 
            }
        except (ValueError, TypeError) as e:
            return jsonify({
                "success": False,
                "error": f"Error converting data types: {str(e)}"
            }), 400

        #  Network validation
        valid_networks = ["Ethereum", "BEP-20", "Solana"]
        if processed_data["network"] not in valid_networks:
            return jsonify({
                "success": False,
                "error": f"Invalid network. Supported networks are: {', '.join(valid_networks)}"
            }), 400

        # Generate smart contract
        solidity_code = generate_smart_contract(processed_data)

        if solidity_code.startswith("Error") or solidity_code.startswith("Unexpected error"):
            return jsonify({
                "success": False,
                "error": solidity_code
            }), 500

        return jsonify({
            "success": True,
            "smart_contract_code": solidity_code,
            "contract_code": solidity_code,
            "token_name": processed_data["token_name"],
            "token_symbol": processed_data["token_symbol"],
            "total_supply": processed_data["total_supply"]
        }), 200

    except Exception as e:
        print("Backend Error:", str(e))
        return jsonify({
            "success": False,
            "error": f"Server error: {str(e)}"
        }), 500
