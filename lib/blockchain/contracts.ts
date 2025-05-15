import { ethers } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';
import { ComicNFT } from '@/typechain-types/contracts/ComicNFT';
import { ComicMarketplace } from '@/typechain-types/contracts/ComicMarketplace';
import { ComicNFT__factory, ComicMarketplace__factory } from '@/typechain-types/factories/contracts';
import { getProvider, getSigner } from './ethers';

interface Deployment {
    network: {
        name: string;
        chainId: string;
    };
    contracts: Array<{
        name: string;
        address: string;
        transactionHash: string;
        deployedAt: string;
    }>;
    deployedAt: string;
}

const getLatestDeployment = (): Deployment => {
    const deployedFilePath = path.resolve(process.cwd(), 'deployed', 'deployments.json');
    if (!fs.existsSync(deployedFilePath)) {
        throw new Error('deployed/deployments.json not found. Run deployment script first.');
    }
    const deployments: Deployment[] = JSON.parse(fs.readFileSync(deployedFilePath, 'utf8'));
    if (deployments.length === 0) {
        throw new Error('No deployments found in deployed/deployments.json');
    }
    return deployments[deployments.length - 1];
};

export const getComicNFTContract = (useSigner: boolean = false): ComicNFT => {
    const deployment = getLatestDeployment();
    const contractInfo = deployment.contracts.find(c => c.name === 'ComicNFT');
    if (!contractInfo) {
        throw new Error('ComicNFT contract not found in deployed/deployments.json');
    }
    const providerOrSigner = useSigner ? getSigner() : getProvider();
    return ComicNFT__factory.connect(contractInfo.address, providerOrSigner);
};

export const getComicMarketplaceContract = (useSigner: boolean = false): ComicMarketplace => {
    const deployment = getLatestDeployment();
    const contractInfo = deployment.contracts.find(c => c.name === 'ComicMarketplace');
    if (!contractInfo) {
        throw new Error('ComicMarketplace contract not found in deployed/deployments.json');
    }
    const providerOrSigner = useSigner ? getSigner() : getProvider();
    return ComicMarketplace__factory.connect(contractInfo.address, providerOrSigner);
};