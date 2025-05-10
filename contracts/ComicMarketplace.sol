// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ComicNFT.sol";

contract ComicMarketplace is Ownable {
    ComicNFT public comicNFT;
    uint256 public listingFee = 0.005 ether; // Fee for listing an NFT
    uint256 public platformFeePercent = 250; // 2.5% platform fee (250/10000)

    struct Listing {
        address seller;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    // Custom errors
    error InsufficientListingFee(uint256 sent, uint256 required);
    error InsufficientPayment(uint256 sent, uint256 required);
    error NotTokenOwner();
    error NotApproved();
    error ListingNotActive();
    error InvalidPrice();
    error InvalidTokenId();

    event Listed(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    event Purchased(
        uint256 indexed listingId,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );
    event Cancelled(uint256 indexed listingId, uint256 indexed tokenId);

    constructor(address _comicNFT) Ownable(msg.sender) {
        comicNFT = ComicNFT(_comicNFT);
    }

    function listNFT(uint256 tokenId, uint256 price) external payable {
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

        listings[listingCounter] = Listing({
            seller: msg.sender,
            tokenId: tokenId,
            price: price,
            active: true
        });

        emit Listed(listingCounter, tokenId, msg.sender, price);
        listingCounter++;
    }

    function buyNFT(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        if (!listing.active) {
            revert ListingNotActive();
        }
        if (msg.value < listing.price) {
            revert InsufficientPayment(msg.value, listing.price);
        }

        listing.active = false;
        uint256 tokenId = listing.tokenId;
        address seller = listing.seller;

        // Calculate fees and royalty
        uint256 platformFee = (listing.price * platformFeePercent) / 10000;
        uint256 royalty = (listing.price * comicNFT.royalties(tokenId)) / 10000;
        uint256 sellerAmount = listing.price - platformFee - royalty;

        // Transfer funds
        payable(seller).transfer(sellerAmount);
        if (royalty > 0) {
            payable(comicNFT.creators(tokenId)).transfer(royalty);
        }

        // Transfer NFT
        comicNFT.safeTransferFrom(seller, msg.sender, tokenId);

        emit Purchased(listingId, tokenId, msg.sender, listing.price);
    }

    function cancelListing(uint256 listingId) external {
        Listing storage listing = listings[listingId];
        if (!listing.active) {
            revert ListingNotActive();
        }
        if (listing.seller != msg.sender) {
            revert NotTokenOwner();
        }

        listing.active = false;
        emit Cancelled(listingId, listing.tokenId);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        if (balance == 0) {
            revert("No funds to withdraw");
        }
        payable(owner()).transfer(balance);
    }

    function setListingFee(uint256 _listingFee) external onlyOwner {
        listingFee = _listingFee;
    }

    function setPlatformFeePercent(
        uint256 _platformFeePercent
    ) external onlyOwner {
        if (_platformFeePercent > 1000) {
            // Max 10%
            revert InvalidPrice();
        }
        platformFeePercent = _platformFeePercent;
    }
}
