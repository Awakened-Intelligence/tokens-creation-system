// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract ButterToken is ERC20, Ownable {
    uint256 public constant BURN_RATE_BPS = 10;
    bool public constant STAKING_ENABLED = true;
    bool public constant MINTABLE = true;

    constructor(string memory _name,string memory _symbol,uint256 _initialSupply)
        ERC20(_name,_symbol)
        Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply);
    }

    function decimals() public pure override returns (uint8) {
        return 15;
    }

    function _update(address from, address to, uint256 amount) internal override {
        uint256 burnAmount = (amount * BURN_RATE_BPS) / 10000;
        uint256 sendAmount = amount - burnAmount;
        super._update(from, address(0), burnAmount);
        super._update(from, to, sendAmount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(MINTABLE, "Minting not allowed");
        _mint(to, amount);

    }
}