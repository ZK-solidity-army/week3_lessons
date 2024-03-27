// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {MyToken} from "./MyToken.sol";
import {MyNFT} from "./MyNFT.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    MyToken public paymentToken;
    MyNFT public nftCollection;

    constructor(
        uint256 _ratio,
        uint256 _price,
        MyToken _paymentToken,
        MyNFT _nftCollection
    ) {
        ratio = _ratio;
        price = _price;
        paymentToken = _paymentToken;
        nftCollection = _nftCollection;
    }

    // Buy ERC20 tokens with ETH at a fixed ratio
    function buyTokens() external payable {
        paymentToken.mint(msg.sender, msg.value * ratio);
    }

    function returnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount / ratio);
    }
}