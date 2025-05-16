'use client';
import Link from 'next/link';
import { Instagram, Facebook, MessageCircle } from 'lucide-react';
// import ConnectAndSIWE from '@/components/ConnectAndSIWE';
import Image from 'next/image';

const SOCIAL_LINKS = {
    instagram: 'https://instagram.com/hekaheka',
    facebook: 'https://facebook.com/hekaheka',
    whatsapp: 'https://wa.me/254720033411',
};

type MenuItem = {
    label: string;
    href: string;
};

const menuLinks: Record<string, MenuItem> = {
    home: { label: 'HOME', href: '/' },
    howItWorks: { label: 'HOW IT WORKS', href: '/how-it-works' },
    mint: { label: 'MINT', href: '/mint' },
    marketplace: { label: 'MARKETPLACE', href: '/marketplace' },
    profile: { label: 'PROFILE', href: '/profile' },
};

export default function Header() {
    return (
        <header className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/40 backdrop-blur-md shadow-md">
            <nav className="flex space-x-4">
                {Object.values(menuLinks).map((item) => (
                    <Link key={item.href} href={item.href}>
                        <button className="text-gray-700 hover:text-yellow-500">{item.label}</button>
                    </Link>
                ))}
            </nav>
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
                <Image src="/images/comic_thunder.png" alt="HekaHeka logo" width={128} height={128} />
            </Link>
            <div className="flex items-center space-x-4">
                <Link href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6 text-gray-700 hover:text-yellow-500" />
                </Link>
                <Link href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-6 w-6 text-gray-700 hover:text-yellow-500" />
                </Link>
                <Link href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-6 w-6 text-gray-700 hover:text-yellow-500" />
                </Link>
                {/* <ConnectAndSIWE /> */}
            </div>
        </header>
    );
}