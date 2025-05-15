import { ethers } from 'ethers';
import { getComicNFTContract } from './contracts';

export async function mintNFT(
    metadataURI: string,
    royalty: number,
    recipient: string
): Promise<{ tokenId: string; transactionHash: string }> {
    if (!metadataURI.startsWith('ipfs://')) {
        throw new Error('Metadata URI must start with ipfs://');
    }
    if (royalty < 0 || royalty > 1000) {
        throw new Error('Royalty must be between 0 and 1000 (10%)');
    }
    if (!ethers.isAddress(recipient)) {
        throw new Error('Invalid recipient address');
    }

    const contract = getComicNFTContract(true);
    const mintFee = ethers.parseEther('0.01');

    try {
        const tx = await contract.mintComic(metadataURI, royalty, {
            value: mintFee,
            gasLimit: 300000,
        });
        const receipt = await tx.wait();
        if (!receipt) {
            throw new Error('Transaction receipt not received');
        }

        const event = receipt.logs
            .map(log => {
                try {
                    return contract.interface.parseLog(log);
                } catch {
                    return null;
                }
            })
            .find(e => e?.name === 'ComicMinted');
        if (!event) {
            throw new Error('ComicMinted event not found in transaction logs');
        }
        const tokenId = event.args[0].toString();

        return {
            tokenId,
            transactionHash: receipt.hash,
        };
    } catch (error: any) {
        console.error('Minting failed:', error);
        if (error.reason?.includes('InsufficientMintingFee')) {
            throw new Error('Insufficient minting fee: 0.01 ETH required');
        } else if (error.reason?.includes('InvalidRoyalty')) {
            throw new Error('Royalty must not exceed 10% (1000 basis points)');
        } else if (error.reason?.includes('EmptyTokenURI')) {
            throw new Error('Token URI cannot be empty');
        }
        throw new Error(`Failed to mint NFT: ${error.message || 'Unknown error'}`);
    }
}