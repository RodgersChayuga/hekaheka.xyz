import { expect } from 'chai';
import { ethers } from 'hardhat';
import { ComicNFT } from '../../typechain-types';

describe('ComicNFT', () => {
    let comicNFT: ComicNFT;
    let owner: any, user: any;

    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();
        const ComicNFTFactory = await ethers.getContractFactory('ComicNFT');
        comicNFT = (await ComicNFTFactory.deploy()) as ComicNFT;
    });

    it('should initialize correctly', async () => {
        expect(await comicNFT.name()).to.equal('ComicChain');
        expect(await comicNFT.symbol()).to.equal('COMIC');
        expect(await comicNFT.getTokenCounter()).to.equal(0);
        expect(await comicNFT.owner()).to.equal(owner.address);
    });

    it('should mint a comic NFT', async () => {
        const tokenURI = 'ipfs://QmTestURI';
        const royalty = 500; // 5%
        const mintFee = ethers.parseEther('0.01');

        await expect(comicNFT.connect(user).mintComic(tokenURI, royalty, { value: mintFee }))
            .to.emit(comicNFT, 'ComicMinted')
            .withArgs(0, user.address, tokenURI, royalty);

        expect(await comicNFT.ownerOf(0)).to.equal(user.address);
        expect(await comicNFT.tokenURI(0)).to.equal(tokenURI);
        expect(await comicNFT.getCreator(0)).to.equal(user.address);
        expect(await comicNFT.getRoyaltyPercentage(0)).to.equal(royalty);
        expect(await comicNFT.getTokenCounter()).to.equal(1);
    });

    it('should fail if minting fee is insufficient', async () => {
        await expect(
            comicNFT.connect(user).mintComic('ipfs://QmTestURI', 500, { value: ethers.parseEther('0.005') })
        ).to.be.revertedWithCustomError(comicNFT, 'InsufficientMintingFee');
    });

    it('should fail if royalty exceeds 10%', async () => {
        await expect(
            comicNFT.connect(user).mintComic('ipfs://QmTestURI', 1001, { value: ethers.parseEther('0.01') })
        ).to.be.revertedWithCustomError(comicNFT, 'InvalidRoyalty');
    });

    it('should fail if token URI is empty', async () => {
        await expect(
            comicNFT.connect(user).mintComic('', 500, { value: ethers.parseEther('0.01') })
        ).to.be.revertedWithCustomError(comicNFT, 'EmptyTokenURI');
    });

    it('should fail if querying non-existent token', async () => {
        await expect(comicNFT.tokenURI(0)).to.be.revertedWithCustomError(comicNFT, 'ERC721NonexistentToken');
        await expect(comicNFT.getCreator(0)).to.be.revertedWithCustomError(comicNFT, 'TokenDoesNotExist');
        await expect(comicNFT.getRoyaltyPercentage(0)).to.be.revertedWithCustomError(comicNFT, 'TokenDoesNotExist');
    });

    it('should allow owner to withdraw funds', async () => {
        const mintFee = ethers.parseEther('0.01');
        await comicNFT.connect(user).mintComic('ipfs://QmTestURI', 500, { value: mintFee });

        const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
        await expect(comicNFT.connect(owner).withdraw())
            .to.emit(comicNFT, 'FundsWithdrawn')
            .withArgs(owner.address, mintFee);
        const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);

        expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });

    it('should fail if no funds to withdraw', async () => {
        await expect(comicNFT.connect(owner).withdraw()).to.be.revertedWithCustomError(comicNFT, 'NoFundsToWithdraw');
    });
});