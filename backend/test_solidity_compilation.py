import os
from solcx import compile_files, install_solc

# Install Solidity 0.8.9 (Skip if already installed)
install_solc("0.8.9")

# Get full path of MyToken.sol
solidity_file_path = os.path.abspath("./@openzeppelin/contracts/MyToken.sol")

# Compile Solidity File
compiled_sol = compile_files([solidity_file_path], output_values=["bin", "abi"], solc_version="0.8.9")

# Print compiled contract details
for contract_name, contract_data in compiled_sol.items():
    print(f"Contract Name: {contract_name}")
    print(f"Bytecode: {contract_data['bin'][:50]}...")  # Print first 50 characters
    print(f"ABI: {contract_data['abi']}")

