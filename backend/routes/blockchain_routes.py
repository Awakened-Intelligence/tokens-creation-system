from flask import Blueprint, request, jsonify
from services.blockchain_service import deploy_contract,verify_contract, flatten_contract
from web3 import Web3

blockchain_bp = Blueprint("blockchain", __name__)




@blockchain_bp.route("/get-deploy-tx", methods=["POST"])
def get_unsigned_tx():
    try:
        data = request.json
        print("📥 Received Deployment Payload:", data)

        contract_code = data.get("contract_code")
        token_name = data.get("token_name")
        token_symbol = data.get("token_symbol")
        total_supply = data.get("total_supply")
        wallet_address = data.get("wallet_address")

        if not all([contract_code, token_name, token_symbol, total_supply, wallet_address]):
            return jsonify({"success": False, "message": "Missing required fields"}), 400

        deploy_result = deploy_contract(contract_code, token_name, token_symbol, total_supply, wallet_address)
        if "error" in deploy_result:
            return jsonify({"success": False, "message": deploy_result["error"]}), 500

        # Return the minimal transaction data
        return jsonify({
            "success": True,
            "unsignedTx": deploy_result["unsigned_tx"],

            # Optionally, return these if you want to call verify later:
            "abi": deploy_result["abi"],
            "bytecode": deploy_result["bytecode"],
            "flattened_contract_path": deploy_result["flattened_contract_path"],
            "token_name": deploy_result["token_name"],
            "token_symbol": deploy_result["token_symbol"],
            "total_supply": deploy_result["total_supply"],
        })

    except Exception as e:
        print("❌ Error in get-deploy-tx:", str(e))
        return jsonify({"success": False, "message": str(e)}), 500


@blockchain_bp.route("/verify-contract", methods=["POST"])
def verify_contract_route():
    data = request.json
    contract_address = data.get("contract_address")
    flattened_contract_path = data.get("flattened_contract_path")
    deployment_bytecode = data.get("deployment_bytecode")
    token_name = data.get("token_name")
    token_symbol = data.get("token_symbol")
    total_supply = data.get("total_supply")
    if not all([contract_address, flattened_contract_path, deployment_bytecode, token_name, token_symbol, total_supply]):
        return jsonify({"success": False, "message": "Missing verification fields"}), 400

    verification_status = verify_contract(
        contract_address,
        flattened_contract_path,
        deployment_bytecode,
        token_name,
        token_symbol,
        total_supply
    )
    return jsonify({"success": True, "verification_status": verification_status})