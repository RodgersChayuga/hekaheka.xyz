import PinataSDK from '@pinata/sdk';
import { ComicMetadata } from '@/types/comic';

const pinata = new PinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

export async function pinJSONToIPFS(metadata: ComicMetadata): Promise<{ IpfsHash: string }> {
    try {
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
            throw new Error('Pinata API keys are not set in environment variables');
        }

        const response = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: metadata.name || `ComicChain-${Date.now()}`,
            },
            pinataOptions: {
                cidVersion: 0,
            },
        });

        if (!response.IpfsHash) {
            throw new Error('Failed to pin metadata to IPFS');
        }

        return { IpfsHash: response.IpfsHash };
    } catch (error: any) {
        console.error('Pinata JSON pinning error:', error);
        throw new Error(`Failed to pin metadata to IPFS: ${error.message || 'Unknown error'}`);
    }
}

export async function pinFileToIPFS(file: Buffer, fileName: string): Promise<{ IpfsHash: string }> {
    try {
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
            throw new Error('Pinata API keys are not set in environment variables');
        }

        const readableStream = require('stream').Readable.from(file);
        const response = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: {
                name: fileName,
            },
            pinataOptions: {
                cidVersion: 0,
            },
        });

        if (!response.IpfsHash) {
            throw new Error('Failed to pin file to IPFS');
        }

        return { IpfsHash: response.IpfsHash };
    } catch (error: any) {
        console.error('Pinata file pinning error:', error);
        throw new Error(`Failed to pin file to IPFS: ${error.message || 'Unknown error'}`);
    }
}

export async function getJSONFromIPFS(ipfsHash: string): Promise<ComicMetadata> {
    try {
        const response = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        const metadata = await response.json();
        return metadata as ComicMetadata;
    } catch (error: any) {
        console.error('IPFS retrieval error:', error);
        throw new Error(`Failed to retrieve metadata from IPFS: ${error.message || 'Unknown error'}`);
    }
}