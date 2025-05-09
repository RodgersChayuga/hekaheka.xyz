# ComicChain Project Documentation

## 1. Overview
ComicChain is a decentralized application (dApp) built on the Base blockchain, designed to transform real-life memories, stories, and milestones into AI-generated comic books minted as NFTs. By combining blockchain technology, AI-driven design, and a user-friendly interface, ComicChain empowers creators to craft, own, and monetize their unique comic creations. The platform targets creators, collectors, and communities, offering a seamless experience to narrate stories, mint NFTs, and trade them in a vibrant marketplace.

This project is developed for the [Base Batch Africa hackathon](https://base-batch-africa.devfolio.co/overview), leveraging Base's scalable infrastructure to deliver a low-cost, high-performance solution for African creators and beyond.

---

## 2. Objectives
- **Empower Creators**: Enable users to create personalized comic books using AI, without requiring advanced design skills.
- **Ensure Ownership**: Mint comics as NFTs on Base to guarantee permanence and creator control.
- **Foster Monetization**: Provide a marketplace for creators to sell comics and earn royalties.
- **Promote Accessibility**: Support crypto and fiat payments, ensuring inclusivity for web2 and web3 users.
- **Showcase Base's Potential**: Demonstrate the scalability and developer-friendly features of the Base blockchain.

---

## 3. Key Features
1. **AI-Driven Comic Creation**:
   - Users input stories, milestones, or upload photos to generate comic pages.
   - AI customizes characters, layouts, and narratives based on user inputs.
2. **NFT Minting**:
   - Comics are minted as ERC-721 NFTs on Base, ensuring ownership and authenticity.
   - Metadata stored on IPFS for decentralized access.
3. **Decentralized Marketplace**:
   - Creators can list comics for sale, set prices, and define royalty percentages.
   - Buyers can purchase comics using ETH or fiat (via card payments).
4. **Flexible Purchase Options**:
   - Buy full comic books or individual pages as NFTs.
   - Downloadable digital formats (PDF, EPUB) for offline use.
5. **Responsive Design**:
   - Accessible on desktops, tablets, and mobile devices.
6. **Tiered Pricing Plans**:
   - Basic Plan: Limited AI generations and minting capabilities.
   - Advanced Plan: Unlimited generations, priority minting, and premium customization tools.

---

## 4. User Journey

### 4.1 Landing Page (Home)
- **Purpose**: Introduce ComicChain and guide users to core functionalities.
- **Content**:
  - Hero section: "Turn Your Memories into Epic Comics with ComicChain."
  - Call-to-action buttons: "How It Works," "Start Minting," "Explore Marketplace."
  - Showcase sample comics and creator testimonials.
- **Improvement**: Add a video explainer to visually demonstrate the comic creation process.

### 4.2 How It Works
- **Purpose**: Educate users on the comic creation and minting process.
- **Steps**:
  1. **Story Input**: Users describe their story or milestone (e.g., a wedding, startup journey, or community event).
  2. **Media Upload**: Upload photos or sketches to inspire character designs.
  3. **AI Generation**: AI generates a draft comic with customizable layouts and dialogues.
  4. **Edit & Refine**: Users tweak text, colors, and panels using an intuitive editor.
  5. **Mint & Publish**: Finalize and mint the comic as an NFT, optionally listing it on the marketplace.
- **Improvement**: Include tooltips and a guided tutorial for first-time users.

### 4.3 Minting Process
- **Purpose**: Enable users to create and mint comics as NFTs.
- **Flow**:
  1. Complete story and media inputs.
  2. Preview the AI-generated comic and make edits.
  3. Select pricing plan (Basic or Advanced).
  4. Pay minting fee (0.01 ETH or equivalent fiat via Stripe).
  5. Confirm minting and view the NFT on the Base blockchain.
- **Improvement**: Add a "Mint Later" option to save drafts for future completion.

### 4.4 Marketplace
- **Purpose**: Facilitate buying, selling, and trading of comic NFTs.
- **Features**:
  - Search and filter by genre, creator, or price.
  - Preview comic pages before purchase.
  - Support for fixed-price sales and auctions.
  - Royalty distribution for secondary sales (up to 10%).
- **Improvement**: Implement a "Featured Comics" section to highlight trending or high-quality creations.

### 4.5 Download & Share
- **Purpose**: Allow users to download purchased comics and share them.
- **Process**:
  1. Access "My Comics" section in the user dashboard.
  2. Select comic and choose format (PDF, EPUB).
  3. Download or share a blockchain-verified link to the comic.
- **Improvement**: Add social sharing buttons for platforms like X to boost visibility.

---

## 5. Technical Architecture

### 5.1 Frontend
- **Framework**: Next.js (React) for server-side rendering and fast performance.
- **Styling**: Tailwind CSS + shadcn for consistent, reusable UI components.
- **State Management**: Zustand for lightweight, scalable state management.
- **Routing**: Next.js App Router for dynamic and static routes.
- **Accessibility**: Responsive design with ARIA-compliant components.

### 5.2 Backend
- **Blockchain**: Base (Layer 2 on Ethereum) for low-cost transactions and scalability.
- **Smart Contracts**:
  - **ComicNFT**: Manages NFT minting, metadata, and royalties.
  - **Marketplace**: Handles listing, buying, and royalty distributions.
- **AI Integration**: Base AgentKit for story generation and character design, supplemented by a custom-trained model for comic layouts.
- **APIs**: RESTful APIs for offchain data (e.g., user profiles, comic previews).

### 5.3 Storage
- **Onchain**: NFT metadata (title, creator, URI) stored on Base.
- **Offchain**: Comic images and downloadable files stored on IPFS via Pinata for decentralized, reliable access.

### 5.4 Payment Gateway
- **Crypto**: MetaMask integration for ETH payments on Base.
- **Fiat**: Stripe API for card payments, converting to ETH for onchain transactions.

---

## 6. Smart Contract Design

### 6.1 ComicNFT Contract
```solidity
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

    constructor() ERC721("ComicChain", "COMIC") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintComic(string memory tokenURI, uint256 royalty) external payable {
        require(msg.value >= 0.01 ether, "Minting fee is 0.01 ETH");
        require(royalty <= 1000, "Royalty cannot exceed 10%");
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _tokenURIs[tokenId] = tokenURI;
        creators[tokenId] = msg.sender;
        royalties[tokenId] = royalty;
        tokenCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "Token does not exist");
        return _tokenURIs[tokenId];
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

### 6.2 Marketplace Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ComicNFT.sol";

contract ComicMarketplace is Ownable {
    ComicNFT public comicNFT;
    uint256 public listingFee = 0.005 ether;

    struct Listing {
        uint256 tokenId;
        address seller;
        uint256 price;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event ComicListed(uint256 tokenId, address seller, uint256 price);
    event ComicSold(uint256 tokenId, address buyer, uint256 price);

    constructor(address _comicNFT) Ownable(msg.sender) {
        comicNFT = ComicNFT(_comicNFT);
    }

    function listComic(uint256 tokenId, uint256 price) external payable {
        require(msg.value >= listingFee, "Insufficient listing fee");
        require(comicNFT.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(price > 0, "Price must be greater than 0");

        comicNFT.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(tokenId, msg.sender, price, true);
        emit ComicListed(tokenId, msg.sender, price);
    }

    function buyComic(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Comic not listed");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 royaltyAmount = (listing.price * comicNFT.royalties(tokenId)) / 10000;
        uint256 sellerAmount = listing.price - royaltyAmount;

        listings[tokenId].active = false;
        comicNFT.transferFrom(address(this), msg.sender, tokenId);
        payable(comicNFT.creators(tokenId)).transfer(royaltyAmount);
        payable(listing.seller).transfer(sellerAmount);

        emit ComicSold(tokenId, msg.sender, listing.price);
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
```

---

## 7. Tools and Libraries
- **Frontend**:
  - Next.js 14 (App Router)
  - TypeScript
  - Tailwind CSS + shadcn
  - Zustand
  - ethers.js
- **Backend**:
  - Hardhat for contract development
  - OpenZeppelin Contracts
  - Base AgentKit
  - Pinata (IPFS)
- **Payments**:
  - MetaMask
  - Stripe
- **Testing**:
  - Mocha/Chai for contract testing
  - Jest for frontend testing

---

## 8. Security Considerations
- **Smart Contract Audits**: Use Slither and MythX for static analysis.
- **Access Control**: Restrict minting and marketplace functions to authorized users.
- **Rate Limiting**: Prevent API abuse for AI generation and minting.
- **Sanctions Compliance**: Screen wallet addresses using Chainalysis or similar tools.
- **Data Privacy**: Store minimal user data offchain, encrypted with AES-256.

---

## 9. Future Enhancements
1. **Social Features**: Add creator profiles, follower systems, and community boards.
2. **Multichain Support**: Extend to other EVM-compatible chains like Optimism.
3. **AR/VR Integration**: Enable immersive comic viewing experiences.
4. **DAO Governance**: Allow creators to vote on platform upgrades and revenue sharing.

---

## 10. Hackathon Alignment
ComicChain aligns with the Base Batch Africa hackathon by:
- Leveraging Base's low-cost transactions to make NFT minting accessible to African creators.
- Using Base AgentKit for AI-driven comic creation, showcasing innovative developer tools.
- Promoting financial inclusion through fiat payment options.
- Building a scalable dApp that empowers local communities to preserve and monetize their stories.

---

This documentation provides a clear roadmap for ComicChain, ensuring alignment with the hackathon's goals and delivering a robust, user-centric platform.