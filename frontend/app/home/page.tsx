"use client";

import React, { useState, useEffect, useMemo, createRef } from "react";
import TinderCard from "react-tinder-card";
import { ThumbsUp, ThumbsDown, Menu } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import useMovies from "@/hooks/Movies";
import { Movie, Genre } from "@/types/Movies";
import { GenreDropdown, MovieCard } from "@/components/Movies";

export default function HomePage() {
  // ... other state variables
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);

  // existing states
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [nextMovie, setNextMovie] = useState<Movie | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchGenres, fetchNextMovie, rateMovie } = useMovies();

  // refs for swipe cards
  const childRefs = useMemo(() => [createRef<any>(), createRef<any>()], []);

  // fetch movie
  const fetchMovie = async (excludeId?: number): Promise<Movie | null> => {
    const movie = await fetchNextMovie(selectedGenres, excludeId);
    return movie;
  };

  // initial load
  const fetchInitialMovies = async () => {
    setIsLoading(true);
    try {
      const movie1 = await fetchMovie();
      const movie2 = await fetchMovie(movie1?.id);
      setCurrentMovie(movie1);
      setNextMovie(movie2);
    } catch (error) {
      console.error("Error loading initial movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // update swipe and handle action
  const swiped = async (direction: string, movie: Movie, index: number) => {
    if (direction === "left" || direction === "right") {
      setSwipeDirection(direction as "left" | "right");
      setTimeout(() => setSwipeDirection(null), 300);
    }
    if (index === 1 && (direction === "right" || direction === "left")) {
      await handleAction(movie.id, direction === "right");
    }
  };

  // rate movie and promote next movie
  const handleAction = async (movieId: number, isLiked: boolean) => {
    try {
      await rateMovie(movieId, isLiked);
      if (nextMovie) {
        setCurrentMovie({ ...nextMovie, key: Date.now() });
      } else {
        setCurrentMovie(null);
      }
      const newMovie = await fetchMovie(nextMovie?.id);
      setNextMovie(newMovie);
    } catch (error) {
      console.error("Error handling action:", error);
    }
  };

  useEffect(() => {
    const fetchAndSetGenres = async () => {
      const data = await fetchGenres();
      if (data) setGenres(data);
    };
    fetchAndSetGenres();
  }, []);

  useEffect(() => {
    fetchInitialMovies();
  }, [selectedGenres]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleButtonClick = async (movieId: number, isLiked: boolean) => {
    setSwipeDirection(isLiked ? "right" : "left");
    await handleAction(movieId, isLiked);
    setSwipeDirection(null)
  };

  const cards = [nextMovie, currentMovie].filter(Boolean) as Movie[];

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

      <div className="relative inline-block">
        {/* Card Stack or Placeholder */}
        <div className="w-64 h-96">
          {cards.length > 0 ? (
            cards.map((movie, index, arr) => {
              const zIndex = index === arr.length - 1 ? "z-10" : "z-0";
              const cardKey = movie.id + "-" + (movie.key || "");
              return (
                <TinderCard
                  ref={childRefs[index]}
                  key={cardKey}
                  className={`absolute top-0 left-0 w-full h-full ${zIndex}`}
                  onSwipe={(dir) => swiped(dir, movie, index)}
                  preventSwipe={["up", "down"]}
                >
                  <MovieCard currentMovie={movie} isLoading={isLoading} />
                </TinderCard>
              );
            })
          ) : (
            <div className="w-64 h-96 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-secondary">
              <p className="text-white text-lg font-medium">
                {isLoading ? "Loading..." : "No more movies"}
              </p>
            </div>
          )}
        </div>

      {/* Dislike Button */}
        {currentMovie && (
          <button
            onClick={() => handleButtonClick(currentMovie.id, false)}
            className={`absolute top-1/2 transform -translate-y-1/2 left-[-90px] p-4 rounded-lg transition shadow-md ${
              swipeDirection === "left"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-secondary hover:bg-purple-700"
            }`}
            disabled={isLoading}
          >
            <ThumbsDown className="w-10 h-10 text-white" />
          </button>
        )}

        {/* Like Button */}
        {currentMovie && (
          <button
            onClick={() => handleButtonClick(currentMovie.id, true)}
            className={`absolute top-1/2 transform -translate-y-1/2 right-[-90px] p-4 rounded-lg transition shadow-md ${
              swipeDirection === "right"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-secondary hover:bg-purple-700"
            }`}
            disabled={isLoading}
          >
            <ThumbsUp className="w-10 h-10 text-white" />
          </button>
        )}
      </div>
    </div>
  );
}