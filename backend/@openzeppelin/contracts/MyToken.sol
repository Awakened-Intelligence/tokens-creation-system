// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Tokenna is ERC20, Ownable {
    uint256 private _burnRate;
    bool public stakingEnabled;
    bool public mintingEnabled;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) 
        ERC20(_name, _symbol) 
        Ownable(msg.sender) 
    {
        _burnRate = 500; // 5.0%
        stakingEnabled = true;
        mintingEnabled = true;
        _mint(msg.sender, _initialSupply * 10 ** decimals());
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (_burnRate > 0 && to == address(0)) {
            uint256 burnAmount = amount * _burnRate / 10000;
            super._burn(from, burnAmount);
        }
        super._update(from, to, amount);
    }

    function burn(uint256 amount) public {
        require(_burnRate > 0, "Burning is not enabled");
        _spendAllowance(msg.sender, address(this), amount);
        _burn(msg.sender, amount);
    }

    function stake(uint256 amount) public {
        require(stakingEnabled, "Staking is not enabled");
        _transfer(msg.sender, address(this), amount);
    }

    function unstake(uint256 amount) public {
        require(stakingEnabled, "Staking is not enabled");
        _transfer(address(this), msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(mintingEnabled, "Minting is not enabled");
        _mint(to, amount);
    }
}