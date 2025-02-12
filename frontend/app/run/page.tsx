"use client";

import Link from 'next/link'
import React, { useState } from 'react';
import Image from 'next/image';
import { ThumbsUp, ThumbsDown, Menu } from 'lucide-react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

{/* Hamburger Menu */}
<div className="absolute top-4 right-4">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg transition"
        >
          <Menu className="w-12 h-12 text-white" />
        </button>
        
        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              
              <Link
                href="/filmer"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                Filmer
              </Link>
                  
              <Link 
                href="/friends" 
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Friends
              </Link>
              
              <button 
                onClick={() => {/* Add signout logic */}} 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            
            </div>
          </div>
        )}
      </div>

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
