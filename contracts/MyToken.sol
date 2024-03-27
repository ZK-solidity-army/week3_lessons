// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";


contract MyToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() ERC20("MyToken", "MTK") {
        _mint(msg.sender, 10 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

      function returnTokens(address sender, uint256 amount, uint256 ratio) external {
        require(amount > 0, "Amount must be greater than 0");
        require(ratio > 0, "Ratio must be greater than 0");

        // Burn tokens from the sender's balance
        _burn(sender, amount);

        // Calculate the amount of ETH to transfer back to the sender
        uint256 ethAmount = amount / ratio;
        require(ethAmount > 0, "ETH amount must be greater than 0");

        // Transfer ETH back to the sender
        payable(sender).transfer(ethAmount);
    }
}
