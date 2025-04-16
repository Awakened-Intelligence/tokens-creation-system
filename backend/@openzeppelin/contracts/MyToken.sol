// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MAINNET is ERC20, Ownable {
    uint256 private _totalSupply = 100000 * 10**12;
    uint8 private immutable _decimals = 12;
    bool public stakingEnabled;
    bool public mintable;
    uint256 public burnRate = 200; // 2.0% expressed in basis points

    mapping(address => uint256) private _stakes;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply)
        ERC20(_name, _symbol)
        Ownable()
    {
        _mint(msg.sender, _initialSupply * 10**decimals());
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function setStakingEnabled(bool _enabled) external onlyOwner {
        stakingEnabled = _enabled;
    }

    function setMintable(bool _enabled) external onlyOwner {
        mintable = _enabled;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        require(mintable, "Minting not enabled");
        _mint(to, amount);
    }

    function stake(uint256 amount) public {
        require(stakingEnabled, "Staking not enabled");
        _burn(msg.sender, amount);
        _stakes[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        require(_stakes[msg.sender] >= amount, "Not enough staked tokens");
        _stakes[msg.sender] -= amount;
        _mint(msg.sender, amount);
    }

    function _update(address from, address to, uint256 amount) internal virtual override {
        super._update(from, to, amount);
        
        if (from != address(0)) { // Burning on transfer
            uint256 burnAmount = (amount * burnRate) / 10000;
            if (burnAmount > 0) {
                _burn(from, burnAmount);
            }
        }
    }
}