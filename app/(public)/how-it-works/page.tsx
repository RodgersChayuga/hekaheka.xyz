'use client';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import Image from 'next/image';

export default function HowItWorks() {
  const router = useRouter();

  const steps = [
    { title: 'Tell Your Story', description: 'Write a short story or memory and list up to 4 characters.' },
    { title: 'Upload Images', description: 'Upload photos for each character to bring your story to life.' },
    { title: 'Generate Comic', description: 'Our AI creates a comic book based on your story and images.' },
    { title: 'Edit & Mint', description: 'Review and edit your comic, then mint it as an NFT on Base.' },
    { title: 'Trade on Marketplace', description: 'List your comic for sale or buy others in our marketplace.' },
  ];

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8">How HekaHeka Works</h1>
      <div className="max-w-4xl w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-500 text-white rounded-full flex items-center justify-center mr-4">
              {index + 1}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{step.title}</h2>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* <Image
        src="/images/comic_cloud.png"
        alt="Sample comic"
        width={400}
        height={300}
        className="my-8"
      /> */}
      <div className="mt-24">

      <CustomButton onClick={() => router.push('/story-input')} className="bg-green-700 text-white hover:text-black">
        Get Started
      </CustomButton>
      </div>
    </div>
  );
}