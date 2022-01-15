// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface InterfaceMain {
  function safeMint(
    address to,
    uint256 tokenId,
    string memory uri
  ) external;
}

contract MainFactory is ERC721, ERC721URIStorage, AccessControl {
  address payable public marketPlace;
  event Minted(string indexed tokenUri);

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
    string memory tokenUri
  ) external {
    _safeMint(to, tokenId);
    _setTokenURI(tokenId, tokenUri);
    setApprovalForAll(marketPlace, true); // sender approves Market Place to transfer tokens
    emit Minted(tokenUri);
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

  function supportsInterface(bytes4 interfaceId)
    public
    view
    virtual
    override(AccessControl, ERC721)
    returns (bool)
  {
    return
      ERC721.supportsInterface(interfaceId) ||
      AccessControl.supportsInterface(interfaceId);
  }
}
