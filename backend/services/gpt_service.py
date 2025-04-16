
# import google.generativeai as genai
# from config import Config
# from google.generativeai import GenerativeModel, GenerationConfig
# import traceback
# import re  # Import regex for enforcing Solidity version

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
#         - Ensure it uses pragma solidity ^0.8.20;
#         """

#         # Adjust the prompt based on the selected network
#         if token_data['network'] == "Ethereum":
#             base_prompt += """
#            - **Standard Compliance**: Implements **OpenZeppelin v5.2.0** ERC20 standards.
#            - **Security & Best Practices**: Ensure the contract is gas-efficient, follows OpenZeppelin security guidelines, and prevents overflow/underflow issues.

#            ## **Core Features**:
#            1️⃣ **Use the latest OpenZeppelin standards:**
#            - **ERC20.sol**: Ensure the contract correctly **inherits OpenZeppelin's ERC20**.
#            - **Ownable.sol**: Use `Ownable` for access control and set the deployer as the contract owner (`msg.sender`).
#            - **IERC20.sol & IERC20Metadata.sol**: Implement all necessary ERC20 functions and metadata.

#            2️⃣ **Ensure full compatibility with Solidity 0.8.20**:
#            - **Use `_update()` instead of `_beforeTokenTransfer()`** for OpenZeppelin v5.2.0 compatibility.
#            - **Use `mapping(address => uint256)`, NOT `mapping(address account => uint256)`** to maintain backward compatibility.
#            - **Correctly inherit `Ownable` and pass `msg.sender` as the initial owner**.
#            - If the contract inherits Ownable, ensure the constructor calls Ownable(msg.sender).
#            🔁 Replace:

#             - Modify the constructor to accept dynamic parameters instead of hardcoding:

#             With:

#             - DO NOT hardcode constructor values.
#             - The constructor MUST accept 3 parameters: `string memory _name`, `string memory _symbol`, and `uint256 _initialSupply`.
#             - Use `_mint(msg.sender, _initialSupply * 10 ** decimals());`
#             - Example constructor that u should always follow and add no other params other then these three below:
#             ```solidity
#             constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
#                 ERC20(_name, _symbol)
#                 Ownable(msg.sender)
#             {
#                 _mint(msg.sender, _initialSupply * 10**decimals());
#             }


#           3️⃣ **Conditional Features (Toggleable)**:
#          - **Burn Mechanism**: If burn rate > 0, implement a burn function using `_burn()`, ensuring compliance with ERC20.
#          - **Staking Functionality**: If staking is enabled, implement `stake()` and `unstake()`, ensuring funds are safely locked.
#          - **Minting Functionality**: If minting is enabled, allow the owner to mint new tokens securely with `_mint()`, preventing abuse.

#          4️⃣ **Deployment & Verification Requirements**:
#          - **Ensure SPDX-License-Identifier: MIT**
#          - **Ensure proper OpenZeppelin imports**:
#          ```solidity
#          import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
#          import "@openzeppelin/contracts/access/Ownable.sol";
#          ```
#          - **Use clean, structured, and well-documented Solidity code**.
#          - **Ensure seamless verification on Linea Testnet & Etherscan-compatible explorers**.

#          🛑 **Important**:
#          - DO NOT use `_beforeTokenTransfer()`, use `_update()` instead.
#          - Ensure **error-free, optimized Solidity code**.
#          - **Only return the Solidity code, NO explanations or extra text**.

#          Now generate the Solidity contract based on these requirements.
#          """

#         # Prepare the generation configuration
#         generation_config = GenerationConfig(max_output_tokens=1024)
#         print(f"🚦 Sending Request to GenAI with Prompt Length: {len(base_prompt)}")

#         # Generate the response using the proper method
#         response = gemini_model.generate_content(
#             [base_prompt], generation_config=generation_config, safety_settings={}
#         )

#         print("🧠 GenAI Response Received")
#         print(f"Raw Response: {response}")

#         # Correctly access the candidates directly from the response object
#         if response and response.candidates:
#             contract_code = response.candidates[0].content.parts[0].text
#             print("✅ Contract Code Extracted")

#             # **Enforce Solidity Version**
#             def enforce_solidity_version(code, required_version="^0.8.20"):
#                 """Ensures the generated Solidity contract has a consistent compiler version."""
#                 return re.sub(r'pragma solidity \^?\d+\.\d+\.\d+;', f'pragma solidity {required_version};', code)

#             contract_code = enforce_solidity_version(contract_code)

#             # Strip Markdown code fencing if present
#             if "```solidity" in contract_code:
#                 contract_code = contract_code.replace("```solidity", "").replace("```", "").strip()

#             print("🚦 Cleaned Up Solidity Code:")
#             print(contract_code)  # Print for debugging

#             return contract_code
#         else:
#             print("❌ Error: No candidates found in GenAI model response.")
#             return "Error: No candidates found in GenAI model response."

#     except Exception as e:
#         print("❌ Generation Error:", str(e))
#         traceback.print_exc()
#         return f"Error generating smart contract: {str(e)}"
import openai
from config import Config
import traceback
import re  # Import regex for enforcing Solidity version

def generate_smart_contract(token_data):
    try:
        # Configure the OpenAI API with the API key for GPT-1 Mini
        openai.api_key = Config.OPENAI_API_KEY

        # Select GPT-1 Mini Model ID (substitute with actual model name if required)
        model_id = "gpt-4-turbo"  # Replace with actual GPT-1 Mini model name
        print(f"🔍 Using Model ID: {model_id}")

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
           🔁 Replace:

            - Modify the constructor to accept dynamic parameters instead of hardcoding:

            With:

            - DO NOT hardcode constructor values.
            - The constructor MUST accept 3 parameters: `string memory _name`, `string memory _symbol`, and `uint256 _initialSupply`.
            - Use `_mint(msg.sender, _initialSupply * 10 ** decimals());`
            - Example constructor that u should always follow and add no other params other than these three below AND AVOID ADDING , IN Ownable(msg.sender) :
            ```solidity
            constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
                ERC20(_name, _symbol)
                Ownable(msg.sender)
            {
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

        # Generate the response using OpenAI's GPT-1 Mini model
        print(f"🚦 Sending Request to OpenAI with Prompt Length: {len(base_prompt)}")

        response = openai.ChatCompletion.create(
            model=model_id,
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},  # Optional system message
                {"role": "user", "content": base_prompt}  # User-provided prompt
            ],
            max_tokens=1024,
            temperature=0.7
        )

        print("🧠 GPT-1 Mini Response Received")
        print(f"Raw Response: {response}")

        # Extract the contract code from the response
        if response and 'choices' in response:
            contract_code = response['choices'][0]['message']['content'].strip()
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
            print("❌ Error: No valid response from GPT-1 Mini model.")
            return "Error: No valid response from GPT-1 Mini model."

    except Exception as e:
        print("❌ Generation Error:", str(e))
        traceback.print_exc()
        return f"Error generating smart contract: {str(e)}"
