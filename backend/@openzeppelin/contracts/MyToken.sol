// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract jammyco is ERC20, Ownable {
    uint256 private _burnRate;
    bool private _stakingEnabled;
    bool private _mintingEnabled;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, _initialSupply * 10 ** decimals());
        _burnRate = 10; // 1.0%
        _stakingEnabled = true;
        _mintingEnabled = true;
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);

        if (_burnRate > 0 && from != address(0) && to != address(0)) {
            uint256 burnAmount = amount * _burnRate / 1000;
            _burn(from, burnAmount);
        }
    }

    function stake(uint256 amount) public {
        require(_stakingEnabled, "Staking is not enabled");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _burn(msg.sender, amount);
    }

    function unstake(uint256 amount) public {
        require(_stakingEnabled, "Staking is not enabled");

        _mint(msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(_mintingEnabled, "Minting is not enabled");
        _mint(to, amount);
    }
}