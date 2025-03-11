import React, { useEffect, useRef } from "react";
import Image from "next/image"; 
import { GenreDropdownProps, MovieCardProps, SmallMovieCardProps } from "@/types/Movies"
import Link from "next/link";
import { Menu } from "lucide-react";
import { Check, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { useRouter } from "next/navigation";


export const MovieCard: React.FC<MovieCardProps> = ({ currentMovie, isLoading }) => {
  const router = useRouter();

  const handleCardClick = (e: any) => {
    e.stopPropagation(); // Stop event propagation
    if (currentMovie && currentMovie.id) {
      router.push(`/info/${currentMovie.id}`);
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gray-800 shadow-lg border-2 border-secondary">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-secondary"></div>
        </div>
      ) : currentMovie ? (
        <>
          <div 
            className="relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${currentMovie.image_url})` }}
          >
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 cursor-pointer"
              onClick={handleCardClick} // Add click handler here
            >
              <h2 className="text-white text-xl font-bold truncate">{currentMovie.name}</h2>
              <p className="text-white text-sm line-clamp-2 mt-1">{currentMovie.description}</p>
            </div>
            
            {/* Add this transparent overlay for clicks that will navigate to movie info */}
            <div 
              className="absolute top-0 left-0 right-0 h-3/4 cursor-pointer z-10"
              onClick={handleCardClick}
            ></div>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800">
          <p className="text-white text-center p-4">No movie available</p>
        </div>
      )}
    </div>
  );
};

// Update the GenreDropdown component styling

export const GenreDropdown: React.FC<GenreDropdownProps> = ({ 
  isGenreDropdownOpen, 
  setIsGenreDropdownOpen, 
  genres, 
  selectedGenres, 
  setSelectedGenres 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isGenreDropdownOpen) {
        setIsGenreDropdownOpen(false);
      }
    }

    // Add event listener when dropdown is open
    if (isGenreDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isGenreDropdownOpen, setIsGenreDropdownOpen]);

  return (
    <div className="relative w-full text-center" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button 
        onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
        className="bg-secondary hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition border-2 border-secondary"
      >
        Filter by Genres {isGenreDropdownOpen ? '▲' : '▼'}
      </button>
      
      {/* Dropdown content with added border */}
      {isGenreDropdownOpen && (
        <div className="absolute mt-2 left-0 right-0 p-3 bg-gray-900 rounded-lg shadow-lg z-30 max-h-60 overflow-y-auto border-2 border-secondary">
          <div className="flex flex-wrap gap-2 justify-center">
            {genres.map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setSelectedGenres(
                    selectedGenres.includes(genre.id)
                      ? selectedGenres.filter((id: number) => id !== genre.id)
                      : [...selectedGenres, genre.id]
                  );
                }}
                className={`px-3 py-1 text-sm rounded-full transition ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-secondary text-white border border-purple-400'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-600'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export const SmallMovieCard: React.FC<SmallMovieCardProps> = ({
  movie,
  showControls = true,
  showLikeDislike = false,
  removeOnAction = false,
  onLike,
  onDislike,
  onRemove,
  className = "",
  userRating = null,
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/info/${movie.id}`);
  };

  return (
    <div 
      key={movie.id} 
      className={`relative bg-white rounded-lg shadow-md overflow-hidden ${className || "w-32 h-48"}`}
    >
      <img 
        src={movie.image_url} 
        alt={movie.name} 
        className="w-full h-full object-cover cursor-pointer" 
        onClick={handleClick}
      />
      
      {/* Movie title - always visible */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs cursor-pointer"
        onClick={handleClick}
      >
        <span className="truncate block">{movie.name}</span>
      </div>
      
      {/* Control buttons - always visible */}
      {showControls && (
        <div 
          className={`absolute ${showLikeDislike ? 'top-2 right-2' : 'top-2 right-2'} flex ${showLikeDislike ? 'flex-col' : ''} gap-1`}
          onClick={(e) => e.stopPropagation()} 
        >
          {!showLikeDislike && (
            <button 
              className="bg-black bg-opacity-70 p-1.5 rounded-full hover:bg-opacity-90 transition"
              onClick={() => onRemove && onRemove(movie.id)}
              aria-label="Remove movie"
              title="Remove from favorites"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
          
          {showLikeDislike && (
            <>
              <button 
                className={`bg-black bg-opacity-70 p-1.5 rounded-full transition ${
                  userRating === 'like' ? 'bg-green-800 bg-opacity-90' : 'hover:bg-green-900'
                }`}
                onClick={() => onLike && onLike(movie.id)}
                aria-label="Like movie"
                title="Like"
              >
                <ThumbsUp className="w-5 h-5 text-white" />
              </button>
              <button 
                className={`bg-black bg-opacity-70 p-1.5 rounded-full transition mt-1 ${
                  userRating === 'dislike' ? 'bg-red-800 bg-opacity-90' : 'hover:bg-red-900'
                }`}
                onClick={() => onDislike && onDislike(movie.id)}
                aria-label="Dislike movie"
                title="Dislike"
              >
                <ThumbsDown className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};