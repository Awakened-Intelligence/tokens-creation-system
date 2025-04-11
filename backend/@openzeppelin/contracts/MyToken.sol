// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract james is ERC20, Ownable {
    uint256 private _burnRate;
    bool private _stakingEnabled;
    bool private _mintingEnabled;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable(msg.sender)
    {
        _mint(msg.sender, _initialSupply * 10 ** decimals());
        _burnRate = 200; // 2.0%
        _stakingEnabled = true;
        _mintingEnabled = true;
    }

    function decimals() public pure override returns (uint8) {
        return 12;
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
        require(newBurnRate <= 10000, "Burn rate cannot exceed 100%");
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
        // Add staking logic here
    }

    function unstake(uint256 amount) public {
        require(_stakingEnabled, "Staking is disabled");
        // Add unstaking logic here
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(_mintingEnabled, "Minting is disabled");
        _mint(to, amount);
    }

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._update(from, to, amount);
        if (_burnRate > 0 && from != address(0) && to != address(0)) {
            uint256 burnAmount = (amount * _burnRate) / 10000;
            _burn(from, burnAmount);
        }
    }
}