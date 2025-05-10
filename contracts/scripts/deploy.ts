import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
    // Environment variables should already be loaded by hardhat.config.ts
    const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    // Verify environment is properly set up
    if (!baseRpcUrl) {
        throw new Error('NEXT_PUBLIC_BASE_RPC_URL is not set in .env.local');
    }
    if (!privateKey) {
        throw new Error('PRIVATE_KEY is not set in .env.local');
    }

    console.log('Deploying contracts to Base Sepolia...');

    // Initialize deployment details
    const network = await ethers.provider.getNetwork();
    const deploymentDetails = {
        network: {
            name: 'baseSepolia',
            chainId: network.chainId.toString(), // Convert BigInt to string
        },
        contracts: [] as Array<{
            name: string;
            address: string;
            transactionHash: string;
            deployedAt: string;
        }>,
        deployedAt: new Date().toISOString(),
    };

    // Deploy ComicNFT
    console.log('Deploying ComicNFT...');
    const ComicNFT = await ethers.getContractFactory('ComicNFT');
    const comicNFT = await ComicNFT.deploy();
    const comicNFTTx = comicNFT.deploymentTransaction();
    if (!comicNFTTx) {
        throw new Error('Failed to retrieve ComicNFT deployment transaction');
    }
    await comicNFT.waitForDeployment();
    const comicNFTAddress = await comicNFT.getAddress();
    console.log(`ComicNFT deployed to: ${comicNFTAddress}`);

    deploymentDetails.contracts.push({
        name: 'ComicNFT',
        address: comicNFTAddress,
        transactionHash: comicNFTTx.hash,
        deployedAt: new Date().toISOString(),
    });

    // Deploy ComicMarketplace
    console.log('Deploying ComicMarketplace...');
    const ComicMarketplace = await ethers.getContractFactory('ComicMarketplace');
    const comicMarketplace = await ComicMarketplace.deploy(comicNFTAddress);
    const comicMarketplaceTx = comicMarketplace.deploymentTransaction();
    if (!comicMarketplaceTx) {
        throw new Error('Failed to retrieve ComicMarketplace deployment transaction');
    }
    await comicMarketplace.waitForDeployment();
    const comicMarketplaceAddress = await comicMarketplace.getAddress();
    console.log(`ComicMarketplace deployed to: ${comicMarketplaceAddress}`);

    deploymentDetails.contracts.push({
        name: 'ComicMarketplace',
        address: comicMarketplaceAddress,
        transactionHash: comicMarketplaceTx.hash,
        deployedAt: new Date().toISOString(),
    });

    // Save deployment details to deployed/deployments.json
    const deployedDir = path.resolve(process.cwd(), 'deployed');
    const deployedFilePath = path.join(deployedDir, 'deployments.json');

    try {
        // Create deployed/ directory if it doesn't exist
        if (!fs.existsSync(deployedDir)) {
            fs.mkdirSync(deployedDir, { recursive: true });
            console.log('Created deployed/ directory');
        }

        // Read existing deployments or initialize empty array
        let existingDeployments: any[] = [];
        if (fs.existsSync(deployedFilePath)) {
            existingDeployments = JSON.parse(fs.readFileSync(deployedFilePath, 'utf8'));
        }

        // Append new deployment details
        existingDeployments.push(deploymentDetails);
        fs.writeFileSync(deployedFilePath, JSON.stringify(existingDeployments, null, 2));
        console.log(`Saved deployment details to ${deployedFilePath}`);
    } catch (error) {
        console.error('Failed to save deployment details:', error);
        throw error;
    }

    // Update .env.local with contract addresses
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    let envContent = '';

    try {
        envContent = fs.existsSync(envLocalPath) ? fs.readFileSync(envLocalPath, 'utf8') : '';

        // Update or append ComicNFT address
        if (envContent.includes('NEXT_PUBLIC_COMIC_NFT_ADDRESS=')) {
            envContent = envContent.replace(
                /NEXT_PUBLIC_COMIC_NFT_ADDRESS=.*/g,
                `NEXT_PUBLIC_COMIC_NFT_ADDRESS=${comicNFTAddress}`
            );
        } else {
            envContent += `\nNEXT_PUBLIC_COMIC_NFT_ADDRESS=${comicNFTAddress}`;
        }

        // Update or append Marketplace address
        if (envContent.includes('NEXT_PUBLIC_MARKETPLACE_ADDRESS=')) {
            envContent = envContent.replace(
                /NEXT_PUBLIC_MARKETPLACE_ADDRESS=.*/g,
                `NEXT_PUBLIC_MARKETPLACE_ADDRESS=${comicMarketplaceAddress}`
            );
        } else {
            envContent += `\nNEXT_PUBLIC_MARKETPLACE_ADDRESS=${comicMarketplaceAddress}`;
        }

        fs.writeFileSync(envLocalPath, envContent);
        console.log('Updated .env.local with contract addresses');
    } catch (error) {
        console.error('Failed to update .env.local:', error);
        throw error;
    }

    // Print deployment summary
    console.log('\nDeployment Summary:');
    console.log(`ComicNFT: ${comicNFTAddress} (Tx: ${comicNFTTx.hash})`);
    console.log(`ComicMarketplace: ${comicMarketplaceAddress} (Tx: ${comicMarketplaceTx.hash})`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('Deployment failed:', error);
        process.exit(1);
    });