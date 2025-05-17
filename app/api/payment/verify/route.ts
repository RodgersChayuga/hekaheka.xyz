// app/api/payment/verify/route.ts

import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(req: Request) {
    try {
        const { txHash, amount, comicId, address } = await req.json();

        // Input validation
        if (!txHash || !amount || !comicId || !address) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const provider = new ethers.JsonRpcProvider(process.env.BASE_RPC_URL);

        // Verify transaction exists
        const tx = await provider.getTransaction(txHash);
        if (!tx) {
            return NextResponse.json(
                { error: 'Transaction not found' },
                { status: 404 }
            );
        }

        // Verify transaction recipient
        if (tx.to?.toLowerCase() !== process.env.NEXT_PUBLIC_PAYMENT_ADDRESS?.toLowerCase()) {
            return NextResponse.json(
                { error: 'Invalid payment recipient' },
                { status: 400 }
            );
        }

        // Verify amount with buffer for floating point precision
        const expectedAmount = ethers.parseEther(amount.toString());
        const difference = (tx.value - expectedAmount) < 0n ? -(tx.value - expectedAmount) : (tx.value - expectedAmount);
        const acceptableDifference = ethers.parseEther("0.0001");
        if (difference > acceptableDifference) {
            return NextResponse.json(
                { error: 'Invalid payment amount' },
                { status: 400 }
            );
        }

        // Verify transaction confirmation
        const receipt = await tx.wait();
        if (!receipt || receipt.status !== 1) {
            return NextResponse.json(
                { error: 'Transaction not confirmed' },
                { status: 400 }
            );
        }

        // Here you would typically:
        // 1. Check if payment was already processed (prevent duplicate processing)
        // 2. Update database with payment details
        // 3. Trigger any post-payment actions (NFT minting, access granting, etc.)

        return NextResponse.json({
            success: true,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber
        });
    } catch (error) {
        console.error('Payment verification error:', error);
        return NextResponse.json(
            { error: 'Failed to verify payment' },
            { status: 500 }
        );
    }
}