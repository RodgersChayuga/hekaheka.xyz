// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ComicNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royalties; // Royalty percentage (e.g., 1000 = 10%)

    // Custom errors for gas efficiency and clarity
    error InsufficientMintingFee(uint256 sent, uint256 required);
    error InvalidRoyalty(uint256 royalty);
    error TokenDoesNotExist(uint256 tokenId);

    constructor() ERC721("ComicChain", "COMIC") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintComic(
        string memory metadataURI,
        uint256 royalty
    ) external payable {
        if (msg.value < 0.01 ether) {
            revert InsufficientMintingFee(msg.value, 0.01 ether);
        }
        if (royalty > 1000) {
            revert InvalidRoyalty(royalty); // Max 10% royalty
        }

        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = metadataURI;
        creators[tokenId] = msg.sender;
        royalties[tokenId] = royalty;
        tokenCounter++;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist(tokenId);
        }
        return _tokenURIs[tokenId];
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert("No funds to withdraw");
        }
        payable(owner()).transfer(balance);
    }

    // Helper function to check if token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
