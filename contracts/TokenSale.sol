// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TokenSale {
    uint256 public ratio;
    uint256 public price;
    IERC20 public paymentToken;
    IERC721 public nftCollection;

    constructor(
        uint256 _ratio,
        uint256 _price
    ) {
        ratio = _ratio;
        price = _price;
    }

    function setPaymentToken(address _paymentToken) external {
        paymentToken = IERC20(_paymentToken);
    }

    function setNftCollection(address _nftCollection) external {
        nftCollection = IERC721(_nftCollection);
    }

    function buy(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");

        // Transfer ERC20 tokens from buyer to this contract
        paymentToken.transferFrom(
            msg.sender,
            address(this),
            amount * price
        );

        // Transfer ERC721 tokens from this contract to buyer
        nftCollection.transferFrom(
            address(this),
            msg.sender,
            amount * ratio
        );
    }
}
