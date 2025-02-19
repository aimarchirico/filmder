"use client";

import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useMovies from "@/hooks/Movies";
import { Movie, Genre, movieBatchSize } from "@/types/Movies";
import { GenreDropdown, MenuDropdown, MovieCard } from "@/components/Movies";

export default function HomePage() {
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Movie[]>([]);
  const { fetchGenres, fetchMovieBatch, rateMovie } = useMovies();
  const [hasMoreMovies, setHasMoreMovies] = useState(true);

  useEffect(() => {
    const fetchAndSetGenres = async () => {
      const data = await fetchGenres();
      if (data) setGenres(data);
    };
    fetchAndSetGenres();
  }, []);

  const fetchMoreMovies = async (reset: boolean) => {
    setIsLoading(true);
    try {
      if (reset) {
        const newMovies = await fetchMovieBatch(selectedGenres);
        setCards(newMovies);
        setHasMoreMovies(newMovies.length === movieBatchSize);
      } else {
        const excludeIds = cards.map((card) => card.id);
        const newMovies = await fetchMovieBatch(selectedGenres, excludeIds);
        setCards((prevCards) => [...prevCards, ...newMovies]);
        setHasMoreMovies(newMovies.length > 0);
      }
    } catch (error) {
      console.error("Error loading movies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoreMovies(true);
  }, [selectedGenres]);

  useEffect(() => {
    if (cards.length === 0 && !isLoading && hasMoreMovies) {
      fetchMoreMovies(false);
    }
  }, [cards.length, isLoading]);

  const swiped = async (direction: string, movieId: number) => {
    if (direction === "left" || direction === "right") {
      setSwipeDirection(direction as "left" | "right");
      setTimeout(() => setSwipeDirection(null), 300);

      await rateMovie(movieId, direction === "right");

      setCards((prevCards) => prevCards.filter((card) => card.id !== movieId));
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleButtonClick = async (isLiked: boolean) => {
    swiped(isLiked ? "right" : "left", cards[0].id);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 bg-black text-white">
      <h1 className="text-4xl font-bold text-secondary mb-4">{"FILMDER"}</h1>

      <GenreDropdown
        isGenreDropdownOpen={isGenreDropdownOpen}
        setIsGenreDropdownOpen={setIsGenreDropdownOpen}
        genres={genres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />

      <div className="relative inline-block">
        <button
          onClick={() => handleButtonClick(false)}
          className={`absolute sm:absolute bottom-[-9rem] sm:bottom-auto left-[3rem] sm:left-[-90px] sm:translate-x-0
    sm:top-1/2 sm:-translate-y-1/2 p-4 rounded-lg transition shadow-md ${
      swipeDirection === "left"
        ? "bg-red-600 hover:bg-red-700"
        : "bg-secondary hover:bg-purple-700"
    }`}
          disabled={isLoading}
        >
          <ThumbsDown className="w-10 h-10 text-white" />
        </button>

        <button
          onClick={() => handleButtonClick(true)}
          className={`absolute sm:absolute bottom-[-9rem] sm:bottom-auto right-[3rem] sm:right-[-90px] sm:translate-x-0
    sm:top-1/2 sm:-translate-y-1/2 p-4 rounded-lg transition shadow-md ${
      swipeDirection === "right"
        ? "bg-green-600 hover:bg-green-700"
        : "bg-secondary hover:bg-purple-700"
    }`}
          disabled={isLoading}
        >
          <ThumbsUp className="w-10 h-10 text-white" />
        </button>

        <div className="w-64 h-96 relative">
          <div className="absolute top-0 left-0 w-full h-full">
            <MovieCard isLoading={isLoading} />
          </div>
          {cards.length > 0 && !isLoading ? (
            [...cards].reverse().map((movie) => (
              <TinderCard
                key={movie.key}
                className={`absolute top-0 left-0 w-full h-full`}
                onSwipe={(dir) => swiped(dir, movie.id)}
                preventSwipe={["up", "down"]}
              >
                <MovieCard currentMovie={movie} isLoading={isLoading} />
              </TinderCard>
            ))
          ) : null }
        </div>
      </div>

      <MenuDropdown
        onSignOut={handleSignOut}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
    </div>
  );
}
