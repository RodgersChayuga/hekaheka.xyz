'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useZustandStore } from '@/lib/store';
import { toast } from 'sonner';
import CustomButton from '@/components/CustomButton';

export default function StoryInputPage() {
  const { wallet, setStory, setCharacters } = useZustandStore();
  const [story, setLocalStory] = useState('');
  const [characters, setLocalCharacters] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  if (!wallet) {
    toast.error('Please connect your wallet first');
    router.push('/');
    return null;
  }

  const handleAddCharacter = () => {
    if (characters.length < 4) {
      setLocalCharacters([...characters, '']);
    } else {
      toast.error('Maximum 4 characters allowed');
    }
  };

  const handleCharacterChange = (index: number, value: string) => {
    const newCharacters = [...characters];
    newCharacters[index] = value;
    setLocalCharacters(newCharacters);
  };

  const handleSubmit = () => {
    if (!story.trim()) {
      toast.error('Story is required');
      return;
    }
    if (characters.some(c => !c.trim())) {
      toast.error('All character names must be filled');
      return;
    }
    setIsLoading(true);
    setStory(story);
    setCharacters(characters);
    setTimeout(() => {
      setIsLoading(false);
      router.push('/image-upload');
    }, 500);
  };

  return (
    <div className="flex flex-col gap-4 p-8 max-w-xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Tell Your Story</h1>
      <div className="relative">
        <textarea
          value={story}
          onChange={(e) => setLocalStory(e.target.value)}
          placeholder="Write your story or memory (max 1000 characters)"
          maxLength={1000}
          className="w-full p-2 border rounded mb-4"
          rows={6}
        />
        <span className="absolute top-0 right-0 text-sm text-gray-500">
          {story.length}/1000
        </span>
      </div>
      <h2 className="text-2xl font-semibold mb-2">Characters (up to 4)</h2>
      {characters.map((character, index) => (
        <div key={index} className="relative">
          <input
            value={character}
            onChange={(e) => handleCharacterChange(index, e.target.value)}
            placeholder={`Character ${index + 1} name`}
            className="w-full p-2 border rounded mb-2"
          />
          <small className="text-gray-500">
            Enter the name of a character in your story.
          </small>
        </div>
      ))}
      <CustomButton onClick={handleAddCharacter} disabled={characters.length >= 4} className="mb-4">
        Add Character
      </CustomButton>
      <CustomButton onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Next: Upload Images'}
      </CustomButton>
    </div>
  );
}