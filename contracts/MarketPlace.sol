//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract MarketPlace is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _marketItemId;

  struct MarketItem {
    uint256 marketItemId;
    address factoryAddress;
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
    bool sold;
  }

  mapping(uint256 => MarketItem) private marketItemById;

  event MarketItemCreated(
    uint256 indexed marketItemId,
    address factoryAddress,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 indexed price,
    bool sold
  );

  event MarketItemPurchased(
    uint256 indexed marketItemId,
    address indexed factoryAddress,
    uint256 indexed tokenId,
    address owner,
    uint256 price
  );

  event Received(address, uint256);
  event FallingBack(string);

  address payable public deployerAddress;

  constructor() {
    deployerAddress = payable(msg.sender);
  }

  // When listig an item for the first time seller sign it. Buyer mints and transferes it.
  // After token is minted it should be added to market place to be traded furthur.
  function addToMarket(
    address factoryAddress,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price can't be 0 wei");

    _marketItemId.increment();
    uint256 marketItemId = _marketItemId.current();

    marketItemById[marketItemId].marketItemId = marketItemId;
    marketItemById[marketItemId].factoryAddress = factoryAddress;
    marketItemById[marketItemId].tokenId = tokenId;
    marketItemById[marketItemId].price = price;
    marketItemById[marketItemId].seller = payable(msg.sender);
    marketItemById[marketItemId].owner = payable(address(0));
    marketItemById[marketItemId].sold = false;

    // give the ownership of the token to Market Place
    IERC721(factoryAddress).transferFrom(msg.sender, address(this), tokenId);
    emit MarketItemCreated(
      marketItemId,
      factoryAddress,
      tokenId,
      msg.sender, // seller
      address(0), // owner
      price,
      false
    );
  }

  // to receive eth
  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

  function fetchMarketBalance() public view returns (uint256) {
    return address(this).balance;
  }
}
