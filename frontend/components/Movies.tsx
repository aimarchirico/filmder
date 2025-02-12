import TinderCard from "react-tinder-card";
import React from "react";
import Image from "next/image"; 
import { GenreDropdownProps, MovieCardProps } from "@/types/Movies"


export const MovieCard: React.FC<MovieCardProps> = ({ currentMovie, onSwipe, onCardLeftScreen, isLoading }) => {
  return (
    <div className="w-64 h-96">
      {currentMovie && currentMovie.image_url ? (
        <TinderCard
          key={currentMovie.id}
          onSwipe={onSwipe}
          onCardLeftScreen={onCardLeftScreen}
          preventSwipe={["up", "down"]}
        >
          <div className="flex flex-col items-center">
            <Image
              src={currentMovie.image_url}
              alt="Movie Poster"
              width={250}
              height={375}
              className="rounded-lg shadow-lg border-2 border-secondary"
              priority
              draggable={false}
            />
            <div className="w-[300px] mt-4">
              <div className="bg-secondary text-white rounded-lg shadow-md hover:bg-purple-700 transition">
                <h2 className="px-4 py-2 truncate text-center">
                  {currentMovie.name}
                </h2>
              </div>
            </div>
          </div>
        </TinderCard>
      ) : (
        <div className="w-[250px] h-[375px] bg-gray-800 rounded-lg flex items-center justify-center border-2 border-secondary">
          <span className="text-white text-lg font-medium">
            {isLoading ? "Loading..." : "No more movies"}
          </span>
        </div>
      )}
    </div>
  );

};


export const GenreDropdown: React.FC<GenreDropdownProps> = ({ genres, isGenreDropdownOpen, setIsGenreDropdownOpen, selectedGenres, setSelectedGenres }) => {
  return (
    <div className="relative mb-4">
        <button
          onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
          className="px-4 py-2 bg-secondary rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
        >
          Filter by Genres ({selectedGenres.length})
        </button>

        {isGenreDropdownOpen && (
          <div className="absolute mt-2 w-64 max-h-96 overflow-y-auto bg-white rounded-lg shadow-lg z-50">
            {genres.map((genre) => (
              <label
                key={genre.id}
                className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
                <span className="text-gray-700">{genre.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
  );

};
