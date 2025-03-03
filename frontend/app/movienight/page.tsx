"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";


export default function CreateMovieNight() {
  const router = useRouter();
  const [movieNightName, setMovieNightName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [movieCount, setMovieCount] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  // Mock data for frontend development
  const mockGenres = [
    { id: 1, name: "Action" },
    { id: 2, name: "Comedy" },
    { id: 3, name: "Drama" },
    { id: 4, name: "Horror" },
    { id: 5, name: "Sci-Fi" }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Just log the form data for now
    console.log({
      movieNightName,
      selectedFriends,
      movieCount,
      selectedGenres
    });
    
    // Navigate to home page after submission
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={() => router.push("/home")}
          className="text-4xl font-bold text-secondary"
        >
          FILMDER
        </button>
      </div>

      <div className="w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          Create Movie Night
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          {/* Movie Night Name */}
          <div>
            <label className="block text-white mb-2">Name movie night:</label>
            <input
              type="text"
              value={movieNightName}
              onChange={(e) => setMovieNightName(e.target.value)}
              className="w-full p-3 bg-gray-800 border-2 border-secondary rounded-2xl text-white focus:outline-none"
              placeholder="Enter a name..."
            />
          </div>

          {/* Genre Selection */}
          <div>
            <label className="block text-white mb-2">Select genres:</label>
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
                className="w-full p-3 bg-gray-800 border-2 border-secondary rounded-2xl text-white focus:outline-none flex justify-between items-center"
              >
                {selectedGenres.length > 0 
                  ? `${selectedGenres.length} genres selected`
                  : "Choose genres"}
              </button>
              
              {isGenreDropdownOpen && (
                <div className="absolute z-10 w-full mt-2 bg-gray-800 border-2 border-secondary rounded-2xl">
                  {mockGenres.map((genre) => (
                    <button
                      key={genre.id}
                      type="button"
                      onClick={() => {
                        const isSelected = selectedGenres.includes(genre.name);
                        if (isSelected) {
                          setSelectedGenres(selectedGenres.filter(g => g !== genre.name));
                        } else {
                          setSelectedGenres([...selectedGenres, genre.name]);
                        }
                      }}
                      className={`w-full p-3 text-left hover:bg-gray-700 ${
                        selectedGenres.includes(genre.name) ? 'text-purple-500' : 'text-white'
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Friends Selection */}
          <div>
            <label className="block text-white mb-2">Add friends:</label>
            <select
              className="w-full p-3 bg-gray-800 border-2 border-secondary rounded-2xl text-white focus:outline-none"
              onChange={(e) => setSelectedFriends([...selectedFriends, e.target.value])}
            >
              <option value="">Select friends</option>
              <option value="friend1">Friend 1</option>
              <option value="friend2">Friend 2</option>
              <option value="friend3">Friend 3</option>
            </select>
          </div>

          {/* Movie Count */}
          <div>
            <label className="block text-white mb-2">How many movie options do you want?:</label>
            <input
              type="number"
              min="1"
              value={movieCount}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setMovieCount(value);
              }}
              className="w-full p-3 bg-gray-800 border-2 border-secondary rounded-2xl text-white focus:outline-none"
              placeholder="Enter number of movies..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-secondary hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-2xl transition"
          >
            Create Movie Night
          </button>
        </form>
      </div>
    </div>
  );
}
