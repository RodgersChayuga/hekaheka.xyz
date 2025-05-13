"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";

type PricingOption = {
    id: string;
    name: string;
    price: string;
    description: string;
    period: string;
};

interface PricingPlanProps {
    title: string;
    subtitle: string;
    coverImage: string;
    options: PricingOption[];
    selectedOption: string;
    onOptionChange: (value: string) => void;
    ctaText: string;
    onCtaClick: () => void;
    disabled?: boolean;
}

export const PricingPlan = ({
    title,
    subtitle,
    coverImage,
    options,
    selectedOption,
    onOptionChange,
    ctaText,
    onCtaClick,
    disabled = false,
}: PricingPlanProps) => {
    return (
        <div className="w-full max-w-sm flex flex-col bg-white rounded-lg border-2 border-black p-4">
            <div className="space-y-1 text-left mb-4">
                <h3 className="text-3xl font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="relative mx-auto mb-6 w-40 h-56">
                <Image
                    src={coverImage}
                    alt={`${title} cover`}
                    fill
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAC0wEy3fGscAAAAABJRU5ErkJggg=="
                />
            </div>

            <RadioGroup
                value={selectedOption}
                onValueChange={onOptionChange}
                className="space-y-3 mb-6"
                aria-label={`Payment options for ${title}`}
            >
                {options.map((option) => (
                    <div
                        key={option.id}
                        className={cn(
                            "flex items-center justify-between rounded-lg border-2 p-4",
                            selectedOption === option.id ? "border-primary bg-primary/10" : "border-gray-200"
                        )}
                    >
                        <div className="flex items-center space-x-3">
                            <RadioGroupItem value={option.id} id={option.id} />
                            <Label htmlFor={option.id} className="font-medium">
                                {option.name}
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                            </Label>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-bold">{option.price}</p>
                            <p className="text-xs text-muted-foreground">{option.period}</p>
                        </div>
                    </div>
                ))}
            </RadioGroup>

            <CustomButton onClick={onCtaClick} disabled={disabled} className="w-full">
                {ctaText}
            </CustomButton>
        </div>
    );
};

export default PricingPlan;