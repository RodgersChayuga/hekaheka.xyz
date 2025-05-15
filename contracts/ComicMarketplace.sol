// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ComicNFT.sol";

/**
 * @title ComicMarketplace
 * @dev Smart contract for trading ComicNFT tokens with royalty support
 */
contract ComicMarketplace is Ownable, ReentrancyGuard, IERC721Receiver {
    // Reference to the ComicNFT contract
    ComicNFT public immutable comicNFT;

    // Fee configuration
    uint256 public listingFee = 0.005 ether;
    uint256 public platformFeePercent = 250; // 2.5% platform fee (250/10000)
    uint256 public constant MAX_FEE_PERCENT = 1000; // Maximum 10% fee

    // Listing struct for NFT marketplace entries
    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    // Storage
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    // Custom errors for gas efficiency
    error InsufficientListingFee(uint256 sent, uint256 required);
    error InsufficientPayment(uint256 sent, uint256 required);
    error NotTokenOwner();
    error NotSeller();
    error NotApproved();
    error ListingNotActive();
    error InvalidPrice();
    error InvalidTokenId();
    error InvalidFeePercent(uint256 percent);
    error InvalidAddress();
    error NoFundsToWithdraw();
    error TransferFailed();

    // Events
    event Listed(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event Purchased(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address indexed buyer,
        uint256 price,
        uint256 royaltyAmount,
        uint256 platformFee
    );
    event Cancelled(uint256 indexed listingId, uint256 indexed tokenId);
    event ListingFeeUpdated(uint256 newFee);
    event PlatformFeeUpdated(uint256 newFeePercent);
    event FundsWithdrawn(address indexed owner, uint256 amount);

    /**
     * @dev Constructor initializes marketplace with ComicNFT contract address
     * @param _comicNFT Address of the ComicNFT contract
     */
    constructor(address _comicNFT) Ownable(msg.sender) {
        if (_comicNFT == address(0)) {
            revert InvalidAddress();
        }
        comicNFT = ComicNFT(_comicNFT);
    }

    /**
     * @dev Implements IERC721Receiver to handle NFT transfers
     */
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * @dev Lists a ComicNFT for sale
     * @param tokenId ID of the NFT to list
     * @param price Price in wei for the NFT
     */
    function listNFT(
        uint256 tokenId,
        uint256 price
    ) external payable nonReentrant {
        // Input validation
        if (msg.value < listingFee) {
            revert InsufficientListingFee(msg.value, listingFee);
        }
        if (price == 0) {
            revert InvalidPrice();
        }
        if (comicNFT.ownerOf(tokenId) != msg.sender) {
            revert NotTokenOwner();
        }
        if (
            !comicNFT.isApprovedForAll(msg.sender, address(this)) &&
            comicNFT.getApproved(tokenId) != address(this)
        ) {
            revert NotApproved();
        }

        // Create listing
        listings[listingCounter] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            active: true
        });

        // Transfer NFT to marketplace for escrow
        comicNFT.safeTransferFrom(msg.sender, address(this), tokenId);

        // Emit event and increment counter
        emit Listed(listingCounter, tokenId, msg.sender, price);
        listingCounter++;
    }

    /**
     * @dev Allows a user to purchase a listed NFT
     * @param listingId ID of the listing to purchase
     */
    function buyNFT(uint256 listingId) external payable nonReentrant {
        // Get and validate listing
        Listing storage listing = listings[listingId];
        if (!listing.active) {
            revert ListingNotActive();
        }
        if (msg.value < listing.price) {
            revert InsufficientPayment(msg.value, listing.price);
        }

        // Mark as sold
        listing.active = false;
        uint256 tokenId = listing.tokenId;
        address seller = listing.seller;

        // Calculate fees and royalty
        uint256 platformFee = (listing.price * platformFeePercent) / 10000;
        uint256 royalty = (listing.price * comicNFT.royalties(tokenId)) / 10000;
        uint256 sellerAmount = listing.price - platformFee - royalty;

        // Transfer NFT to buyer
        comicNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        // Transfer funds - using low-level calls for better error handling
        bool sellerTransferSuccess = false;
        bool royaltyTransferSuccess = true; // Default true for when royalty is 0

        // Send seller payment
        (sellerTransferSuccess, ) = payable(seller).call{value: sellerAmount}(
            ""
        );
        if (!sellerTransferSuccess) {
            revert TransferFailed();
        }

        // Send royalty payment if applicable
        if (royalty > 0) {
            (royaltyTransferSuccess, ) = payable(comicNFT.creators(tokenId))
                .call{value: royalty}("");
            if (!royaltyTransferSuccess) {
                revert TransferFailed();
            }
        }

        // Return excess ETH to buyer if they sent too much
        if (msg.value > listing.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{
                value: msg.value - listing.price
            }("");
            if (!refundSuccess) {
                revert TransferFailed();
            }
        }

        emit Purchased(
            listingId,
            tokenId,
            msg.sender,
            listing.price,
            royalty,
            platformFee
        );
    }

    /**
     * @dev Allows a seller to cancel their listing
     * @param listingId ID of the listing to cancel
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        // Get and validate listing
        Listing storage listing = listings[listingId];
        if (!listing.active) {
            revert ListingNotActive();
        }
        if (listing.seller != msg.sender) {
            revert NotSeller();
        }

        // Mark as inactive
        listing.active = false;

        // Return NFT to seller
        comicNFT.safeTransferFrom(address(this), msg.sender, listing.tokenId);

        emit Cancelled(listingId, listing.tokenId);
    }

    /**
     * @dev Allows owner to withdraw accumulated fees
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert NoFundsToWithdraw();
        }

        // Transfer funds to owner
        (bool success, ) = payable(owner()).call{value: balance}("");
        if (!success) {
            revert TransferFailed();
        }

        emit FundsWithdrawn(owner(), balance);
    }

    /**
     * @dev Updates the listing fee
     * @param _listingFee New listing fee in wei
     */
    function setListingFee(uint256 _listingFee) external onlyOwner {
        listingFee = _listingFee;
        emit ListingFeeUpdated(_listingFee);
    }

    /**
     * @dev Updates the platform fee percentage
     * @param _platformFeePercent New platform fee percentage (basis points: 100 = 1%)
     */
    function setPlatformFeePercent(
        uint256 _platformFeePercent
    ) external onlyOwner {
        if (_platformFeePercent > MAX_FEE_PERCENT) {
            revert InvalidFeePercent(_platformFeePercent);
        }
        platformFeePercent = _platformFeePercent;
        emit PlatformFeeUpdated(_platformFeePercent);
    }

    /**
     * @dev Returns active listing details for a given listing ID
     * @param listingId ID of the listing to query
     * @return seller Address of the seller
     * @return tokenId ID of the NFT
     * @return price Price of the NFT
     * @return active Whether the listing is active
     */
    function getListingDetails(
        uint256 listingId
    )
        external
        view
        returns (address seller, uint256 tokenId, uint256 price, bool active)
    {
        Listing memory listing = listings[listingId];
        return (listing.seller, listing.tokenId, listing.price, listing.active);
    }

    /**
     * @dev Checks if a token is currently listed for sale
     * @param tokenId ID of the token to check
     * @return listingId ID of the listing if found, or 0 if not listed
     * @return isListed Boolean indicating if the token is listed
     */
    function checkIfTokenIsListed(
        uint256 tokenId
    ) external view returns (uint256 listingId, bool isListed) {
        // Loop through listings to find the token
        // This is O(n) but necessary since we're using listingIds rather than tokenIds as keys
        for (uint256 i = 0; i < listingCounter; i++) {
            if (listings[i].tokenId == tokenId && listings[i].active) {
                return (i, true);
            }
        }
        return (0, false);
    }
}
