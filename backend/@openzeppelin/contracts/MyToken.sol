// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tokengen is ERC20, Ownable {
    uint256 private _burnRate;
    bool private _stakingEnabled;
    bool private _mintingEnabled;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) ERC20(_name, _symbol) Ownable(msg.sender) {
        _mint(msg.sender, _initialSupply * 10 ** decimals());
        _burnRate = 200; // 2.0%
        _stakingEnabled = true;
        _mintingEnabled = true;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (_burnRate > 0 && to == address(0)) {
            uint256 burnAmount = (amount * _burnRate) / 10000;
            super._burn(from, burnAmount);
        }
    }

    function stake(uint256 amount) external {
        require(_stakingEnabled, "Staking is disabled");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _burn(msg.sender, amount);
    }

    function unstake(uint256 amount) external {
        require(_stakingEnabled, "Staking is disabled");
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");

        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(_mintingEnabled, "Minting is disabled");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}