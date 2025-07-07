
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

def generate_smart_contract(token):
    """
    Ask GPT-4-Turbo for an ERC-20 contract and hard-enforce
    the patterns that solc-0.8.20 + OZ-v5.2.0 expect.
    Returns Solidity source ready for `flatten_contract()`.
    """
    try:

        openai.api_key = Config.OPENAI_API_KEY
        model = "gpt-4-turbo"          # works well & cheap

        # ---------- 1.  PROMPT ---------------------------------------------
        base = f"""
Write an ERC-20 token that satisfies **all** of these rules:

* SPDX-License-Identifier: MIT
* pragma solidity ^0.8.20;
* `import "@openzeppelin/contracts/token/ERC20/ERC20.sol";`
* `import "@openzeppelin/contracts/access/Ownable.sol";`
* Constructor **must** be  
  `constructor(string memory _name,string memory _symbol,uint256 _initialSupply)
   ERC20(_name,_symbol) Ownable(msg.sender) {{ ... }}`  ← no extras!
* Use the latest OpenZeppelin (v5.2.0) patterns:
  – override `_update()` for fees/burn, never `_beforeTokenTransfer()`.
  – don’t touch `_transfer()`.
* Constant-style config (burn-rate, staking flag, mintable flag) is OK.
* All math fits in 256 bits – rely on Solidity 0.8 checked-arithmetic.
* Absolutely **no** markdown fencing or commentary – return pure Solidity.

Token spec requested by the user ↓
----------------------------------
Name:   {token['token_name']}
Symbol: {token['token_symbol']}
Supply: {token['total_supply']}
Decimals: {token['decimals']}
Burn-rate (bps): {token['burn_rate']}
Staking enabled: {token['staking']}
Mintable: {token['mintable']}
"""
        print(f"🔍 Using model {model}")
        rsp = openai.ChatCompletion.create(
            model=model,
            messages=[{"role":"user","content":base}],
            max_tokens=900,
            temperature=0.4,
        )["choices"][0]["message"]["content"]

        print("✅ Raw contract received")

        # ---------- 2.  SANITY-PATCH ----------------------------------------
        code = rsp.strip()

        # a) remove any ``` wrappers the model might sneak in
        code = re.sub(r"```(solidity)?", "", code).strip()

        # b) enforce pragma version
        code = re.sub(r"pragma solidity\s+[^;]+;", "pragma solidity ^0.8.20;", code)

        # c) be sure imports are just ERC20 & Ownable
        want_imports = (
            'import "@openzeppelin/contracts/token/ERC20/ERC20.sol";\n'
            'import "@openzeppelin/contracts/access/Ownable.sol";'
        )
        code = re.sub(
            r'import "@openzeppelin/contracts[^"]+";\s*', "", code
        )                               # drop all imports
        code = re.sub(
            r'(pragma solidity [^;]+;)',  # re-insert right after pragma
            r'\1\n\n' + want_imports,
            code, 1
        )

        # d) constructor header patch
        constructor_re = re.compile(
            r"constructor\s*\([^)]*\)\s*([^{}]*\{)", re.MULTILINE
        )
        def _fix_ctor(m):
            return ('constructor(string memory _name,string memory _symbol,'
                    'uint256 _initialSupply)\n        ERC20(_name,_symbol)\n'
                    '        Ownable(msg.sender) {')
        code, _ = constructor_re.subn(_fix_ctor, code, 1)

        # e) hook patch: beforeTokenTransfer → update
        if "_beforeTokenTransfer" in code:
            code = re.sub(
                r"function\s+_beforeTokenTransfer\(",
                "function _update(", code
            )
            code = code.replace("super._beforeTokenTransfer(", "super._update(")
            print("🔧 Patched hook to _update()")

        print("🚦 Final Solidity ready for compile\n")
        return code


    except Exception as e:
        print("❌ Generation error:", e)
        traceback.print_exc()
        return ""