"use client";

import Link from 'next/link';
import React, { useState } from 'react';

export default function FriendsPage() {
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">

      {/* Title */}
      <h1 className="text-4xl font-bold text-[var(--secondary-color)] mb-8">FILMDER</h1>
      <p className="text-lg mb-6">Want to link up with friends?</p>

      {/* Username Input */}
      <div className="flex flex-col items-center">
        <label className="mb-2">Username:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          className="w-64 p-2 rounded-lg text-black border border-gray-400 focus:outline-none"
        />
        <button className="mt-4 px-6 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-purple-700 transition">
          Find friend
        </button>
      </div>

      {/* Home Button */}
      <Link href="/home">
        <button className="mt-10 px-6 py-3 bg-[var(--secondary-color)] text-white rounded-full shadow-md border-2 border-blue-400 hover:bg-purple-700 transition">
          Home
        </button>
      </Link>
    </div>
  );
}