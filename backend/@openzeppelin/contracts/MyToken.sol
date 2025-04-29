// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract qweToken is ERC20, Ownable {
    uint256 private constant DECIMALS = 12;
    uint256 private constant BURN_RATE = 120; // 1.2% burn rate represented as 120 basis points

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable()
    {
        _mint(msg.sender, _initialSupply * 10**DECIMALS);
    }

    function decimals() public pure override returns (uint8) {
        return uint8(DECIMALS);
    }

    function _update(address from, address to, uint256 amount) internal virtual override {
        if (from != address(0)) { // When tokens are transferred (not minted)
            uint256 burnAmount = (amount * BURN_RATE) / 10000;
            if (burnAmount > 0) {
                _burn(from, burnAmount);
            }
            super._update(from, to, amount - burnAmount);
        } else {
            super._update(from, to, amount);
        }
    }
}