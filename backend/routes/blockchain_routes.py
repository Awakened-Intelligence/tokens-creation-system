# from flask import Blueprint, request, jsonify
# # from flask_jwt_extended import jwt_required
# from services.blockchain_service import deploy_ai_generated_contract

# blockchain_bp = Blueprint("blockchain", __name__)

# @blockchain_bp.route("/deploy", methods=["POST"])
# # @jwt_required()
# def deploy():
#     try:
#         data = request.json
#         contract_code = data.get("contract_code")

#         if not contract_code:
#             return jsonify({"success": False, "message": "Contract code is required"}), 400

#         # Directly call the deployment function with a hardcoded wallet address
#         deployment_result = deploy_ai_generated_contract(contract_code, "test@example.com")

#         return jsonify({
#             "success": True,
#             "contract_address": deployment_result["contract_address"],
#             "transaction_hash": deployment_result["transaction_hash"]
#         })

#     except Exception as e:
#         return jsonify({"success": False, "message": str(e)}), 500

from flask import Blueprint, request, jsonify
from services.blockchain_service import deploy_contract, verify_contract, flatten_contract

blockchain_bp = Blueprint("blockchain", __name__)

@blockchain_bp.route("/deploy", methods=["POST"])
def deploy():
    try:
        data = request.json
        print("📥 Received Deployment Payload:", data)  # Debugging print

        contract_code = data.get("contract_code")
        token_name = data.get("token_name")
        token_symbol = data.get("token_symbol")
        total_supply = data.get("total_supply")

        if not contract_code or not token_name or not token_symbol or not total_supply:
            print("❌ Missing required fields:", {
                "contract_code": bool(contract_code),
                "token_name": bool(token_name),
                "token_symbol": bool(token_symbol),
                "total_supply": bool(total_supply),
            })
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        # Convert total_supply to integer (Ensure it's a valid number)
        try:
            total_supply = int(total_supply)
        except ValueError:
            print("❌ Error: `total_supply` must be a valid integer, received:", total_supply)
            return jsonify({"success": False, "message": "Invalid total supply format"}), 400

        # Deploy contract and verify it
        deployment_result = deploy_contract(contract_code, token_name, token_symbol, total_supply)

        return jsonify({
            "success": True,
            "contract_address": deployment_result["contract_address"],
            "transaction_hash": deployment_result["transaction_hash"],
            "verification_status": deployment_result["verification_status"]
        })

    except Exception as e:
        print("❌ Deployment Route Exception:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500



@blockchain_bp.route('/verify', methods=['POST'])
def verify_existing_contract():
    data = request.get_json()
    contract_address = data.get("contract_address")

    if not contract_address:
        return jsonify({"error": "Contract address is required"}), 400

    try:
        # Flatten the contract before verification
        flatten_contract()

        # Call the verification function
        verification_status = verify_contract(contract_address)

        return jsonify(verification_status)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
#     @blockchain_bp.route("/get-deploy-tx", methods=["POST"])
# def get_unsigned_tx():
#     try:
#         data = request.json
#         print("📥 Received Deployment Payload:", data)

#         # ✅ Extract required parameters
#         contract_code = data.get("contract_code")
#         token_name = data.get("token_name")
#         token_symbol = data.get("token_symbol")
#         total_supply = data.get("total_supply")
#         wallet_address = data.get("wallet_address")

#         if not all([contract_code, token_name, token_symbol, total_supply, wallet_address]):
#             return jsonify({"success": False, "message": "Missing required fields"}), 400

#         # ✅ Convert total_supply to integer
#         try:
#             total_supply = int(total_supply)
#         except ValueError:
#             return jsonify({"success": False, "message": "Invalid total supply format"}), 400

#         # ✅ Call deploy_contract to get an unsigned transaction
#         deploy_result = deploy_contract(contract_code, token_name, token_symbol, total_supply, wallet_address)

#         if "error" in deploy_result:
#             return jsonify({"success": False, "message": deploy_result["error"]}), 500

#         return jsonify({
#             "success": True,
#             "unsignedTx": deploy_result["unsigned_tx"],
#             "contractAddress": deploy_result.get("contract_address", None),
#         })

#     except Exception as e:
#         print("❌ Deployment Route Exception:", str(e))
#         return jsonify({"success": False, "message": str(e)}), 500


# # ✅ Step 2: Receive Signed Transaction and Broadcast it to the Blockchain
# @blockchain_bp.route("/send-signed-tx", methods=["POST"])
# def send_signed_tx():
#     try:
#         data = request.json
#         signed_tx = data.get("signed_tx")

#         if not signed_tx:
#             return jsonify({"success": False, "message": "Missing signed transaction"}), 400

#         # ✅ Broadcast signed transaction
#         tx_result = broadcast_signed_tx(signed_tx)

#         if "error" in tx_result:
#             return jsonify({"success": False, "message": tx_result["error"]}), 500

#         return jsonify({
#             "success": True,
#             "transaction_hash": tx_result["transaction_hash"],
#             "contract_address": tx_result.get("contract_address", None),
#         })

#     except Exception as e:
#         print("❌ Error broadcasting transaction:", str(e))
#         return jsonify({"success": False, "message": str(e)}), 500