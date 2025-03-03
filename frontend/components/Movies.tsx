"use client"

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import { GenreDropdownProps, MovieCardProps } from "@/types/Movies"
import Link from "next/link";
import { Menu } from "lucide-react";

export const MovieCard: React.FC<MovieCardProps> = ({ currentMovie, isLoading }) => {
  const router = useRouter();

  const handleNavigation = () => {
    if (currentMovie) {
      router.push(`/home/info/${currentMovie.id}`); // ✅ Navigate to movie details page
    }
  };

  return (
    <div className="w-64 h-96 cursor-pointer">
      {currentMovie && currentMovie.image_url && !isLoading ? (
        <>
          {/* image container */}
          <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg border-2 border-secondary"
            onClick={handleNavigation}>
            <Image
              src={currentMovie.image_url}
              alt="Movie Poster"
              fill
              className="object-cover"
              priority
              draggable={false}
            />
          </div>
          {/* Clickable Movie Title */}
          <div className="w-64 mt-4">
            <button
              className="bg-secondary text-white rounded-lg shadow-md hover:bg-purple-700 transition p-2 w-full"
              onClick={handleNavigation} // ✅ Navigate on click
            >
              <h2 className="truncate text-center">{currentMovie.name}</h2>
            </button>
          </div>
        </>
      ) : (
        <>
        <div className="relative w-full h-full overflow-hidden rounded-lg border-2 border-secondary flex items-center justify-center bg-gray-800">
          <span className="text-white text-lg font-medium">
          {isLoading ? "Loading..." : "No more movies"}
          </span>
        </div>
        <div className="w-64 mt-4">
            <div className="bg-secondary text-white rounded-lg shadow-md hover:bg-purple-700 transition p-2">
              <h2 className="truncate text-center">
                <span className="opacity-0">Placeholder</span>
              </h2>
            </div>
          </div>
        </>
        
      )}

      
    </div>
  );
};

export const GenreDropdown: React.FC<GenreDropdownProps> = ({
  genres,
  isGenreDropdownOpen,
  setIsGenreDropdownOpen,
  selectedGenres,
  setSelectedGenres,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsGenreDropdownOpen(false);
      }
    };

    if (isGenreDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGenreDropdownOpen, setIsGenreDropdownOpen]);

  return (
    <div className="relative mb-4" ref={dropdownRef}>
      <button
        onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
        className="px-4 py-2 bg-secondary rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
      >
        Filter by genres ({selectedGenres.length})
      </button>

      {isGenreDropdownOpen && (
        <div className="absolute mt-2 w-64 max-h-96 overflow-y-auto bg-gray-900 border border-secondary rounded-lg shadow-lg z-50">
          {genres.map((genre) => (
            <label
              key={genre.id}
              className="flex items-center px-4 py-2 hover:bg-gray-800 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedGenres([...selectedGenres, genre.id]);
                  } else {
                    setSelectedGenres(
                      selectedGenres.filter((id) => id !== genre.id)
                    );
                  }
                }}
                className="mr-2"
              />
              <span className="text-white">{genre.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};
