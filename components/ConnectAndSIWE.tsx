'use client';
import { useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { useZustandStore } from '@/lib/store';

export default function ConnectAndSIWE() {
    const { address, isConnected } = useAccount();
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { signMessageAsync } = useSignMessage();
    const { wallet, setWallet } = useZustandStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isConnected && address && !wallet) {
            // If connected but wallet state not set, attempt SIWE
            handleSignIn();
        }
    }, [isConnected, address, wallet]);

    const handleSignIn = async () => {
        if (!address || !isConnected) return;

        setIsLoading(true);
        try {
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: 'Sign in to HekaHeka Mini-App',
                uri: window.location.origin,
                version: '1',
                chainId: 8453, // Base chain ID
            });
            const signature = await signMessageAsync({ message: message.prepareMessage() });

            // Verify signature (mocked for now, add server-side verification)
            const isValid = true; // Replace with actual verification

            if (isValid) {
                setWallet({ address, isValid: true });
                console.log('Wallet set in Zustand:', { address, isValid: true });
            } else {
                throw new Error('Signature verification failed');
            }
        } catch (error) {
            console.error('SIWE error:', error);
            disconnect();
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            await connect({ connector: connectors[0] }); // Use the first connector (e.g., MetaMask)
        } catch (error) {
            console.error('Wallet connection failed:', error);
        }
    };

    const handleDisconnect = () => {
        disconnect();
        setWallet(null);
        console.log('Wallet disconnected, Zustand state cleared');
    };

    return (
        <div className="flex items-center gap-4">
            {isConnected && wallet ? (
                <>
                    <span className="text-sm text-gray-600">
                        Connected: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                    </span>
                    <button
                        onClick={handleDisconnect}
                        className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Disconnect
                    </button>
                </>
            ) : (
                <button
                    onClick={handleConnect}
                    disabled={isLoading}
                    className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                </button>
            )}
        </div>
    );
}