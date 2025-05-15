import { ethers } from 'ethers';
import { getComicMarketplaceContract } from './contracts';

export interface ListingDetails {
    seller: string;
    tokenId: string;
    price: string;
    active: boolean;
}

export interface PurchaseResult {
    listingId: string;
    tokenId: string;
    transactionHash: string;
}

export async function listNFT(
    tokenId: number,
    price: string,
    seller: string
): Promise<{ listingId: string; transactionHash: string }> {
    if (!ethers.isAddress(seller)) {
        throw new Error('Invalid seller address');
    }
    if (tokenId < 0) {
        throw new Error('Invalid token ID');
    }
    const priceWei = ethers.parseEther(price);
    if (priceWei <= 0) {
        throw new Error('Price must be greater than 0');
    }

    const contract = getComicMarketplaceContract(true);
    const listingFee = ethers.parseEther('0.005');

    try {
        const tx = await contract.listNFT(tokenId, priceWei, {
            value: listingFee,
            gasLimit: 400000,
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
            .find(e => e?.name === 'Listed');
        if (!event) {
            throw new Error('Listed event not found in transaction logs');
        }
        const listingId = event.args[0].toString();

        return {
            listingId,
            transactionHash: receipt.hash,
        };
    } catch (error: any) {
        console.error('Listing failed:', error);
        if (error.reason?.includes('InsufficientListingFee')) {
            throw new Error('Insufficient listing fee: 0.005 ETH required');
        } else if (error.reason?.includes('InvalidPrice')) {
            throw new Error('Price must be greater than 0');
        } else if (error.reason?.includes('NotTokenOwner')) {
            throw new Error('Caller is not the token owner');
        } else if (error.reason?.includes('NotApproved')) {
            throw new Error('Marketplace not approved to transfer NFT');
        }
        throw new Error(`Failed to list NFT: ${error.message || 'Unknown error'}`);
    }
}

export async function buyNFT(
    listingId: number,
    buyer: string,
    value: string
): Promise<PurchaseResult> {
    if (!ethers.isAddress(buyer)) {
        throw new Error('Invalid buyer address');
    }
    if (listingId < 0) {
        throw new Error('Invalid listing ID');
    }
    const valueWei = ethers.parseEther(value);
    if (valueWei <= 0) {
        throw new Error('Payment must be greater than 0');
    }

    const contract = getComicMarketplaceContract(true);

    try {
        const tx = await contract.buyNFT(listingId, {
            value: valueWei,
            gasLimit: 500000,
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
            .find(e => e?.name === 'Purchased');
        if (!event) {
            throw new Error('Purchased event not found in transaction logs');
        }
        const returnedListingId = event.args[0].toString();
        const tokenId = event.args[1].toString();

        return {
            listingId: returnedListingId,
            tokenId,
            transactionHash: receipt.hash,
        };
    } catch (error: any) {
        console.error('Purchase failed:', error);
        if (error.reason?.includes('ListingNotActive')) {
            throw new Error('Listing is not active');
        } else if (error.reason?.includes('InsufficientPayment')) {
            throw new Error('Insufficient payment for the listing price');
        } else if (error.reason?.includes('TransferFailed')) {
            throw new Error('Failed to transfer funds');
        }
        throw new Error(`Failed to buy NFT: ${error.message || 'Unknown error'}`);
    }
}

export async function cancelListing(
    listingId: number,
    seller: string
): Promise<{ listingId: string; transactionHash: string }> {
    if (!ethers.isAddress(seller)) {
        throw new Error('Invalid seller address');
    }
    if (listingId < 0) {
        throw new Error('Invalid listing ID');
    }

    const contract = getComicMarketplaceContract(true);

    try {
        const tx = await contract.cancelListing(listingId, {
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
            .find(e => e?.name === 'Cancelled');
        if (!event) {
            throw new Error('Cancelled event not found in transaction logs');
        }
        const returnedListingId = event.args[0].toString();

        return {
            listingId: returnedListingId,
            transactionHash: receipt.hash,
        };
    } catch (error: any) {
        console.error('Cancel listing failed:', error);
        if (error.reason?.includes('ListingNotActive')) {
            throw new Error('Listing is not active');
        } else if (error.reason?.includes('NotSeller')) {
            throw new Error('Caller is not the seller');
        }
        throw new Error(`Failed to cancel listing: ${error.message || 'Unknown error'}`);
    }
}

export async function getListingDetails(listingId: number): Promise<ListingDetails> {
    if (listingId < 0) {
        throw new Error('Invalid listing ID');
    }

    const contract = getComicMarketplaceContract(false);
    try {
        const [seller, tokenId, price, active] = await contract.getListingDetails(listingId);
        return {
            seller,
            tokenId: tokenId.toString(),
            price: ethers.formatEther(price),
            active,
        };
    } catch (error: any) {
        console.error('Failed to get listing details:', error);
        throw new Error(`Failed to get listing details: ${error.message || 'Unknown error'}`);
    }
}

export async function checkIfTokenIsListed(
    tokenId: number
): Promise<{ listingId: string; isListed: boolean }> {
    if (tokenId < 0) {
        throw new Error('Invalid token ID');
    }

    const contract = getComicMarketplaceContract(false);
    try {
        const [listingId, isListed] = await contract.checkIfTokenIsListed(tokenId);
        return {
            listingId: listingId.toString(),
            isListed,
        };
    } catch (error: any) {
        console.error('Failed to check token listing:', error);
        throw new Error(`Failed to check token listing: ${error.message || 'Unknown error'}`);
    }
}