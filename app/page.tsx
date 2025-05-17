'use client';
import { useRouter } from 'next/navigation';
import Background from '@/components/Background';
import CustomButton from '@/components/CustomButton';
import Image from 'next/image';
import { backgroundConfigs } from '@/components/Background/background-configs';
import { useAccount, useConnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useZustandStore } from '@/lib/store';
import { useState, useEffect } from 'react';

export default function Home() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const { setWallet } = useZustandStore();
    const { connectAsync } = useConnect();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true); // Ensure component is mounted before rendering state-dependent UI
    }, []);

    const handleConnect = async () => {
        try {
            const connector = coinbaseWallet({
                appName: 'HekaHeka',
                appLogoUrl: '/images/comic_cloud.png',
            });
            await connectAsync({ connector });
            if (address && isConnected) {
                setWallet({ address, isValid: true });
                router.push('/story-input');
            }
        } catch (error) {
            console.error('Connection error:', error);
        }
    };

    if (!isMounted) {
        return null; // Prevent rendering until mounted to avoid hydration issues
    }

    return (
        <Background config={backgroundConfigs.home} >
            <div className="flex gap-8 relative ">
                {/* Description Section */}
                <div className="relative flex-1 h-full">
                    <div className="w-full ">
                        <Image
                            src="/images/comic-page-1.png" // Placeholder, replace with actual image
                            alt="Comic panel"
                            width={400}
                            height={300}
                            className="object-cover w-full animate-float" />
                    </div>
                    <p className="mt-4 text-xl font-light text-black font-geist leading-relaxed">
                        HekaHeka transforms real-life memories into epic, AI-powered comic books – minted forever onchain. Users narrate their moments, upload a few photos to inspire their character, and instantly mint their own.
                    </p>
                    {/* Onomatopoeia Burst */}

                </div>

                {/* Hero Section */}
                <div className="text-center flex flex-col items-center justify-center  flex-1 relative ">
                    <div className="  ">
                        <Image
                            src="/images/comic_cloud.png"
                            alt="Right cloud"
                            width={400}
                            height={400}
                            className="" />

                    </div>
                    <div className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-black mb-8">
                        <span className="relative inline-block">
                            <span className="absolute inset-0  transform -skew-y-6 z-0" />
                            <span className="relative z-10 font-permanent-marker">&quot;TURN YOUR LIFE MOMENTS INTO A COMIC BOOK&quot;</span>
                        </span>
                    </div>
                    <CustomButton onClick={handleConnect}>
                        {isConnected ? 'Proceed' : 'Connect Wallet with Smart Wallet'}
                    </CustomButton>
                </div>
            </div >
        </Background>
    )
}
