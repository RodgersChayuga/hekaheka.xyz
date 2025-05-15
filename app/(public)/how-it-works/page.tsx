

"use client"
import CustomButton from "@/components/CustomButton"
import React, { useState } from 'react'
import Image from "next/image"
import { useRouter } from "next/navigation"

type Props = {}

function HowItWorks({ }: Props) {
  const router = useRouter()
  const [story, setStory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [characters, setCharacters] = useState<string[]>([]);

  const handleBack = () => {
    router.push("/")
  }

  const handleNext = () => {
    if (characters.length === 0) {
      alert("Please enter at least one character name");
      return;
    }
    // Store characters in localStorage to access on the next page
    localStorage.setItem("aiStory", story);
    localStorage.setItem("characters", JSON.stringify(characters));
    router.push("/image-upload")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);

    // Convert the input string into an array
    const array = raw
      .split(',')
      .map((item: string) => item.trim())
      .filter((item: string) => item.length > 0);

    setCharacters(array);
  };

  const handleStoryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStory(e.target.value);
  };

  return (
    <div className="flex gap-8 relative w-full">
      {/* Description Section */}
      <div className="relative flex-1 h-full">
        <div className="w-full">
          <Image
            src="/images/comic-page-2.png"
            alt="Comic panel"
            width={400}
            height={300}
            className="object-cover w-full" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center flex flex-col items-center justify-center flex-1 relative">
        <div className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide text-black mb-8">
          <span className="relative inline-block">
            <span className="absolute inset-0 transform -skew-y-6 z-0" />
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
        />

        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter characters' names separated by commas"
          className="p-2 w-full bg-white text-black rounded-none mb-4 border-4 border-black"
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
          <div>
            <CustomButton onClick={handleBack}>BACK</CustomButton>
          </div>
          <div>
            <CustomButton onClick={handleNext}>NEXT</CustomButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HowItWorks