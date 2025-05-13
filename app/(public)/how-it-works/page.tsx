"use client";

import CustomButton from "@/components/CustomButton";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Props = {};

function HowItWorks({ }: Props) {
  const router = useRouter();
  const [story, setStory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [characters, setCharacters] = useState<string[]>([]);

  const handleBack = () => {
    router.push("/");
  };

  const handleNext = async () => {
    if (!story.trim()) {
      toast.error("Please enter your story.");
      return;
    }
    if (characters.length === 0) {
      toast.error("Please enter at least one character name.");
      return;
    }
    if (characters.length > 4) {
      toast.error("You can only enter up to 4 characters.");
      return;
    }

    try {
      const response = await fetch("/api/comics/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story, characters }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process story");
      }

      const { success } = await response.json();
      if (!success) {
        throw new Error("Story processing failed");
      }

      localStorage.setItem("aiStory", story);
      localStorage.setItem("characters", JSON.stringify(characters));
      router.push("/image-upload");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to process story. Please try again.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    const array = raw
      .split(",")
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);
    setCharacters(array);
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  };

  return (
    <div className="flex gap-8 relative w-full min-h-screen">
      {/* Description Section */}
      <div className="relative flex-1 h-full pt-26">
        <div className="w-full">
          <Image
            src="/images/comic-page-2.png"
            alt="Comic panel"
            width={400}
            height={300}
            className="object-cover w-full animate-float"
          />
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center flex flex-col items-center justify-center flex-1 relative p-4">
        <div className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-black mb-8">
          <span className="relative inline-block">
            <h3 className="relative z-10">TELL US ABOUT</h3>
            <h3 className="relative z-10">YOUR MEMORIES &</h3>
            <h3 className="relative z-10">MILESTONES</h3>
          </span>
        </div>

        <textarea
          placeholder="AI Story builder"
          value={story}
          onChange={handleStoryChange}
          className="w-full min-h-40 p-2 px-8 mb-4 bg-white text-black rounded-none border-4 border-black"
          aria-label="Story input"
        />

        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter characters' names separated by commas (up to 4)"
          className="p-2 w-full bg-white text-black rounded-none mb-4 border-4 border-black"
          aria-label="Character names input"
        />

        {characters.length > 0 && (
          <div className="mb-4 w-full text-left">
            <p className="font-bold">Characters ({characters.length}):</p>
            <div className="flex flex-wrap gap-2">
              {characters.map((character, index) => (
                <span key={index} className="bg-black text-white px-3 py-1 rounded-full text-sm">
                  {character}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-around gap-8">
          <CustomButton onClick={handleBack}>BACK</CustomButton>
          <CustomButton onClick={handleNext}>NEXT</CustomButton>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;