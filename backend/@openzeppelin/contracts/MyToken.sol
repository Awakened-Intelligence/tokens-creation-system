// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract jammaica is ERC20, Ownable {
    uint256 public constant burnRate = 200; // 2.0% burn rate
    uint256 private constant burnRateBase = 10000;
    mapping(address => uint256) public stakedBalances;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) 
     ERC20(_name, _symbol) Ownable(msg.sender) {
      _mint(msg.sender, _initialSupply * 10**decimals());
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (from != address(0) && to != address(0) && amount > 0) {
            uint256 burnAmount = (amount * burnRate) / burnRateBase;
            _burn(from, burnAmount); 
            super._update(from, to, amount - burnAmount);
        } else {
            super._update(from, to, amount);
        }
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Stake amount must be greater than 0");
        require(balanceOf(msg.sender) >= _amount, "Insufficient balance");

        _transfer(msg.sender, address(this), _amount);
        stakedBalances[msg.sender] += _amount;
    }

    function unstake(uint256 _amount) public {
        require(_amount > 0, "Unstake amount must be greater than 0");
        require(stakedBalances[msg.sender] >= _amount, "Insufficient staked balance");

        stakedBalances[msg.sender] -= _amount;
        _transfer(address(this), msg.sender, _amount);
    }

    function mint(address _to, uint256 _amount) public onlyOwner {
        _mint(_to, _amount);
    }
}