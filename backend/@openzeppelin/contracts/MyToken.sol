// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract tokerngen is ERC20, Ownable {
    uint256 private _burnRate = 200; // 2.0% burn rate
    uint256 private _stakingAmount;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, _initialSupply * 10 ** decimals());
    }

    function burn(uint256 amount) public {
        require(amount > 0, "Burn amount must be greater than zero");
        uint256 burnAmount = (amount * _burnRate) / 10000;
        _burn(msg.sender, burnAmount);
        _transfer(msg.sender, address(0), amount - burnAmount);
    }

    function stake(uint256 amount) public {
        require(amount > 0, "Stake amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _transfer(msg.sender, address(this), amount);
        _stakingAmount += amount;
    }

    function unstake(uint256 amount) public {
        require(amount > 0, "Unstake amount must be greater than zero");
        require(_stakingAmount >= amount, "Insufficient staked amount");
        _transfer(address(this), msg.sender, amount);
        _stakingAmount -= amount;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);
        require(balanceOf(address(this)) >= _stakingAmount, "Staking contract balance too low");
    }
}