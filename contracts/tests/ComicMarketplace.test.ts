import { expect } from 'chai';
import { ethers } from 'hardhat';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { ComicMarketplace } from '@/typechain-types/contracts/ComicMarketplace';
import { ComicNFT } from '@/typechain-types/contracts/ComicNFT';

describe('ComicMarketplace', function () {
    let comicNFT: ComicNFT;
    let marketplace: ComicMarketplace;
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;

    const MINT_FEE = ethers.parseEther('0.01');
    const LISTING_FEE = ethers.parseEther('0.005');
    const TOKEN_URI = 'ipfs://QmTestURI';
    const ROYALTY = 500; // 5%
    const PRICE = ethers.parseEther('1');

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy ComicNFT
        const ComicNFTFactory = await ethers.getContractFactory('ComicNFT');
        comicNFT = (await ComicNFTFactory.deploy()) as ComicNFT;
        await comicNFT.waitForDeployment();

        // Deploy ComicMarketplace
        const ComicMarketplaceFactory = await ethers.getContractFactory('ComicMarketplace');
        marketplace = (await ComicMarketplaceFactory.deploy(comicNFT.getAddress())) as ComicMarketplace;
        await marketplace.waitForDeployment();

        // Mint an NFT to user1
        await comicNFT.connect(user1).mintComic(TOKEN_URI, ROYALTY, { value: MINT_FEE });
    });

    it('should deploy with correct ComicNFT address', async function () {
        expect(await marketplace.comicNFT()).to.equal(await comicNFT.getAddress());
    });

    it('should list an NFT', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await expect(
            marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE })
        ).to.emit(marketplace, 'Listed').withArgs(0, 0, user1.address, PRICE);

        const listing = await marketplace.listings(0);
        expect(listing.seller).to.equal(user1.address);
        expect(listing.tokenId).to.equal(0);
        expect(listing.price).to.equal(PRICE);
        expect(listing.active).to.be.true;
    });

    it('should fail to list with insufficient fee', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await expect(
            marketplace.connect(user1).listNFT(0, PRICE, { value: ethers.parseEther('0.001') })
        ).to.be.revertedWithCustomError(marketplace, 'InsufficientListingFee');
    });

    it('should fail to list if not token owner', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await expect(
            marketplace.connect(user2).listNFT(0, PRICE, { value: LISTING_FEE })
        ).to.be.revertedWithCustomError(marketplace, 'NotTokenOwner');
    });

    it('should fail to list if not approved', async function () {
        await expect(
            marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE })
        ).to.be.revertedWithCustomError(marketplace, 'NotApproved');
    });

    it('should buy an NFT', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });

        const sellerBalanceBefore = await ethers.provider.getBalance(user1.address);

        await expect(
            marketplace.connect(user2).buyNFT(0, { value: PRICE })
        ).to.emit(marketplace, 'Purchased').withArgs(0, 0, user2.address, PRICE);

        expect(await comicNFT.ownerOf(0)).to.equal(user2.address);
        const listing = await marketplace.listings(0);
        expect(listing.active).to.be.false;

        // Verify payments (platform fee: 2.5%, royalty: 5%)
        const sellerBalanceAfter = await ethers.provider.getBalance(user1.address);

        // Calculate the combined amount user1 should receive (seller payment + royalty)
        const platformFee = (PRICE * 250n) / 10000n;  // 2.5%
        const royalty = (PRICE * 500n) / 10000n;      // 5%
        const sellerAmount = PRICE - platformFee;     // User1 gets seller proceeds + royalty

        // Since user1 is both seller and creator, they receive: price - platform fee
        expect(sellerBalanceAfter - sellerBalanceBefore).to.be.closeTo(sellerAmount, ethers.parseEther('0.01')); // Allow for gas
    });

    it('should fail to buy with insufficient payment', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });
        await expect(
            marketplace.connect(user2).buyNFT(0, { value: ethers.parseEther('0.5') })
        ).to.be.revertedWithCustomError(marketplace, 'InsufficientPayment');
    });

    it('should cancel a listing', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });
        await expect(
            marketplace.connect(user1).cancelListing(0)
        ).to.emit(marketplace, 'Cancelled').withArgs(0, 0);

        const listing = await marketplace.listings(0);
        expect(listing.active).to.be.false;
    });

    it('should fail to cancel if not seller', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });
        await expect(
            marketplace.connect(user2).cancelListing(0)
        ).to.be.revertedWithCustomError(marketplace, 'NotTokenOwner');
    });

    it('should allow owner to withdraw funds', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });
        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        const tx = await marketplace.connect(owner).withdraw();
        const receipt = await tx.wait();
        const gasUsed = receipt?.gasUsed ?? 0n;
        const gasPrice = tx.gasPrice ?? 0n;
        const gasCost = gasUsed * gasPrice;
        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
        expect(ownerBalanceAfter - ownerBalanceBefore + gasCost).to.equal(LISTING_FEE);
    });

    it('should fail to withdraw if not owner', async function () {
        await comicNFT.connect(user1).approve(marketplace.getAddress(), 0);
        await marketplace.connect(user1).listNFT(0, PRICE, { value: LISTING_FEE });
        await expect(
            marketplace.connect(user1).withdraw()
        ).to.be.revertedWithCustomError(marketplace, 'OwnableUnauthorizedAccount');
    });
});