//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "hardhat/console.sol";

contract Treasury is ReentrancyGuard {

  event Received(address, uint256);
  event FallingBack(string);

  address payable public deployerAddress;

  constructor() {
    deployerAddress = payable(msg.sender);
  }

  // to receive eth
  receive() external payable {
    emit Received(msg.sender, msg.value);
  }

}
