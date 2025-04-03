


# import os
# import json
# from web3 import Web3
# from solcx import compile_source, install_solc
# from dotenv import load_dotenv
# from models.user_model import UserModel
# from database.db import db
# from services.Auth_service import AuthService

# # Load environment variables
# load_dotenv()

# INFURA_URL = os.getenv("INFURA_URL")
# INFURA_PRIVATE_KEY=os.getenv("INFURA_PRIVATE_KEY")
# print(f"🧾 Loaded Private Key in blockchain_service.py: {os.getenv('INFURA_PRIVATE_KEY')[:6]}...{os.getenv('INFURA_PRIVATE_KEY')[-4:]}")

# # Ensure Solidity version is installed
# install_solc("0.8.0")

# # Connect to Infura
# web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# if web3.is_connected():
#     print("✅ Connected to Ethereum Sepolia Testnet via Infura",INFURA_URL)
# else:
#     raise Exception("❌ Connection to Ethereum network failed")

# # Initialize UserModel and AuthService
# user_model = UserModel(db)
# auth_service = AuthService()

# def deploy_ai_generated_contract(solidity_code, email):
#     """
#     Deploy an AI-generated Solidity contract to Ethereum using the user's wallet address.

#     :param solidity_code: The Solidity contract code as a string.
#     :param email: The email of the user deploying the contract.
#     :return: Dictionary containing contract address, transaction hash, and ABI.
#     """
#     try:
#         # Get the user's wallet address using AuthService
#         user_wallet_response = auth_service.get_wallet_address(email)

#         if not user_wallet_response['success']:
#             return {"error": "User wallet address not found or not set."}

#         wallet_address = user_wallet_response['walletAddress']

#         # Fetch the private key associated with the user's wallet
#         private_key = os.getenv("INFURA_PRIVATE_KEY")
#         print(f"🔍 Loaded Private Key: {private_key[:6]}...{private_key[-4:]}")
#         # You might need a different approach if using dynamic keys

#         if not private_key:
#             return {"error": "Private key not found in environment variables."}

#         # Compile Solidity Code
#         compiled_sol = compile_source(solidity_code, solc_version="0.8.0")

#         # Extract contract interface (ABI & Bytecode)
#         contract_id, contract_interface = compiled_sol.popitem()
#         abi = contract_interface["abi"]
#         bytecode = contract_interface["bin"]

#         # Create contract object
#         contract = web3.eth.contract(abi=abi, bytecode=bytecode)

#         # Build transaction
#         txn = contract.constructor().build_transaction({
#             "from": wallet_address,
#             "nonce": web3.eth.get_transaction_count(wallet_address),
#             "gasPrice": web3.eth.gas_price,
#             "gas": 3000000,  # Setting an appropriate gas limit
#         })

#         # Signing transaction
#         signed_txn = web3.eth.account.sign_transaction(txn, private_key)

#         # Sending transaction
#         tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

#         print(f"✅ Transaction sent! Waiting for confirmation... TX Hash: {tx_hash.hex()}")

#         # Waiting for transaction receipt
#         receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

#         print(f"✅ Contract successfully deployed at: {receipt.contractAddress}")

#         return {
#             "contract_address": receipt.contractAddress,
#             "transaction_hash": tx_hash.hex(),
#             "abi": abi
#         }

#     except Exception as e:
#         print(f"❌ Error deploying contract: {e}")
#         return {"error": str(e)}

# above code is for different wallet but below code is for deploymrnt through infura and a succcesful code

# import os
# import json
# from web3 import Web3
# from solcx import compile_files, install_solc
# from dotenv import load_dotenv

# # Load environment variables
# load_dotenv()

# INFURA_URL = os.getenv("INFURA_URL")
# INFURA_PRIVATE_KEY = os.getenv("INFURA_PRIVATE_KEY")

# install_solc("0.8.9")  # Ensure correct Solidity version

# web3 = Web3(Web3.HTTPProvider(INFURA_URL))

# if web3.is_connected():
#     print("✅ Connected to Ethereum Sepolia Testnet via Infura")
# else:
#     raise Exception("❌ Connection to Ethereum network failed")


# def deploy_ai_generated_contract(solidity_code, email):
#     try:
#         wallet_address = "0x09E172C289f2DDe8363D43db4cF92776e81A8f64"
#         private_key = os.getenv("INFURA_PRIVATE_KEY")

#         if not private_key:
#             return {"error": "Private key not found in environment variables."}

#         # **Overwrite MyToken.sol with Generated Solidity Code**
#         contract_path = os.path.abspath("./@openzeppelin/contracts/MyToken.sol")
#         with open(contract_path, "w") as f:
#             f.write(solidity_code)

#         print(f"📂 Solidity file overwritten at: {contract_path}")

#         # **Compile the Updated MyToken.sol**
#         compiled_sol = compile_files([contract_path], output_values=["bin", "abi"], solc_version="0.8.9")

#         # Extract compiled contract details
#         contract_key = list(compiled_sol.keys())[0]  # Get first contract compiled
#         contract_interface = compiled_sol[contract_key]
#         abi = contract_interface["abi"]
#         bytecode = contract_interface["bin"]

#         if not bytecode:
#             raise Exception("❌ Error: Compiled bytecode is empty!")

#         contract = web3.eth.contract(abi=abi, bytecode=bytecode)

#         txn = contract.constructor().build_transaction({
#             "from": wallet_address,
#             "nonce": web3.eth.get_transaction_count(wallet_address),
#             "gasPrice": web3.eth.gas_price,
#             "gas": 3500000,
#         })

#         signed_txn = web3.eth.account.sign_transaction(txn, private_key)
#         tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

#         print(f"✅ Transaction sent! Waiting for confirmation... TX Hash: {tx_hash.hex()}")

#         receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
#         print(f"✅ Contract successfully deployed at: {receipt.contractAddress}")

#         return {
#             "contract_address": receipt.contractAddress,
#             "transaction_hash": tx_hash.hex(),
#             "abi": abi
#         }

#     except Exception as e:
#         print(f"❌ Error deploying contract: {e}")
#         return {"error": str(e)}

import os
import json
import requests
import re
import traceback
import subprocess
from web3 import Web3
from solcx import compile_files, install_solc
from dotenv import load_dotenv
from eth_abi import encode

# Load environment variables
load_dotenv()

INFURA_URL = os.getenv("INFURA_URL")
INFURA_PRIVATE_KEY = os.getenv("INFURA_PRIVATE_KEY")
LINEASCAN_API_KEY = os.getenv("LINEASCAN_API_KEY")
CHAIN_ID = os.getenv("CHAIN_ID", "5")  # Default to Goerli

install_solc("0.8.20")  # Ensure correct Solidity version

web3 = Web3(Web3.HTTPProvider(INFURA_URL))

if web3.is_connected():
    print("✅ Connected to Ethereum Sepolia Testnet via Infura")
else:
    raise Exception("❌ Connection to Ethereum network failed")


# Auto-flatten contract for verification (not for deployment)


def flatten_contract():
    """Runs Hardhat flatten command and cleans the output for deployment."""
    try:
        print("🔄 Flattening contract using Hardhat for deployment...")

        # Set the Hardhat project directory
        hardhat_project_path = os.path.abspath("@openzeppelin/contracts")

        flatten_cmd = "npx hardhat flatten MyToken.sol > flattened_MyToken.sol"
        subprocess.run(flatten_cmd, shell=True, check=True, cwd=hardhat_project_path)

        flattened_path = os.path.abspath("./@openzeppelin/contracts/flattened_MyToken.sol")

        # Read the flattened file
        with open(flattened_path, "r") as f:
            flattened_code = f.readlines()

        # ✅ Step 1: Remove duplicate SPDX, pragma, and unnecessary lines
        cleaned_code = []
        found_spdx = False
        found_pragma = False

        for line in flattened_code:
            stripped_line = line.strip()

            # Ensure only one SPDX-License-Identifier
            if "SPDX-License-Identifier" in stripped_line:
                if found_spdx:
                    continue  # Skip duplicates
                found_spdx = True
            elif "pragma solidity" in stripped_line:
                if found_pragma:
                    continue  # Skip duplicates
                found_pragma = True
            elif "import" in stripped_line or stripped_line.startswith("// File"):
                continue  # Remove imports and file headers
            elif "Sources flattened with hardhat" in stripped_line or "Original license:" in stripped_line:
                continue  # Remove metadata comments
            
            cleaned_code.append(line)

        # ✅ Step 2: Ensure SPDX-License-Identifier is at the **very top**
        final_code = []
        for line in cleaned_code:
            if "SPDX-License-Identifier" in line:
                final_code.append(line)  # Place SPDX at the top
                break

        # Remove any remaining SPDX License Identifiers in the rest of the code
        final_code.extend(
            [line for line in cleaned_code if "SPDX-License-Identifier" not in line]
        )

        # ✅ Step 3: Ensure pragma solidity is **right after SPDX** without duplicates
        pragma_found = False
        reordered_code = []

        for line in final_code:
            if "pragma solidity" in line and not pragma_found:
                pragma_found = True
                continue  # Skip adding it now, we will insert it correctly later
            elif "pragma solidity" in line and pragma_found:
                continue  # Remove duplicate pragmas
            elif line.strip() == "" and len(reordered_code) < 2:
                continue  # Ensure no extra blank lines

            reordered_code.append(line)

        # ✅ Insert `pragma solidity` **immediately after SPDX**
        if len(reordered_code) > 0 and "SPDX-License-Identifier" in reordered_code[0]:
            reordered_code.insert(1, "pragma solidity ^0.8.20;\n")

        # ✅ Remove blank lines immediately after pragma solidity
        while len(reordered_code) > 2 and reordered_code[2].strip() == "":
            del reordered_code[2]

        # ✅ Step 5: Write the cleaned code back to the file
        with open(flattened_path, "w") as f:
            f.writelines(reordered_code)

        print("✅ Flattening completed and cleaned successfully!")

    except subprocess.CalledProcessError as e:
        print(f"❌ Flattening failed: {e}")
        raise Exception("Flattening process failed!")









# Extract contract name dynamically
def extract_contract_name(flattened_code):
    """
    Extracts the first contract name from Solidity code.
    Ensures it does not mistakenly select keywords or fragment words.
    """
    matches = re.findall(r'contract\s+([A-Za-z_][A-Za-z0-9_]*)\s+is\s+ERC20', flattened_code)
    if matches:
      return matches[-1]  # Return the last valid contract found (user's token contract)
    return None



# Extract constructor arguments dynamically
def extract_constructor_args(flattened_code, token_name, token_symbol, total_supply):
    match = re.search(r'constructor\s*\(\s*string\s+memory\s+([^,]+)\s*,\s*string\s+memory\s+([^,]+)\s*,\s*uint256\s+([^,]+)\s*\)', flattened_code)
    if match:
        # token_name, token_symbol, initial_supply = match.groups()
        
        # DEBUG PRINTS
        print(f"🔍 Extracted Constructor Arguments:")
        print(f"   - Token Name: {token_name}")
        print(f"   - Token Symbol: {token_symbol}")
        print(f"   - Total Supply: {total_supply}") 
        
        return [token_name, token_symbol, total_supply]
    return []




# Encode constructor arguments dynamically
def encode_constructor_args( token_name, token_symbol, total_supply):
    if not token_name or not token_symbol or not total_supply:
        print("❌ Error: Missing values for constructor arguments.")
        return ""

    # Convert total_supply to an integer before encoding
    encoded_args = encode(["string", "string", "uint256"], [token_name, token_symbol, int(total_supply)]).hex()

    print(f"🔍 Encoded Constructor Arguments: {encoded_args}")
    return encoded_args




# ✅ **DEPLOY CONTRACT FUNCTION WITH IMPROVEMENTS**
def deploy_contract(solidity_code, token_name, token_symbol, total_supply, wallet_address):
    try:
        wallet_address = "0xd6911844c087145dbD28bD534F6e67333F5DE81b"
        private_key = os.getenv("INFURA_PRIVATE_KEY")

        if not private_key:
            return {"error": "Private key not found in environment variables."}

        # ✅ **Step 1: Remove old flattened contract files before deployment**
        contracts_dir = "./@openzeppelin/contracts/"
        token_files = [f for f in os.listdir(contracts_dir) if f.startswith("flattened_MyToken_sol")]
        for file in token_files:
            os.remove(os.path.join(contracts_dir, file))
        print(f"🗑️ Removed old flattened contract files: {token_files}")

        # **Step 2: Overwrite MyToken.sol with Generated Solidity Code**
        contract_path = os.path.abspath("./@openzeppelin/contracts/MyToken.sol")
        with open(contract_path, "w") as f:
            f.write(solidity_code)

        print(f"📂 Solidity file overwritten at: {contract_path}")

        # **Step 3: Flatten the Contract to Ensure Import Consistency**
        flatten_contract()

        # **Step 4: Read Flattened Solidity Contract for Deployment**
        flattened_contract_path = os.path.abspath("./@openzeppelin/contracts/flattened_MyToken.sol")
        print(f"✅ Flattened contract path: {flattened_contract_path}")
        print(f"✅ File exists: {os.path.exists(flattened_contract_path)}")

        if not os.path.exists(flattened_contract_path):
            raise Exception("❌ Flattened contract file not found!")

        with open(flattened_contract_path, "r") as f:
            flattened_code = f.read()
        print("📜 Solidity Code Extracted:\n", flattened_code[:1000])

        # ✅ Fix missing `Ownable(msg.sender)` in constructor if needed
        if "Ownable(" in flattened_code and "Ownable(msg.sender)" not in flattened_code:
            flattened_code = flattened_code.replace("Ownable(", "Ownable(msg.sender, ") 

        with open(flattened_contract_path, "w") as f:
            f.write(flattened_code)

        print("📜 Solidity Code Sent to Infura for Deployment:\n", flattened_code[:500], "...")

        # **Step 5: Compile the Flattened Contract**
        compiled_sol = compile_files(
            [flattened_contract_path], 
            output_values=["bin", "abi"], 
            solc_version="0.8.20", 
            evm_version="paris",
            optimize=True,
            optimize_runs=200
        )

        # ✅ Debug: Print Available Contract Names
        contract_keys = list(compiled_sol.keys())
        print(f"🔍 Compiled contracts found: {contract_keys}")

        # **Step 6: Extract Contract Name & Match Dynamically**
        contract_name = extract_contract_name(flattened_code)
        print(f"✅ Extracted Contract Name: {contract_name}")

        contract_key = None
        for key in contract_keys:
            if contract_name.lower() in key.lower():
                contract_key = key
                break

        if not contract_key:
            print("❌ Error: No matching contract found for contract name:", contract_name)
            return {
                "error": "No matching contract found.",
                "extracted_name": contract_name,
                "available_keys": contract_keys
            }

        # ✅ Contract found: Proceed with deployment
        contract_interface = compiled_sol[contract_key]
        abi = contract_interface["abi"]
        bytecode = contract_interface["bin"]

        # ✅ Extract Constructor Arguments & Encode them
        # ✅ Extract Constructor Arguments from Payload (not Solidity)
        constructor_args = extract_constructor_args(flattened_code, token_name, token_symbol, total_supply)

        if len(constructor_args) != 3:
            print("❌ Error: Failed to extract valid constructor arguments.")
            return {"error": "Invalid constructor arguments extracted."}

        print(f"🔍  Constructor Arguments: {constructor_args}")

        # ✅ Fix encode_constructor_args Call
        encoded_args = encode_constructor_args(*constructor_args)
        print(f"🔍 Encoded Constructor Arguments: {encoded_args}")
        


        # ✅ Append constructor arguments to the bytecode
        bytecode += encoded_args

        if not bytecode or len(bytecode) < 10:
            print("❌ Compiled bytecode is empty! Available contracts:", contract_keys)
            return {
                "error": "Compiled bytecode is empty!",
                "available_contracts": contract_keys,
                "solidity_file": flattened_contract_path,
                "flattened_code_preview": flattened_code[:500]  # Debugging
            }

        print(f"🔍 ABI Sent for Deployment: {json.dumps(abi, indent=2)[:500]}...")
        print(f"🔍 Bytecode Sent for Deployment: {bytecode[:100]}...")

        contract = web3.eth.contract(abi=abi, bytecode=bytecode)
        gas_price = web3.eth.gas_price
        safe_gas_price = min(gas_price, web3.to_wei(50, 'gwei'))

        txn = contract.constructor(token_name, token_symbol, int(total_supply)).build_transaction({
            "from": wallet_address,
            "nonce": web3.eth.get_transaction_count(wallet_address),
            "gasPrice": safe_gas_price, 
            "gas": 1500000,
        })

        signed_txn = web3.eth.account.sign_transaction(txn, private_key)
        tx_hash = web3.eth.send_raw_transaction(signed_txn.raw_transaction)

        print(f"✅ Transaction sent! Waiting for confirmation... TX Hash: {tx_hash.hex()}")

        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        print(f"✅ Contract successfully deployed at: {receipt.contractAddress}")

        # **Step 7: Verify the Contract**
        verification_status = verify_contract(receipt.contractAddress, flattened_contract_path, bytecode )

        return {
            "contract_address": receipt.contractAddress,
            "transaction_hash": tx_hash.hex(),
            "bytecode": bytecode,
            "abi": abi,
            "verification_status": verification_status
        }

    except Exception as e:
        print("❌ Deployment failed!")
        traceback.print_exc()
        return {"error": str(e)}

def broadcast_signed_tx(signed_tx):
    try:
        tx_hash = web3.eth.send_raw_transaction(signed_tx)
        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

        print(f"✅ Transaction Broadcasted! TX Hash: {tx_hash.hex()}")
        
        return {"transaction_hash": tx_hash.hex(), "contract_address": receipt.contractAddress}

    except Exception as e:
        print("❌ Error broadcasting transaction!")
        traceback.print_exc()
        return {"error": str(e)}



# ✅ **VERIFY CONTRACT WITH FLATTENED CODE**
def verify_contract(contract_address, flattened_contract_path, deployment_bytecode, token_name, token_symbol, total_supply):
    """Verifies contract on LineaScan using the flattened contract."""

    try:
        # **Step 1: Read Flattened Contract for Verification**
        if not os.path.exists(flattened_contract_path):
            raise Exception("❌ Flattened contract file not found!")

        with open(flattened_contract_path, "r") as f:
            flattened_code = f.read()

        # **Step 2: Ensure `Ownable(msg.sender)` Fix is Applied**
        # if "Ownable(" in flattened_code and "Ownable(msg.sender)" not in flattened_code:
        #     flattened_code = flattened_code.replace("Ownable(", "Ownable(msg.sender, ") 
        #     with open(flattened_contract_path, "w") as f:
        #         f.write(flattened_code)

        # **Step 3: Extract Contract Name**
        contract_name = extract_contract_name(flattened_code)
        if not contract_name:
            return {"error": "Failed to extract contract name from Solidity code"}

        print(f"🔍 Verifying contract {contract_name} at {contract_address} on LineaScan...")

        constructor_args = extract_constructor_args(flattened_code, token_name, token_symbol, total_supply)

        if len(constructor_args) != 3:
            print("❌ Error: Failed to extract valid constructor arguments.")
            return {"error": "Invalid constructor arguments extracted."}

        print(f"🔍  Constructor Arguments: {constructor_args}")

        # ✅ Fix encode_constructor_args Call
        encoded_args = encode_constructor_args(*constructor_args)
        print(f"🔍 Encoded Constructor Arguments: {encoded_args}")

        # **Step 5: Compile the Flattened Contract for Bytecode Matching**
        compiled_verification = compile_files(
            [flattened_contract_path], 
            output_values=["bin", "abi"], 
            solc_version="0.8.20", 
            evm_version="paris"
        )

        # **Step 6: Extract Bytecode and ABI for Debugging**
        verification_bytecode = compiled_verification[f"@openzeppelin/contracts/flattened_MyToken.sol:{contract_name}"]["bin"]
        if verification_bytecode != deployment_bytecode:
            print("❌ ERROR: Bytecode Mismatch! Verification will fail.")
            return {"error": "Bytecode mismatch! Verification failed."}
        else:
            print("✅ Bytecode Match Confirmed!")        
        verification_abi = compiled_verification[f"@openzeppelin/contracts/flattened_MyToken.sol:{contract_name}"]["abi"]

        print(f"🔍 Bytecode Sent for Verification: {verification_bytecode[:100]}...")
        print(f"🔍 ABI Sent for Verification: {json.dumps(verification_abi, indent=2)[:500]}...")

        

        # **Step 7: Send Verification Request**
        verification_payload = {
            "apikey": LINEASCAN_API_KEY,
            "module": "contract",
            "action": "verifysourcecode",
            "contractaddress": contract_address,
            "sourceCode": flattened_code,
            "codeformat": "solidity-single-file",
            "contractname": contract_name,
            "compilerversion": "v0.8.20+commit.a1b79de6",
            "evmVersion": "paris",
            "constructorArguments": encoded_args,
            "optimizationUsed": "1",
            "runs": "200"
        }
             

        response = requests.post("https://api-sepolia.lineascan.build/api", data=verification_payload)
        response_json = response.json()
        print("🛠 Verification Response:", response_json)

        if "status" in response_json and response_json["status"] != "1":
            print("❌ Verification Failed! Check response for errors.")
            traceback.print_exc()  # Prints full error traceback

        return response_json

    except Exception as e:
        print("❌ Verification process failed!")
        traceback.print_exc()  # Prints full traceback
        return {"error": "Failed to parse verification response"}
