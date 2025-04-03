# import openai
# import os
# from config import Config

# # Load OpenAI API Key
# client = openai.OpenAI(api_key=Config.OPENAI_API_KEY)

# def generate_smart_contract(token_data):
#     try:
#         # Construct the GPT-3.5-Turbo prompt
#         prompt = f"""
#         Write a Solidity smart contract with the following specifications:
#         - Token Name: {token_data['token_name']}
#         - Symbol: {token_data['token_symbol']}
#         - Total Supply: {token_data['total_supply']}
#         - Decimals: {token_data['decimals']}
#         - Burn Rate: {token_data['burn_rate']}%
#         - Staking Enabled: {'Yes' if token_data['staking'] else 'No'}
#         - Mintable: {'Yes' if token_data['mintable'] else 'No'}
        
#         Provide only the Solidity code without explanations.
#         """

#         # Use GPT-3.5-Turbo (Free)
#         model_choice = "gpt-3.5-turbo"

#         response = client.chat.completions.create(
#             model=model_choice,
#             messages=[
#                 {"role": "system", "content": "You are a Solidity smart contract generator."},
#                 {"role": "user", "content": prompt}
#             ],
#             temperature=0.5
#         )

#         # Extract Solidity code
#         solidity_code = response.choices[0].message.content
#         return solidity_code

#     except openai.OpenAIError as e:  # Correct error handling
#         print("OpenAI API Error:", str(e))
#         return f"Error generating Solidity contract: {str(e)}"
#     except Exception as e:  # Catch general errors
#         print("Unexpected Error:", str(e))
#         return f"Unexpected error: {str(e)}"

# import google.generativeai as genai
# from config import Config 

# def generate_smart_contract(token_data):
#     try:
#         # Configure the Gemini API
#         genai.configure(api_key=Config.GEMINI_API_KEY)
        
#         # Initialize the model
#         model = genai.GenerativeModel('gemini-pro')

#         # Base prompt for all tokens
#         base_prompt = f"""
#         Write a secure smart contract with the following specifications:
#         - Token Name: {token_data['token_name']}
#         - Symbol: {token_data['token_symbol']}
#         - Total Supply: {token_data['total_supply']}
#         - Decimals: {token_data['decimals']}
#         - Network: {token_data['network']}
#         - Burn Rate: {token_data['burn_rate']}%
#         - Staking Enabled: {'Yes' if token_data['staking'] else 'No'}
#         - Mintable: {'Yes' if token_data['mintable'] else 'No'}
#         """

#         # Adjust the prompt based on the selected network
#         if token_data['network'] == "Ethereum":
#             base_prompt += """
#             Create a complete, secure ERC20 token with the specified features.
#             Include all necessary IERC20 functions and events.
#             Implement burn functionality if burn rate > 0.
#             Implement staking functionality if staking is enabled.
#             Implement minting functionality if mintable is true.
#             Only provide the Solidity code without any explanations.
#             """
#         elif token_data['network'] == "BEP-20":
#             base_prompt += """
#            Create a BEP20 token smart contract for Binance Smart Chain (BSC).
#          - Ensure compatibility with BEP-20 standards, not just ERC-20.
#          - Implement the getOwner() function.
#          - Include functions for transfer, mint, burn, and pause as per BEP-20 guidelines.
#          - Optimize for BSC gas fees and ensure proper event handling for BSC.
#           - Avoid unnecessary ERC-20 extensions that are not BEP-20 specific.
#           Only provide the Solidity code without any explanations.
#          """
#         elif token_data['network'] == "Solana":
#             base_prompt += """
#             Create a Solana SPL token contract using Rust.
#             Include staking and minting logic if enabled.
#             Ensure proper handling of burn functionality if applicable.
#             Only provide the Rust code without any explanations.
#             """
#         else:
#             return "Error: Unsupported network specified."

#         # Generate the response
#         response = model.generate_content(base_prompt)
        
#         # Extract the code from the response
#         contract_code = response.text
        
#         # Clean up the response if needed
#         if "```solidity" in contract_code:
#             contract_code = contract_code.split("```solidity")[1].split("```")[0].strip()
#         elif "```rust" in contract_code:
#             contract_code = contract_code.split("```rust")[1].split("```")[0].strip()
#         elif "```" in contract_code:
#             contract_code = contract_code.split("```")[1].strip()
            
#         return contract_code

#     except Exception as e:
#         print("Generation Error:", str(e))
#         return f"Error generating smart contract: {str(e)}"

# import google.generativeai as genai
# from config import Config
# from google.generativeai import GenerativeModel, GenerationConfig
# import traceback


# def generate_smart_contract(token_data):
#     try:
#         # Configure the GenAI API
#         genai.configure(api_key=Config.GEMINI_API_KEY)

#         # Select a model that supports content generation
#         model_id = "models/gemini-1.5-pro-001"  # Choose an available model from the list
#         print(f"🔍 Using Model ID: {model_id}")

#         # Initialize the model properly
#         gemini_model = GenerativeModel(model_id)
#         print(f"✅ Model Initialized: {gemini_model}")

#         # Base prompt for all tokens
#         base_prompt = f"""
#         Write a secure smart contract with the following specifications:
#         - Token Name: {token_data['token_name']}
#         - Symbol: {token_data['token_symbol']}
#         - Total Supply: {token_data['total_supply']}
#         - Decimals: {token_data['decimals']}
#         - Network: {token_data['network']}
#         - Burn Rate: {token_data['burn_rate']}%
#         - Staking Enabled: {'Yes' if token_data['staking'] else 'No'}
#         - Mintable: {'Yes' if token_data['mintable'] else 'No'}
#         """

#         # Adjust the prompt based on the selected network
#         if token_data['network'] == "Ethereum":
#             base_prompt += """
#             Create a complete, secure ERC20 token with the specified features.
#             - Implements OpenZeppelin’s ERC20 standard.
#             - Uses `_beforeTokenTransfer` **(NOT `_beforeTransfer`)** when overriding transfer logic.
#             Include all necessary IERC20 functions and events.
#             Implement burn functionality if burn rate > 0.
#             Implement staking functionality if staking is enabled.
#             Implement minting functionality if mintable is true.
#             Use the import statement for OpenZeppelin's ERC20 standard: import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
#             Only provide the Solidity code without any explanations.
#             """

#         # Prepare the generation configuration
#         generation_config = GenerationConfig(max_output_tokens=1024)
#         print(f"🚦 Sending Request to GenAI with Prompt Length: {len(base_prompt)}")

#         # Generate the response using the proper method
#         response = gemini_model.generate_content([
#             base_prompt
#         ], generation_config=generation_config, safety_settings={})

#         print("🧠 GenAI Response Received")
#         print(f"Raw Response: {response}")

#         # Correctly access the candidates directly from the response object
#         if response and response.candidates:
#             contract_code = response.candidates[0].content.parts[0].text
#             print("✅ Contract Code Extracted")

#             # Replace incorrect import path with the correct relative path
#             # contract_code = contract_code.replace(
#             #     "import '@openzeppelin/contracts/token/ERC20/ERC20.sol';",
#             #     "import './@openzepplin/contracts/token/ERC20/ERC20.sol';"

#             # )

#             # Strip Markdown code fencing if present
#             if "```solidity" in contract_code:
#                 contract_code = contract_code.replace("```solidity", "").replace("```", "").strip()

#             print("🚦 Cleaned Up Solidity Code:")
            

#             return contract_code
#         else:
#             print("❌ Error: No candidates found in GenAI model response.")
#             return "Error: No candidates found in GenAI model response."

#     except Exception as e:
#         print("❌ Generation Error:", str(e))
#         traceback.print_exc()
#         return f"Error generating smart contract: {str(e)}"




import google.generativeai as genai
from config import Config
from google.generativeai import GenerativeModel, GenerationConfig
import traceback
import re  # Import regex for enforcing Solidity version

def generate_smart_contract(token_data):
    try:
        # Configure the GenAI API
        genai.configure(api_key=Config.GEMINI_API_KEY)

        # Select a model that supports content generation
        model_id = "models/gemini-1.5-pro-001"  # Choose an available model from the list
        print(f"🔍 Using Model ID: {model_id}")

        # Initialize the model properly
        gemini_model = GenerativeModel(model_id)
        print(f"✅ Model Initialized: {gemini_model}")

        # Base prompt for all tokens
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
        - Ensure it uses pragma solidity ^0.8.20;
        """

        # Adjust the prompt based on the selected network
        if token_data['network'] == "Ethereum":
            base_prompt += """
           - **Standard Compliance**: Implements **OpenZeppelin v5.2.0** ERC20 standards.
           - **Security & Best Practices**: Ensure the contract is gas-efficient, follows OpenZeppelin security guidelines, and prevents overflow/underflow issues.

           ## **Core Features**:
           1️⃣ **Use the latest OpenZeppelin standards:**
           - **ERC20.sol**: Ensure the contract correctly **inherits OpenZeppelin's ERC20**.
           - **Ownable.sol**: Use `Ownable` for access control and set the deployer as the contract owner (`msg.sender`).
           - **IERC20.sol & IERC20Metadata.sol**: Implement all necessary ERC20 functions and metadata.

           2️⃣ **Ensure full compatibility with Solidity 0.8.20**:
           - **Use `_update()` instead of `_beforeTokenTransfer()`** for OpenZeppelin v5.2.0 compatibility.
           - **Use `mapping(address => uint256)`, NOT `mapping(address account => uint256)`** to maintain backward compatibility.
           - **Correctly inherit `Ownable` and pass `msg.sender` as the initial owner**.
           - If the contract inherits Ownable, ensure the constructor calls Ownable(msg.sender).
           - **Modify the constructor to accept dynamic parameters instead of hardcoding**:
            ```solidity
            constructor(string memory _name, string memory _symbol, uint256 _initialSupply) 
             ERC20(_name, _symbol) Ownable(msg.sender) {
              _mint(msg.sender, _initialSupply * 10**decimals());
            }


          3️⃣ **Conditional Features (Toggleable)**:
         - **Burn Mechanism**: If burn rate > 0, implement a burn function using `_burn()`, ensuring compliance with ERC20.
         - **Staking Functionality**: If staking is enabled, implement `stake()` and `unstake()`, ensuring funds are safely locked.
         - **Minting Functionality**: If minting is enabled, allow the owner to mint new tokens securely with `_mint()`, preventing abuse.

         4️⃣ **Deployment & Verification Requirements**:
         - **Ensure SPDX-License-Identifier: MIT**
         - **Ensure proper OpenZeppelin imports**:
         ```solidity
         import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
         import "@openzeppelin/contracts/access/Ownable.sol";
         ```
         - **Use clean, structured, and well-documented Solidity code**.
         - **Ensure seamless verification on Linea Testnet & Etherscan-compatible explorers**.

         🛑 **Important**:
         - DO NOT use `_beforeTokenTransfer()`, use `_update()` instead.
         - Ensure **error-free, optimized Solidity code**.
         - **Only return the Solidity code, NO explanations or extra text**.

         Now generate the Solidity contract based on these requirements.
         """

        # Prepare the generation configuration
        generation_config = GenerationConfig(max_output_tokens=1024)
        print(f"🚦 Sending Request to GenAI with Prompt Length: {len(base_prompt)}")

        # Generate the response using the proper method
        response = gemini_model.generate_content(
            [base_prompt], generation_config=generation_config, safety_settings={}
        )

        print("🧠 GenAI Response Received")
        print(f"Raw Response: {response}")

        # Correctly access the candidates directly from the response object
        if response and response.candidates:
            contract_code = response.candidates[0].content.parts[0].text
            print("✅ Contract Code Extracted")

            # **Enforce Solidity Version**
            def enforce_solidity_version(code, required_version="^0.8.20"):
                """Ensures the generated Solidity contract has a consistent compiler version."""
                return re.sub(r'pragma solidity \^?\d+\.\d+\.\d+;', f'pragma solidity {required_version};', code)

            contract_code = enforce_solidity_version(contract_code)

            # Strip Markdown code fencing if present
            if "```solidity" in contract_code:
                contract_code = contract_code.replace("```solidity", "").replace("```", "").strip()

            print("🚦 Cleaned Up Solidity Code:")
            print(contract_code)  # Print for debugging

            return contract_code
        else:
            print("❌ Error: No candidates found in GenAI model response.")
            return "Error: No candidates found in GenAI model response."

    except Exception as e:
        print("❌ Generation Error:", str(e))
        traceback.print_exc()
        return f"Error generating smart contract: {str(e)}"
