import React from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export default function HomePage() {
  return (
    <div 
    
        className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-[var(--secondary-color)] mb-8">FILMDER</h1>

      {/* Movie Box */}
      <div className="relative flex items-center justify-center">
        
        {/* Dislike */}
        <button className="absolute left-[-100px] bg-[var(--secondary-color)] p-4 rounded-lg hover:bg-purple-700 transition">
          <ThumbsDown className="w-10 h-10 text-white" />
        </button>

        {/* Movie */}
        <div className="w-64 h-96">
          <Image
            src="/images/mufasa.jpeg" 
            alt="Movie Poster"
            width={256}
            height={384}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Like */}
        <button className="absolute right-[-100px] bg-[var(--secondary-color)] p-4 rounded-lg hover:bg-purple-700 transition">
          <ThumbsUp className="w-10 h-10 text-white" />
        </button>
      
      </div>

      {/* Home */}
      <button className="mt-10 px-6 py-3 bg-[var(--secondary-color)] text-white rounded-full shadow-md border-2 border-blue-400 hover:bg-purple-700 transition">
        Home
      </button>
    
    </div>
  );
}
