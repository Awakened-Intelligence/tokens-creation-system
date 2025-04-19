// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MainnetToken is ERC20, Ownable {
    uint256 private _totalSupply = 100000 * 10**12;
    uint256 public burnRate = 2; // 2%
    bool public stakingEnabled = true;
    bool public mintable = true;
    mapping(address => uint256) private _stakes;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) ERC20(_name, _symbol) Ownable() {
        _mint(msg.sender, _initialSupply * 10**decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(mintable, "Minting is disabled");
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        require(amount > 0, "Burn amount must be greater than zero");
        uint256 burnAmount = (amount * burnRate) / 100;
        _burn(msg.sender, burnAmount);
    }

    function stake(uint256 amount) public {
        require(stakingEnabled, "Staking is not enabled");
        _burn(msg.sender, amount);
        _stakes[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        require(amount <= _stakes[msg.sender], "Not enough staked");
        _stakes[msg.sender] -= amount;
        _mint(msg.sender, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        super._update(from, to, amount);
        if (burnRate > 0 && from != address(0)) {
            uint256 burnAmount = (amount * burnRate) / 100;
            _burn(from, burnAmount);
        }
    }

    function totalSupply() public view override returns (uint256) {
        return _totalSupply - balanceOf(address(0));
    }
}