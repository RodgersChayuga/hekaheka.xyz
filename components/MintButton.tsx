import { ethers } from "ethers";
import { toast } from "sonner";
import ComicNFT from "@/contracts/artifacts/contracts/ComicNFT.sol/ComicNFT.json";

// components/MintButton.tsx
export const handleMint = async (ipfsHash: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
        ComicNFT.abi,
        signer
    );

    const tx = await contract.mintComic(
        `ipfs://${ipfsHash}`,
        1000, // 10% royalty
        { value: ethers.parseEther("0.01") }
    );

    await tx.wait();
    toast.success("Comic minted successfully!");
};