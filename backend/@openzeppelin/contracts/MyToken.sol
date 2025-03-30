// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract talhaai is ERC20, Ownable {
    uint256 private _burnRate;
    bool private _stakingEnabled;
    bool private _mintingEnabled;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, _initialSupply * 10**decimals());
        _burnRate = 500; // 5.0%
        _stakingEnabled = true;
        _mintingEnabled = true;
    }

    function burnRate() public view returns (uint256) {
        return _burnRate;
    }

    function stakingEnabled() public view returns (bool) {
        return _stakingEnabled;
    }

    function mintingEnabled() public view returns (bool) {
        return _mintingEnabled;
    }

    function setBurnRate(uint256 newBurnRate) public onlyOwner {
        _burnRate = newBurnRate;
    }

    function setStakingEnabled(bool enabled) public onlyOwner {
        _stakingEnabled = enabled;
    }

    function setMintingEnabled(bool enabled) public onlyOwner {
        _mintingEnabled = enabled;
    }

    function burn(uint256 amount) public {
        require(_burnRate > 0, "Burning is disabled");
        uint256 burnAmount = (amount * _burnRate) / 10000;
        _burn(msg.sender, burnAmount);
    }

    function stake(uint256 amount) public {
        require(_stakingEnabled, "Staking is disabled");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance for staking");
        _transfer(msg.sender, address(this), amount);
    }

    function unstake(uint256 amount) public {
        require(_stakingEnabled, "Staking is disabled");
        require(balanceOf(address(this)) >= amount, "Insufficient staked balance");
        _transfer(address(this), msg.sender, amount);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(_mintingEnabled, "Minting is disabled");
        _mint(to, amount);
    }
}