import { ethers } from 'ethers';
import { getProvider } from '@/lib/blockchain/ethers';

export async function verifyCryptoPayment(
    transactionHash: string,
    recipient: string,
    amountETH: string
): Promise<{ blockNumber: number }> {
    try {
        const provider = getProvider();
        const tx = await provider.getTransaction(transactionHash);
        if (!tx) {
            throw new Error('Transaction not found');
        }

        const receipt = await tx.wait();
        if (!receipt) {
            throw new Error('Transaction receipt not received');
        }

        if (tx.to?.toLowerCase() !== recipient.toLowerCase()) {
            throw new Error('Transaction sent to incorrect recipient');
        }

        const expectedAmount = ethers.parseEther(amountETH);
        if (tx.value < expectedAmount) {
            throw new Error('Insufficient payment amount');
        }

        return { blockNumber: receipt.blockNumber };
    } catch (error: any) {
        console.error('Crypto payment verification error:', error);
        throw new Error(`Failed to verify payment: ${error.message || 'Unknown error'}`);
    }
}