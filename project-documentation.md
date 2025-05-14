# ComicChain Project Documentation

## 1. Overview
ComicChain is a decentralized application (dApp) built on the Base blockchain, designed to transform user-submitted memories, stories, and images into AI-generated comic books minted as ERC-721 NFTs. By integrating Base AgentKit for onchain AI story generation, ComicChain enables creators to craft personalized comics, mint them as NFTs, and trade them in a decentralized marketplace. The platform is tailored for creators, collectors, and communities, with a focus on accessibility for African users through low-cost transactions and fiat payment options.

This project is developed for the [Base Batch Africa hackathon](https://base-batch-africa.devfolio.co/overview), showcasing Base's scalability and AgentKit's AI capabilities to empower creators globally.

---

## 2. Objectives
- **Enable Story Creation**: Allow users to generate comic books from text-based memories and uploaded images using Base AgentKit.
- **Guarantee Ownership**: Mint comics as NFTs on Base for verifiable ownership and authenticity.
- **Facilitate Monetization**: Provide a marketplace for creators to list and sell comics with royalty support.
- **Ensure Accessibility**: Support crypto and fiat payments to onboard both web2 and web3 users.
- **Highlight Base's Capabilities**: Demonstrate Base's low-cost transactions and AgentKit's onchain AI for scalable, innovative dApps.

---

## 3. Key Features
1. **AI-Driven Comic Creation with Base AgentKit**:
   - Users input a text description of their memories (e.g., "I’m Rodgers, a software engineer, I love to cook and play badminton").
   - Users upload images associated with names mentioned in the story, which AgentKit uses to generate relatable characters.
   - AgentKit combines text and images to create a multi-page comic with text, images, and layouts, processed onchain.
2. **NFT Minting**:
   - Comics are minted as ERC-721 NFTs on Base, with metadata stored on IPFS for decentralization.
   - Minting fee: 0.01 ETH or equivalent fiat via Stripe.
3. **Decentralized Marketplace**:
   - Creators can list full comics or individual pages for sale with fixed prices or auctions.
   - Buyers can purchase using ETH (via MetaMask) or fiat (via Stripe).
   - Royalties up to 10% on secondary sales.
4. **Flexible Purchase Options**:
   - Buy entire comic books or individual pages as NFTs.
   - Download comics in PDF format after purchase.
5. **Comic Editing**:
   - Post-generation, users can edit text, layouts, or images before minting.
6. **Blockchain Transparency**:
   - View minted comics on the Base blockchain explorer.
7. **Responsive Design**:
   - Accessible on desktops, tablets, and mobile devices with a clean, intuitive UI.

---

## 4. User Journey

### 4.1 Landing Page (Home)
- **Purpose**: Welcome users and guide them to start creating comics.
- **Design** (from `Comichain-pages-1.pdf` and `Comichain-pages-2.pdf`):
  - Navigation: Links to "Home," "How It Works," "Mint," and "Marketplace."
  - Hero Section: "Turn Your Memories into Epic Comics with ComicChain."
  - Call-to-Action: Prominent "Start" button to initiate the comic creation process.
  - Visuals: Showcase sample comics and a clean, repetitive "MINT" and "MARKETPLACE" layout to emphasize core actions.
- **Functionality**:
  - Clicking "Start" redirects to the Story Input page.
- **Improvement**: Add a 30-second explainer video showcasing the creation-to-minting process.

### 4.2 How It Works
- **Purpose**: Explain the comic creation and minting process.
- **Design** (inferred from `Comichain-pages-1.pdf`):
  - Simple text layout with "HOW IT WORKS" heading.
  - Step-by-step guide with visuals for each step.
- **Steps**:
  1. **Story Input**: Enter a text description of memories or stories.
  2. **Image Upload**: Upload images linked to names in the story.
  3. **AI Generation**: Base AgentKit generates a multi-page comic.
  4. **Edit & Refine**: Customize the comic’s text, images, or layout.
  5. **Mint & Publish**: Mint as an NFT and optionally list on the marketplace.
- **Functionality**:
  - Accessible from the navigation bar.
  - Includes a "Try Now" button linking to the Story Input page.
- **Improvement**: Add interactive tooltips and a guided onboarding modal for new users.

### 4.3 Story Input Page
- **Purpose**: Collect user memories or stories for comic generation.
- **Design**:
  - Clean layout with a large text area for story input.
  - Placeholder: "E.g., I’m Rodgers, a software engineer, I love to cook and play badminton."
  - "Next" button to proceed.
- **Functionality**:
  - Text area supports up to 1000 characters for story description.
  - Basic validation to ensure at least one name is mentioned (for image association).
  - Clicking "Next" saves the input and redirects to the Image Upload page.
- **Improvement**: Add real-time character count and auto-save functionality.

### 4.4 Image Upload Page
- **Purpose**: Allow users to upload images and associate them with names from the story.
- **Design** (from `Comichain-pages-3.pdf`):
  - Text: "CRAFT FOUR CHARACTERS" (adjustable based on detected names).
  - List of names extracted from the story input.
  - Upload fields next to each name for image association.
  - "Next" button to proceed.
- **Functionality**:
  - Automatically extracts names from the story input using NLP (via AgentKit).
  - Supports up to 4 image uploads (PNG/JPEG, max 5MB each).
  - Users assign each image to a name for AI character generation.
  - Validates that at least one image is uploaded before enabling "Next."
  - Clicking "Next" triggers AgentKit to process inputs and redirects to the Comic Preview page.
- **Improvement**: Add drag-and-drop support and image preview thumbnails.

### 4.5 Comic Preview Page
- **Purpose**: Display the AI-generated comic and allow edits.
- **Design**:
  - Multi-page comic layout with images and text panels.
  - Sidebar with editing tools (text, colors, layouts).
  - Buttons: "Edit," "Proceed," and "Back."
- **Functionality**:
  - Base AgentKit generates a comic (3–10 pages) combining story text and uploaded images.
  - Users can:
    - Edit text in speech bubbles or captions.
    - Adjust panel layouts or colors.
    - Replace AI-generated images with new uploads.
  - "Proceed" saves changes and redirects to the Purchase page.
  - "Back" returns to the Image Upload page.
- **Improvement**: Add undo/redo functionality and a zoom feature for detailed editing.

### 4.6 Purchase Page
- **Purpose**: Allow users to buy and mint their comic as an NFT.
- **Design** (from `Comichain-pages-5.pdf` and `Comichain-pages-6.pdf`):
  - Text: "GET THE FULL COMIC BOOK OR BUY PER PAGE."
  - Pricing options:
    - Full comic: 15 ETH (or fiat equivalent).
    - Per page: 2 ETH (or fiat equivalent).
  - Payment methods: Crypto (MetaMask) or fiat (Stripe).
  - "Checkout" button to finalize purchase.
  - "VIEW ON BLOCKCHAIN" link post-minting.
- **Functionality**:
  - Users select purchase option (full comic or specific pages).
  - Crypto payments:
    - Connect MetaMask, pay in ETH on Base.
    - Minting fee: 0.01 ETH (included in price).
  - Fiat payments:
    - Stripe checkout converts fiat to ETH for onchain minting.
  - Post-purchase:
    - Comic is minted as an NFT (full comic or individual pages).
    - Metadata stored on IPFS via Pinata.
    - Option to download comic as PDF.
    - Option to list on the marketplace.
  - "VIEW ON BLOCKCHAIN" links to the Base explorer for the NFT.
- **Improvement**: Add a pricing breakdown (minting fee vs. comic cost) and a "Save for Later" option.

### 4.7 Marketplace
- **Purpose**: Enable buying, selling, and trading of comic NFTs.
- **Design** (from `Comichain-pages-1.pdf` and `Comichain-pages-2.pdf`):
  - Navigation link: "MARKETPLACE."
  - Grid layout displaying comic NFTs with previews, prices, and creator info.
  - Filters: Genre, price, creator.
  - Buttons: "Buy Now," "Place Bid" (for auctions).
- **Functionality**:
  - Creators list comics/pages with:
    - Fixed price (e.g., 15 ETH for full comic).
    - Auction option with minimum bid.
    - Royalty percentage (up to 10%).
  - Buyers can:
    - Purchase using ETH or fiat.
    - Preview comic pages before buying.
  - Secondary sales distribute royalties to creators.
- **Improvement**: Add a "Trending Comics" carousel and user ratings for comics.

---

## 5. Technical Architecture

### 5.1 Frontend
- **Framework**: Next.js 14 (App Router) for server-side rendering and SEO.
- **Styling**: Tailwind CSS + shadcn for responsive, reusable UI components.
- **State Management**: Zustand for managing story inputs, images, and comic state.
- **File Uploads**: react-dropzone for drag-and-drop image uploads.
- **Blockchain Interaction**: ethers.js for MetaMask integration and contract calls.
- **Accessibility**: ARIA-compliant components and keyboard navigation.

### 5.2 Backend
- **Blockchain**: Base (Layer 2 on Ethereum) for low-cost, scalable transactions.
- **Smart Contracts**:
  - **ComicNFT**: Manages NFT minting, metadata, and royalties.
  - **Marketplace**: Handles listing, buying, and royalty distribution.
- **AI Integration**: Base AgentKit for onchain story generation:
  - Processes text inputs using NLP to extract names and narrative elements.
  - Maps uploaded images to characters for visual generation.
  - Generates multi-page comics with text and images.
- **APIs**:
  - RESTful API (Node.js) for offchain data (user profiles, comic previews).
  - Pinata API for IPFS storage of comic images and metadata.
- **Payment Gateway**:
  - **Crypto**: MetaMask for ETH payments on Base.
  - **Fiat**: Stripe for card payments, converting to ETH for minting.

### 5.3 Storage
- **Onchain**: NFT metadata (title, creator, IPFS URI) stored on Base.
- **Offchain**: Comic images and PDF files stored on IPFS via Pinata.
- **Temporary Storage**: Story inputs and images stored in-memory during creation, then moved to IPFS post-minting.

### 5.4 Base AgentKit Integration
- **Story Parsing**:
  - Uses AgentKit’s NLP capabilities to parse story text, identify names, and extract narrative themes.
  - Example: "I’m Rodgers, a software engineer" → Extracts "Rodgers" as a character and "software engineer" as a trait.
- **Image Processing**:
  - Maps uploaded images to named characters for accurate visual representation.
  - Generates comic-style images based on user uploads and story context.
- **Comic Generation**:
  - Combines text and images to create 3–10 page comics with dynamic layouts.
  - Stores generated comic data on IPFS, with metadata linked to NFTs.
- **Onchain Execution**:
  - AgentKit processes inputs on Base, ensuring transparency and immutability.
  - Gas optimization via Base’s Layer 2 scalability.

---

## 6. Smart Contract Design
The existing smart contracts (`ComicNFT` and `Marketplace`) are sufficient but updated to reflect pricing from the Figma designs.

### 6.1 ComicNFT Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ComicNFT is ERC721, Ownable {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    mapping(uint256 => address) public creators;
    mapping(uint256 => uint256) public royalties;

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
pragma solidity ^0.8.28;

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
  - react-dropzone (for image uploads)
- **Backend**:
  - Hardhat for contract development and deployment
  - OpenZeppelin Contracts
  - Base AgentKit for onchain AI story generation
  - Pinata (IPFS) for decentralized storage
  - Node.js for offchain APIs
- **Payments**:
  - MetaMask (ETH on Base)
  - Stripe (fiat payments)
- **Testing**:
  - Mocha/Chai for smart contract testing
  - Jest for frontend testing
  - Cypress for end-to-end testing

---

## 8. Security Considerations
- **Smart Contracts**:
  - Audit with Slither and MythX to detect reentrancy or overflow vulnerabilities.
  - Use OpenZeppelin’s battle-tested ERC-721 implementation.
- **Frontend**:
  - Sanitize user inputs (story text, image uploads) to prevent XSS or injection attacks.
  - Implement CSRF protection for API endpoints.
- **AI Inputs**:
  - Validate image uploads (size, format) to prevent malicious files.
  - Rate-limit AgentKit requests to avoid abuse.
- **Payments**:
  - Screen wallet addresses with Chainalysis for sanctions compliance.
  - Secure Stripe integration with PCI-compliant practices.
- **Data Privacy**:
  - Store minimal user data (wallet address, comic metadata) offchain.
  - Encrypt sensitive data (e.g., story drafts) with AES-256.

---

## 9. Future Enhancements
1. **Collaborative Creation**: Allow multiple users to co-create comics.
2. **Social Integration**: Share comics on X with blockchain-verified links.
3. **Advanced AI Customization**: Offer style templates (e.g., manga, superhero) via AgentKit.
4. **Multichain Support**: Expand to Optimism or Arbitrum for broader reach.
5. **Creator Analytics**: Provide dashboards for sales and engagement metrics.

---

## 10. Hackathon Alignment
ComicChain aligns with the Base Batch Africa hackathon by:
- Utilizing Base’s Layer 2 scalability for affordable NFT minting, accessible to African creators.
- Leveraging Base AgentKit for onchain AI story generation, showcasing innovative developer tools.
- Supporting fiat payments via Stripe to onboard non-crypto users, promoting financial inclusion.
- Empowering creators to preserve and monetize cultural stories and memories as NFTs.
- Building a user-friendly dApp that demonstrates Base’s potential for scalable, creative applications.

---

## 11. Implementation Plan
### 11.1 Development Milestones
1. **Week 1: Setup and Frontend**:
   - Initialize Next.js project with Tailwind CSS and shadcn.
   - Build Landing, Story Input, Image Upload, and Comic Preview pages.
   - Integrate Zustand for state management and react-dropzone for uploads.
2. **Week 2: Backend and AI**:
   - Deploy ComicNFT and Marketplace contracts on Base testnet using Hardhat.
   - Integrate Base AgentKit for story parsing, image processing, and comic generation.
   - Set up Pinata for IPFS storage of comics and metadata.
3. **Week 3: Payments and Minting**:
   - Integrate MetaMask for ETH payments and ethers.js for contract interactions.
   - Implement Stripe for fiat payments, converting to ETH for minting.
   - Build Purchase page with full comic and per-page options.
4. **Week 4: Marketplace and Testing**:
   - Develop Marketplace page with listing, buying, and filtering features.
   - Write unit tests for contracts (Mocha/Chai) and frontend (Jest).
   - Conduct end-to-end testing with Cypress.
5. **Week 5: Polish and Deployment**:
   - Add tooltips, modals, and onboarding guides.
   - Optimize gas usage in contracts and frontend performance.
   - Deploy to Base mainnet and submit to hackathon.

### 11.2 File Structure
```
comichain/
├── contracts/
│   ├── ComicNFT.sol
│   └── ComicMarketplace.sol
├── pages/
│   ├── index.tsx           # Landing Page
│   ├── how-it-works.tsx
│   ├── story-input.tsx
│   ├── image-upload.tsx
│   ├── comic-preview.tsx
│   ├── purchase.tsx
│   └── marketplace.tsx
├── components/
│   ├── Navbar.tsx
│   ├── ComicEditor.tsx
│   ├── ImageUploader.tsx
│   └── PaymentButton.tsx
├── lib/
│   ├── agentkit.ts        # AgentKit integration
│   ├── ipfs.ts            # Pinata IPFS utils
│   ├── contracts.ts       # ethers.js contract interactions
│   └── stripe.ts          # Stripe payment utils
├── styles/
│   └── globals.css
├── tests/
│   ├── contracts/
│   └── frontend/
├── hardhat.config.ts
├── package.json
└── README.md
```

---

## 12. Figma Design Integration
The Figma designs (from `Comichain-pages-1.pdf` to `Comichain-pages-6.pdf`) are reflected in the UI:
- **Navigation**: Consistent "HOME," "HOW IT WORKS," "MINT," "MARKETPLACE" links across pages.
- **Landing Page**: Minimalist with repetitive "MINT" and "MARKETPLACE" text, emphasizing core actions.
- **Image Upload**: "CRAFT FOUR CHARACTERS" guides users to associate images with names.
- **Purchase Page**: Clear pricing (15 ETH full comic, 2 ETH per page) and blockchain transparency.
- **Comic Preview**: Multi-page layout inferred from `Comichain-pages-4.pdf` (long numbered list suggests paginated content).
- **Marketplace**: Grid layout with repeated "MARKETPLACE" text for emphasis.

**Note**: `Comichain-pages-4.pdf` (numbers 1–899) is interpreted as a placeholder for paginated comic content or a long-scroll preview. The actual comic will be 3–10 pages, as specified.