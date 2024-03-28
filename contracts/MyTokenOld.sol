// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MyTokenOld is ERC20, ERC20Burnable {
    constructor() ERC20("MyToken", "MTK") {}

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
