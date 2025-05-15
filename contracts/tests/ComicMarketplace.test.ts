import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ComicNFT, ComicMarketplace } from '../../typechain-types';

describe('ComicMarketplace', () => {
    let comicNFT: ComicNFT;
    let marketplace: ComicMarketplace;
    let owner: any, seller: any, buyer: any;

    beforeEach(async () => {
        [owner, seller, buyer] = await ethers.getSigners();
        const ComicNFTFactory = await ethers.getContractFactory('ComicNFT');
        comicNFT = (await ComicNFTFactory.deploy()) as ComicNFT;

        const MarketplaceFactory = await ethers.getContractFactory('ComicMarketplace');
        marketplace = (await MarketplaceFactory.deploy(await comicNFT.getAddress())) as ComicMarketplace;

        await comicNFT.connect(seller).mintComic('ipfs://QmTestURI', 500, { value: ethers.parseEther('0.01') });
        // Approve marketplace to transfer NFT
        await comicNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), true);
    });

    it('should initialize correctly', async () => {
        expect(await marketplace.comicNFT()).to.equal(await comicNFT.getAddress());
        expect(await marketplace.listingFee()).to.equal(ethers.parseEther('0.005'));
        expect(await marketplace.platformFeePercent()).to.equal(250);
        expect(await marketplace.listingCounter()).to.equal(0);
        expect(await marketplace.owner()).to.equal(owner.address);
    });

    it('should list an NFT for sale', async () => {
        const tokenId = 0;
        const price = ethers.parseEther('1');
        const listingFee = ethers.parseEther('0.005');

        await expect(marketplace.connect(seller).listNFT(tokenId, price, { value: listingFee }))
            .to.emit(marketplace, 'Listed')
            .withArgs(0, tokenId, seller.address, price);

        const listing = await marketplace.listings(0);
        expect(listing.seller).to.equal(seller.address);
        expect(listing.tokenId).to.equal(tokenId);
        expect(listing.price).to.equal(price);
        expect(listing.active).to.be.true;
        expect(await comicNFT.ownerOf(tokenId)).to.equal(await marketplace.getAddress());
        expect(await marketplace.listingCounter()).to.equal(1);

        const [listingId, isListed] = await marketplace.checkIfTokenIsListed(tokenId);
        expect(listingId).to.equal(0);
        expect(isListed).to.be.true;

        const [sellerAddr, listedTokenId, listedPrice, active] = await marketplace.getListingDetails(0);
        expect(sellerAddr).to.equal(seller.address);
        expect(listedTokenId).to.equal(tokenId);
        expect(listedPrice).to.equal(price);
        expect(active).to.be.true;
    });

    it('should allow buying a listed NFT', async () => {
        const tokenId = 0;
        const price = ethers.parseEther('1');
        const listingFee = ethers.parseEther('0.005');
        const royalty = 500; // 5%
        const platformFeePercent = 250; // 2.5%

        await marketplace.connect(seller).listNFT(tokenId, price, { value: listingFee });

        const royaltyAmount = (price * BigInt(royalty)) / BigInt(10000);
        const platformFee = (price * BigInt(platformFeePercent)) / BigInt(10000);
        const sellerAmount = price - royaltyAmount - platformFee;

        const sellerBalanceBefore = await ethers.provider.getBalance(seller.address);
        await expect(marketplace.connect(buyer).buyNFT(0, { value: price }))
            .to.emit(marketplace, 'Purchased')
            .withArgs(0, tokenId, buyer.address, price, royaltyAmount, platformFee);

        expect(await comicNFT.ownerOf(tokenId)).to.equal(buyer.address);
        expect((await marketplace.listings(0)).active).to.be.false;
        // Check total balance: platformFee (0.025 ETH) + listingFee (0.005 ETH) = 0.03 ETH
        expect(await ethers.provider.getBalance(await marketplace.getAddress())).to.equal(platformFee + listingFee);

        const sellerBalanceAfter = await ethers.provider.getBalance(seller.address);
        expect(sellerBalanceAfter).to.be.gt(sellerBalanceBefore);

        const [listingId, isListed] = await marketplace.checkIfTokenIsListed(tokenId);
        expect(listingId).to.equal(0);
        expect(isListed).to.be.false;
    });

    it('should allow cancelling a listing', async () => {
        const tokenId = 0;
        const price = ethers.parseEther('1');
        await marketplace.connect(seller).listNFT(tokenId, price, { value: ethers.parseEther('0.005') });

        await expect(marketplace.connect(seller).cancelListing(0))
            .to.emit(marketplace, 'Cancelled')
            .withArgs(0, tokenId);

        expect(await comicNFT.ownerOf(tokenId)).to.equal(seller.address);
        expect((await marketplace.listings(0)).active).to.be.false;
    });

    it('should allow owner to withdraw platform fees', async () => {
        const tokenId = 0;
        const price = ethers.parseEther('1');
        await marketplace.connect(seller).listNFT(tokenId, price, { value: ethers.parseEther('0.005') });
        await marketplace.connect(buyer).buyNFT(0, { value: price });

        const balanceBefore = await ethers.provider.getBalance(await marketplace.getAddress());
        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        await expect(marketplace.connect(owner).withdraw())
            .to.emit(marketplace, 'FundsWithdrawn')
            .withArgs(owner.address, balanceBefore);
        expect(await ethers.provider.getBalance(await marketplace.getAddress())).to.equal(0);
        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
        expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });

    it('should allow updating listing fee', async () => {
        const newFee = ethers.parseEther('0.01');
        await expect(marketplace.connect(owner).setListingFee(newFee))
            .to.emit(marketplace, 'ListingFeeUpdated')
            .withArgs(newFee);
        expect(await marketplace.listingFee()).to.equal(newFee);
    });

    it('should allow updating platform fee percent', async () => {
        const newFeePercent = 500; // 5%
        await expect(marketplace.connect(owner).setPlatformFeePercent(newFeePercent))
            .to.emit(marketplace, 'PlatformFeeUpdated')
            .withArgs(newFeePercent);
        expect(await marketplace.platformFeePercent()).to.equal(newFeePercent);
    });

    it('should fail if listing fee is insufficient', async () => {
        await expect(
            marketplace.connect(seller).listNFT(0, ethers.parseEther('1'), { value: ethers.parseEther('0.001') })
        ).to.be.revertedWithCustomError(marketplace, 'InsufficientListingFee');
    });

    it('should fail if not token owner', async () => {
        await expect(
            marketplace.connect(buyer).listNFT(0, ethers.parseEther('1'), { value: ethers.parseEther('0.005') })
        ).to.be.revertedWithCustomError(marketplace, 'NotTokenOwner');
    });

    it('should fail if not approved', async () => {
        await comicNFT.connect(seller).mintComic('ipfs://QmTestURI2', 500, { value: ethers.parseEther('0.01') });
        // Revoke approval for the new token
        await comicNFT.connect(seller).setApprovalForAll(await marketplace.getAddress(), false);
        await expect(
            marketplace.connect(seller).listNFT(1, ethers.parseEther('1'), { value: ethers.parseEther('0.005') })
        ).to.be.revertedWithCustomError(marketplace, 'NotApproved');
    });

    it('should fail if price is zero', async () => {
        await expect(
            marketplace.connect(seller).listNFT(0, 0, { value: ethers.parseEther('0.005') })
        ).to.be.revertedWithCustomError(marketplace, 'InvalidPrice');
    });

    it('should fail if listing not active for purchase', async () => {
        await expect(
            marketplace.connect(buyer).buyNFT(0, { value: ethers.parseEther('1') })
        ).to.be.revertedWithCustomError(marketplace, 'ListingNotActive');
    });

    it('should fail if payment is insufficient', async () => {
        await marketplace.connect(seller).listNFT(0, ethers.parseEther('1'), { value: ethers.parseEther('0.005') });
        await expect(
            marketplace.connect(buyer).buyNFT(0, { value: ethers.parseEther('0.5') })
        ).to.be.revertedWithCustomError(marketplace, 'InsufficientPayment');
    });

    it('should fail if not seller cancels listing', async () => {
        await marketplace.connect(seller).listNFT(0, ethers.parseEther('1'), { value: ethers.parseEther('0.005') });
        await expect(
            marketplace.connect(buyer).cancelListing(0)
        ).to.be.revertedWithCustomError(marketplace, 'NotSeller');
    });

    it('should fail if platform fee percent exceeds maximum', async () => {
        await expect(
            marketplace.connect(owner).setPlatformFeePercent(1001)
        ).to.be.revertedWithCustomError(marketplace, 'InvalidFeePercent');
    });

    it('should fail if no funds to withdraw', async () => {
        await expect(
            marketplace.connect(owner).withdraw()
        ).to.be.revertedWithCustomError(marketplace, 'NoFundsToWithdraw');
    });
});