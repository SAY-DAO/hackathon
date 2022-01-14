// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface InterfaceMain {
  function safeMint(
    address to,
    uint256 tokenId,
    string memory uri
  ) external;
}

contract SAY is ERC721, ERC721URIStorage, Ownable {
  address payable public marketPlace;

  constructor(
    address payable marketAddress,
    string memory name,
    string memory symbol
  ) ERC721(name, symbol) {
    marketPlace = marketAddress;
  }

  function safeMint(
    address to,
    uint256 tokenId,
    string memory uri
  ) public onlyOwner {
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, uri);
    setApprovalForAll(marketPlace, true); // sender approves Market Place to transfer tokens
  }

  // The following functions are overrides required by Solidity.
  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }
}
