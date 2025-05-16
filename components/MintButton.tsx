'use client';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { useState } from 'react';
import CustomButton from '@/components/CustomButton';
import ComicNFT from '@/contracts/ComicNFT.json';

type MintButtonProps = {
    ipfsHash: string;
    royalty?: number;
    fee?: string;
    onMintSuccess?: (tokenId: string) => void;
};

export default function MintButton({ ipfsHash, royalty = 1000, fee = '0.01', onMintSuccess }: MintButtonProps) {
    const [isMinting, setIsMinting] = useState(false);

    const handleMint = async () => {
        setIsMinting(true);
        try {
            if (!window.ethereum) throw new Error('MetaMask not installed');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(
                process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                ComicNFT.abi,
                signer
            );
            const tx = await contract.mintComic(`ipfs://${ipfsHash}`, royalty, {
                value: ethers.parseEther(fee),
            });
            const receipt = await tx.wait();
            const tokenId = receipt.events?.find((e: any) => e.event === 'Transfer')?.args?.tokenId.toString();
            toast.success('Comic minted successfully!');
            if (onMintSuccess && tokenId) onMintSuccess(tokenId);
        } catch (error) {
            console.error('Minting error:', error);
            toast.error('Failed to mint comic. Please try again.');
        } finally {
            setIsMinting(false);
        }
    };

    return (
        <CustomButton onClick={handleMint} disabled={isMinting}>
            {isMinting ? 'Minting...' : 'Mint Comic'}
        </CustomButton>
    );
}