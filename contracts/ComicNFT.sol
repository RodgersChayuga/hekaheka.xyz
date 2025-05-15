// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ComicNFT
 * @dev Smart contract for minting and managing comic NFTs with royalty information
 */
contract ComicNFT is ERC721, Ownable {
    // State variables
    uint256 private _tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royalties; // Royalty percentage (e.g., 1000 = 10%)

    uint256 public constant MINTING_FEE = 0.01 ether;
    uint256 public constant MAX_ROYALTY = 1000; // 10% in basis points

    // Custom errors for gas efficiency and clarity
    error InsufficientMintingFee(uint256 sent, uint256 required);
    error InvalidRoyalty(uint256 royalty);
    error TokenDoesNotExist(uint256 tokenId);
    error NoFundsToWithdraw();
    error EmptyTokenURI();

    // Events
    event ComicMinted(
        uint256 indexed tokenId,
        address indexed creator,
        string tokenURI,
        uint256 royalty
    );
    event FundsWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Constructor initializes the NFT collection with name and symbol
     */
    constructor() ERC721("ComicChain", "COMIC") Ownable(msg.sender) {
        _tokenCounter = 0;
    }

    /**
     * @dev Mints a new comic NFT
     * @param metadataURI IPFS or other URI pointing to the token metadata
     * @param royalty Royalty percentage in basis points (100 = 1%)
     */
    function mintComic(
        string memory metadataURI,
        uint256 royalty
    ) external payable {
        // Validate inputs
        if (msg.value < MINTING_FEE) {
            revert InsufficientMintingFee(msg.value, MINTING_FEE);
        }
        if (royalty > MAX_ROYALTY) {
            revert InvalidRoyalty(royalty);
        }
        if (bytes(metadataURI).length == 0) {
            revert EmptyTokenURI();
        }

        // Mint NFT
        uint256 tokenId = _tokenCounter;
        _safeMint(msg.sender, tokenId);

        // Store metadata
        _tokenURIs[tokenId] = metadataURI;
        creators[tokenId] = msg.sender;
        royalties[tokenId] = royalty;

        // Increment counter
        _tokenCounter++;

        // Emit event
        emit ComicMinted(tokenId, msg.sender, metadataURI, royalty);
    }

    /**
     * @dev Returns the URI for a given token ID
     * @param tokenId The ID of the token
     * @return The token's URI
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        // OpenZeppelin v5.0 includes _requireOwned which checks if token exists
        // and reverts with a clear error message if not
        _requireOwned(tokenId);
        return _tokenURIs[tokenId];
    }

    /**
     * @dev Allows the contract owner to withdraw accumulated funds
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert NoFundsToWithdraw();
        }

        // Transfer funds
        payable(owner()).transfer(balance);

        // Emit event
        emit FundsWithdrawn(owner(), balance);
    }

    /**
     * @dev Returns the current token counter value
     * @return Current token counter
     */
    function getTokenCounter() public view returns (uint256) {
        return _tokenCounter;
    }

    /**
     * @dev Returns the creator's address for a specific token
     * @param tokenId The ID of the token
     * @return Address of the creator
     */
    function getCreator(uint256 tokenId) public view returns (address) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist(tokenId);
        }
        return creators[tokenId];
    }

    /**
     * @dev Returns the royalty percentage for a specific token
     * @param tokenId The ID of the token
     * @return Royalty percentage in basis points
     */
    function getRoyaltyPercentage(
        uint256 tokenId
    ) public view returns (uint256) {
        if (!_exists(tokenId)) {
            revert TokenDoesNotExist(tokenId);
        }
        return royalties[tokenId];
    }

    /**
     * @dev Helper function to check if token exists
     * @param tokenId The ID of the token to check
     * @return bool True if the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
