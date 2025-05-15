// ipfs/pinata.ts
import PinataSDK from '@pinata/sdk';
import { ComicMetadata } from '@/types/comic';
import { Readable } from 'stream';

// Initialize Pinata once
const pinata = new PinataSDK({
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_KEY,
});

// Validate environment variables at startup
if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_KEY) {
    throw new Error('Pinata API keys are missing in environment variables');
}

export async function pinJSONToIPFS(metadata: ComicMetadata): Promise<{ IpfsHash: string }> {
    try {
        // Validate metadata structure
        if (!metadata.name || !metadata.pages?.length) {
            throw new Error('Invalid comic metadata structure');
        }

        const response = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: metadata.name,
                keyvalues: JSON.stringify({
                    type: 'comic-metadata',
                    version: '1.0'
                })
            },
            pinataOptions: {
                cidVersion: 1, // Use CID v1 for better compatibility
                wrapWithDirectory: false
            }
        });

        if (!response.IpfsHash) {
            throw new Error('IPFS hash missing in pinata response');
        }

        return { IpfsHash: response.IpfsHash };
    } catch (error: any) {
        console.error('Pinata JSON Pinning Error:', {
            error: error.message,
            metadata: { name: metadata.name, pages: metadata.pages?.length }
        });
        throw new Error(`Metadata upload failed: ${error.message}`);
    }
}

export async function pinFileToIPFS(file: Readable | Buffer, fileName: string): Promise<{ IpfsHash: string }> {
    try {
        // Validate input
        if (!(file instanceof Readable) && !Buffer.isBuffer(file)) {
            throw new Error('Invalid file input');
        }

        const readableStream = Buffer.isBuffer(file) ? Readable.from(file) : file;
        const response = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: {
                name: fileName,
                keyvalues: JSON.stringify({
                    type: 'comic-asset',
                    format: fileName.split('.').pop()?.toUpperCase() || 'UNKNOWN'
                })
            },
            pinataOptions: {
                cidVersion: 1,
                wrapWithDirectory: false
            }
        });

        if (!response.IpfsHash) {
            throw new Error('IPFS hash missing in pinata response');
        }

        return { IpfsHash: response.IpfsHash };
    } catch (error: any) {
        console.error('Pinata File Pinning Error:', {
            error: error.message,
            fileName,
            fileSize: Buffer.isBuffer(file) ? file.byteLength : 'stream'
        });
        throw new Error(`File upload failed for ${fileName}: ${error.message}`);
    }
}

export async function getJSONFromIPFS(ipfsHash: string): Promise<ComicMetadata> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
        const response = await fetch(
            `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
            { signal: controller.signal }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const metadata = await response.json();

        // Validate response structure
        if (!metadata.name || !metadata.pages) {
            throw new Error('Invalid comic metadata structure');
        }

        return metadata as ComicMetadata;
    } catch (error: any) {
        console.error('IPFS Retrieval Error:', {
            ipfsHash,
            error: error.message
        });
        throw new Error(`Failed to fetch comic data: ${error.message}`);
    } finally {
        clearTimeout(timeout);
    }
}

// Optional: Add periodic Pinata authentication check
export async function verifyPinataAuth(): Promise<boolean> {
    try {
        await pinata.testAuthentication();
        return true;
    } catch (error) {
        console.error('Pinata Authentication Failed:', error);
        return false;
    }
}