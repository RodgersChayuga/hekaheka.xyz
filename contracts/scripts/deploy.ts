import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface for deployment details
 */
interface Deployment {
    network: {
        name: string;
        chainId: string
    };
    contracts: Array<{
        name: string;
        address: string;
        transactionHash: string;
        deployedAt: string
    }>;
    deployedAt: string;
}

/**
 * Main deployment function
 */
async function main() {
    try {
        // Get environment variables
        const baseRpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL;
        const privateKey = process.env.PRIVATE_KEY;

        // Verify environment is properly set up
        if (!baseRpcUrl) {
            console.warn('Warning: NEXT_PUBLIC_BASE_RPC_URL is not set in .env.local');
        }
        if (!privateKey) {
            console.warn('Warning: PRIVATE_KEY is not set in .env.local');
        }

        // Get deployer account
        const [deployer] = await ethers.getSigners();
        console.log('Deploying contracts with account:', deployer.address);
        console.log('Account balance:', ethers.formatEther(await deployer.provider.getBalance(deployer.address)));

        // Get network information
        const network = await ethers.provider.getNetwork();
        const networkName = network.name === 'unknown' ? 'baseSepolia' : network.name;

        console.log(`Deploying contracts to ${networkName} (Chain ID: ${network.chainId})...`);

        // Initialize deployment details
        const deploymentDetails: Deployment = {
            network: {
                name: networkName,
                chainId: network.chainId.toString(), // Convert BigInt to string
            },
            contracts: [],
            deployedAt: new Date().toISOString(),
        };

        // Deploy ComicNFT
        console.log('\nDeploying ComicNFT...');
        const ComicNFT = await ethers.getContractFactory('ComicNFT');
        const comicNFT = await ComicNFT.deploy();
        const comicNFTTx = comicNFT.deploymentTransaction();

        if (!comicNFTTx) {
            throw new Error('Failed to retrieve ComicNFT deployment transaction');
        }

        await comicNFT.waitForDeployment();
        const comicNFTAddress = await comicNFT.getAddress();
        console.log(`ComicNFT deployed to: ${comicNFTAddress}`);
        console.log(`Transaction hash: ${comicNFTTx.hash}`);

        deploymentDetails.contracts.push({
            name: 'ComicNFT',
            address: comicNFTAddress,
            transactionHash: comicNFTTx.hash,
            deployedAt: new Date().toISOString(),
        });

        // Deploy ComicMarketplace
        console.log('\nDeploying ComicMarketplace...');
        const ComicMarketplace = await ethers.getContractFactory('ComicMarketplace');
        const comicMarketplace = await ComicMarketplace.deploy(comicNFTAddress);
        const comicMarketplaceTx = comicMarketplace.deploymentTransaction();

        if (!comicMarketplaceTx) {
            throw new Error('Failed to retrieve ComicMarketplace deployment transaction');
        }

        await comicMarketplace.waitForDeployment();
        const comicMarketplaceAddress = await comicMarketplace.getAddress();
        console.log(`ComicMarketplace deployed to: ${comicMarketplaceAddress}`);
        console.log(`Transaction hash: ${comicMarketplaceTx.hash}`);

        deploymentDetails.contracts.push({
            name: 'ComicMarketplace',
            address: comicMarketplaceAddress,
            transactionHash: comicMarketplaceTx.hash,
            deployedAt: new Date().toISOString(),
        });

        // Save deployment details to deployed/deployments.json
        await saveDeploymentDetails(deploymentDetails);

        // Update .env.local with contract addresses
        await updateEnvFile(comicNFTAddress, comicMarketplaceAddress);

        // Print deployment summary
        console.log('\nDeployment Summary:');
        console.log(`Network: ${networkName} (Chain ID: ${network.chainId})`);
        console.log(`ComicNFT: ${comicNFTAddress}`);
        console.log(`ComicMarketplace: ${comicMarketplaceAddress}`);
        console.log(`Deployed by: ${deployer.address}`);
        console.log(`Deployment timestamp: ${new Date().toISOString()}`);

    } catch (error) {
        console.error('Deployment failed:', error);
        process.exitCode = 1;
    }
}

/**
 * Save deployment details to JSON file
 */
async function saveDeploymentDetails(deploymentDetails: Deployment): Promise<void> {
    // Prepare directory and file paths
    const deployedDir = path.resolve(process.cwd(), 'deployed');
    const deployedFilePath = path.join(deployedDir, 'deployments.json');

    try {
        // Create deployed/ directory if it doesn't exist
        if (!fs.existsSync(deployedDir)) {
            fs.mkdirSync(deployedDir, { recursive: true });
            console.log('Created deployed/ directory');
        }

        // Read existing deployments or initialize empty array
        let existingDeployments: Deployment[] = [];
        if (fs.existsSync(deployedFilePath)) {
            const fileData = fs.readFileSync(deployedFilePath, 'utf8');
            existingDeployments = JSON.parse(fileData);
        }

        // Append new deployment details
        existingDeployments.push(deploymentDetails);
        fs.writeFileSync(deployedFilePath, JSON.stringify(existingDeployments, null, 2));
        console.log(`Saved deployment details to ${deployedFilePath}`);
    } catch (error) {
        console.error('Failed to save deployment details:', error);
        throw error;
    }
}

/**
 * Update .env.local file with contract addresses
 */
async function updateEnvFile(comicNFTAddress: string, marketplaceAddress: string): Promise<void> {
    const envLocalPath = path.resolve(process.cwd(), '.env.local');
    let envContent = '';

    try {
        // Read existing .env.local or create new one
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
                `NEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`
            );
        } else {
            envContent += `\nNEXT_PUBLIC_MARKETPLACE_ADDRESS=${marketplaceAddress}`;
        }

        // Write back to .env.local
        fs.writeFileSync(envLocalPath, envContent);
        console.log('Updated .env.local with contract addresses');
    } catch (error) {
        console.error('Failed to update .env.local:', error);
        throw error;
    }
}

// Run the deployment script
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});