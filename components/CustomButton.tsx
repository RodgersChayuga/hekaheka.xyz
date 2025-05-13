"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    children,
    onClick,
    className = "",
    disabled = false,
}) => {
    return (
        <div className="relative inline-block group">
            <Button
                onClick={onClick}
                disabled={disabled}
                aria-disabled={disabled}
                role="button"
                className={`relative z-10 text-xl px-10 py-6 font-bold bg-white text-black rounded-none border-4 border-black hover:bg-gray-100 transition-all duration-300 ease-in-out group-hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            >
                {children}
            </Button>
            <div
                className={`absolute -bottom-2 -right-2 bg-black h-full w-full z-0 transition-all duration-300 ease-in-out group-hover:scale-105 ${disabled ? "opacity-50" : ""}`}
            />
        </div>
    );
};

export default CustomButton;