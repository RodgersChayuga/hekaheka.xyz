import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

const Header = () => {
    type MenuItem = "HOME" | "HOW IT WORKS" | "MINT" | "MARKETPLACE";
    const menuLinks: Record<MenuItem, string> = {
        HOME: "/",
        "HOW IT WORKS": "/how-it-works",
        MINT: "/mint",
        MARKETPLACE: "/marketplace",
    };

    return (
        <header className=" z-50 sticky ">
            <nav className="fixed  w-full bg-white/40  shadow-sm z-50 py-4">
                <div className="container mx-auto flex items-center justify-around h-16 px-4 relative">
                    {/* Left Menu Items */}
                    <div className="flex items-center gap-4">
                        {(["HOME", "HOW IT WORKS"] as MenuItem[]).map((item) => (
                            <Button
                                key={item}
                                variant="ghost"
                                className="text-xl font-permanent-marker hover:bg-transparent text-black hover:text-yellow-500"
                                asChild
                            >
                                <Link href={menuLinks[item]}>{item}</Link>
                            </Button>
                        ))}
                    </div>

                    {/* Center Logo with Home Link */}
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/">
                            <div className="w-20 h-20 relative hover:cursor-pointer">
                                <Image
                                    src="/images/comic_thunder.png"
                                    alt="ComicChain logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Right Menu Items and Social Icons */}
                    <div className="flex items-center gap-4">
                        {(["MINT", "MARKETPLACE"] as MenuItem[]).map((item) => (
                            <Button
                                key={item}
                                variant="ghost"
                                className="text-xl font-permanent-marker hover:bg-transparent text-black hover:text-yellow-500"
                                asChild
                            >
                                <Link href={menuLinks[item]}>{item}</Link>
                            </Button>
                        ))}
                        {/* Social Media Icons (mocked URLs) */}
                        <div className="flex gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <Instagram />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <Facebook />
                            </a>
                            <a href="https://wa.me/25472003341" target="_blank" rel="noopener noreferrer" className="w-6 h-6 hover:text-yellow-500">
                                <MessageCircle />
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;