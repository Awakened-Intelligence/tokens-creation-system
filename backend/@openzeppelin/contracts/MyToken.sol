// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MainnetToken is ERC20, Ownable {
    uint256 private _totalSupply = 100000 * 10**12; // Including decimals
    uint256 public burnRate = 20; // 2.0% represented as parts per thousand
    bool public stakingEnabled = true;
    bool public mintingEnabled = true;

    mapping(address => uint256) private _stakes;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable()
    {
        _mint(msg.sender, _initialSupply * 10**decimals());
    }

    function mint(address account, uint256 amount) public onlyOwner {
        require(mintingEnabled, "Minting is disabled");
        _mint(account, amount);
    }

    function burn(uint256 amount) public {
        require(burnRate > 0, "Burn mechanism is disabled");
        _burn(msg.sender, amount);
    }

    function stake(uint256 amount) public {
        require(stakingEnabled, "Staking is disabled");
        _burn(msg.sender, amount);
        _stakes[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        require(stakingEnabled, "Staking is disabled");
        require(_stakes[msg.sender] >= amount, "Insufficient staked amount");
        _stakes[msg.sender] -= amount;
        _mint(msg.sender, amount);
    }

    function _update(address from, address to, uint256 amount) internal override {
        super._update(from, to, amount);

        if (from != address(0)) { // When not minting tokens
            uint256 burnAmount = (amount * burnRate) / 1000;
            if (burnAmount > 0) {
                _burn(from, burnAmount);
            }
        }
    }

    function getStake(address account) public view returns (uint256) {
        return _stakes[account];
    }
}