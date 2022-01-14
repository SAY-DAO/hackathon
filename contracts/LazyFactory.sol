//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./MainFactory.sol";
import "hardhat/console.sol";

contract LazyFactory is
  ERC721URIStorage,
  EIP712,
  AccessControl,
  ReentrancyGuard
{
  address payable public governanceContract;
  address payable public signerAddress;
  string private constant SIGNING_DOMAIN_NAME = "SAY";
  string private constant SIGNING_DOMAIN_VERSION = "1";
  bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
  bytes32 private constant VOUCHER_TYPEHASH =
    keccak256(
      "Voucher(uint256 needId,uint256 priceWei,string priceDollar,string tokenUri,string content)"
    );

  struct Voucher {
    uint256 needId;
    uint256 priceWei;
    string priceDollar;
    string tokenUri;
    string content;
    bytes signature;
  }

  event RedeemedAndMinted(uint256 indexed tokenId);

  mapping(address => uint256) private balanceByAddress;

  constructor(
    address payable governanceAddress,
    string memory name,
    string memory symbol,
    address payable signer
  ) ERC721(name, symbol) EIP712(SIGNING_DOMAIN_NAME, SIGNING_DOMAIN_VERSION) {
    governanceContract = governanceAddress;
    signerAddress = signer;
    _setupRole(SIGNER_ROLE, signerAddress);
  }

  function redeem(address user2, Voucher calldata voucher)
    public
    payable
    nonReentrant
  {
    address user1 = _verify(voucher);

    require(msg.value == voucher.priceWei, "Enter the correct price");
    require(user1 != user2, "Can not mint your own signature");
    require(hasRole(SIGNER_ROLE, signerAddress), "Invalid Signature");

    _safeMint(user1, voucher.needId);
    _setTokenURI(voucher.needId, voucher.tokenUri);
    setApprovalForAll(governanceContract, true); // sender approves Market Place to transfer tokens

    // transfer the token to the buyer
    _transfer(user1, user2, voucher.needId);

    // every token royalty starts here by its signature's signer
    InterfaceMain mainFactory = InterfaceMain(governanceContract);
    mainFactory.safeMint(msg.sender, voucher.tokenUri);

    uint256 amount = msg.value;
    payable(governanceContract).transfer(amount);

    emit RedeemedAndMinted(voucher.needId);
  }

  function _hash(Voucher calldata voucher) internal view returns (bytes32) {
    return
      // _hashTypedDataV4(bytes32 structHash) → bytes32
      _hashTypedDataV4(
        keccak256(
          abi.encode(
            VOUCHER_TYPEHASH,
            voucher.needId,
            voucher.priceWei,
            keccak256(bytes(voucher.priceDollar)),
            keccak256(bytes(voucher.tokenUri)),
            keccak256(bytes(voucher.content))
          )
        )
      );
  }

  // returns signer address
  function _verify(Voucher calldata voucher) internal view returns (address) {
    bytes32 digest = _hash(voucher);

    return ECDSA.recover(digest, voucher.signature);
  }

  function getChainID() external view returns (uint256) {
    uint256 id;
    // https://docs.soliditylang.org/en/v0.8.7/yul.html?highlight=chainid#evm-dialect
    assembly {
      id := chainid()
    }
    return id;
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
