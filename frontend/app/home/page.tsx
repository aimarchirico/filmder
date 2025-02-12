"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Menu } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useMovies from "@/hooks/Movies"
import { Movie, Genre } from "@/types/Movies";
import { GenreDropdown, MovieCard } from "@/components/Movies"



export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchGenres, fetchNextMovie, rateMovie } = useMovies();

  const fetchAndSetMovie = async () => {
    setIsLoading(true);
    setCurrentMovie(null);
    try {
      const supabase = createClient();
      const movie = await fetchNextMovie(selectedGenres);
      if (movie) {
        setCurrentMovie({
          id: movie.id,
          name: movie.name,
          image_url: movie.image_url,
        });
      } else {
        setCurrentMovie(null);
      }
    } catch (error) {
      console.error("Error loading movie:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // fetch genres
  useEffect(() => {
    const fetchAndSetGenres = async () => {
      const data = await fetchGenres();
      if (data) setGenres(data);
    }
    fetchAndSetGenres();
  }, []);
  
  // load movie on genre change
  useEffect(() => {
    const loadMovie = async () => {
      await fetchAndSetMovie();
    }
    loadMovie()
  }, [selectedGenres]);

  // handle like/dislike
  const handleAction = async (movieId: number, isLiked: boolean) => {

    try {
      setIsLoading(true);

      await rateMovie(movieId, isLiked)

      // Fetch next movie
      await fetchAndSetMovie()
    } catch (error) {
      console.error("Error in handleAction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const onSwipe = async (direction: string) => {
    if (!currentMovie) return;

    setIsLoading(true);
    try {
      if (direction === "right") {
        await handleAction(currentMovie.id, true); // Like
      } else if (direction === "left") {
        await handleAction(currentMovie.id, false); // Dislike
      }
    } catch (error) {
      console.error("Error handling swipe:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onCardLeftScreen = async (direction: string) => {
    await onSwipe(direction);
    setCurrentMovie((prev) => (prev ? { ...prev, key: Date.now() } : null));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 bg-black text-white">
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
                href="/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>

              <Link
                href="/settings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Settings
              </Link>

              <Link
                href="/friends"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Friends
              </Link>

              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-secondary mb-4">FILMDER</h1>

      {/* Genre Filter */}
      <GenreDropdown
        isGenreDropdownOpen={isGenreDropdownOpen}
        setIsGenreDropdownOpen={setIsGenreDropdownOpen}
        genres={genres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />

      {/* Movie Box */}
      <div className="relative flex items-center justify-center">
        {/* Dislike Button */}
        <button
          onClick={() => currentMovie && handleAction(currentMovie.id, false)}
          className="absolute left-[-100px] bg-secondary p-4 rounded-lg hover:bg-purple-700 transition"
          disabled={isLoading}
        >
          <ThumbsDown className="w-10 h-10 text-white" />
        </button>

        {/* Like Button */}
        <button
          onClick={() => currentMovie && handleAction(currentMovie.id, true)}
          className="absolute right-[-100px] bg-secondary p-4 rounded-lg hover:bg-purple-700 transition"
          disabled={isLoading}
        >
          <ThumbsUp className="w-10 h-10 text-white" />
        </button>

        {/* Movie */}
        <MovieCard 
          currentMovie={currentMovie}
          onSwipe={onSwipe}
          onCardLeftScreen={onCardLeftScreen}
          isLoading={isLoading}
        />

        
      </div>
    </div>
  );
}
