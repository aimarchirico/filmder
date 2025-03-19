"use client";

import React, { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useMovies from "@/hooks/Movies";
import { Movie, Genre, movieBatchSize } from "@/types/Movies";
import { GenreDropdown, MovieCard } from "@/components/Movies";
import SplashScreen from "@/components/SplashScreen";
import useUser from "@/hooks/User";
import { redirect } from "next/navigation";
import PageContainer from "@/components/PageContainer";

export default function HomePage() {
  
  const supabase = createClient();
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<Movie[]>([]);
  const { fetchGenres, fetchMovieBatchLegacy: fetchMovieBatch, rateMovie } = useMovies();
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
const { getUser } = useUser(supabase)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [justSwiped, setJustSwiped] = useState(false);
 
  useEffect(() => {
    async function checkAuth() {
      const user = await getUser();
      
      if (!user) {
        redirect('/login')
      }
      setIsCheckingAuth(false);
    }
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchAndSetGenres = async () => {
      const data = await fetchGenres();
      if (data) setGenres(data);
    };
    fetchAndSetGenres();
  }, []);

  
  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!cards.length || isLoading) return;
      
      if (event.key === "ArrowLeft") {
        handleButtonClick(false); 
      } else if (event.key === "ArrowRight") {
        handleButtonClick(true); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cards, isLoading]); 


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
    setJustSwiped(true);
    
    // Reset the flag after a delay
    setTimeout(() => setJustSwiped(false), 300);
    
    if (direction === "left" || direction === "right") {
      setSwipeDirection(direction as "left" | "right");
      setTimeout(() => setSwipeDirection(null), 300);
  
      await rateMovie(movieId, direction === "right");
      setCards((prevCards) => prevCards.filter((card) => card.id !== movieId));
    } else if (direction === "up" || direction === "down") {
      // Navigate to movie info page on up/down swipe
      const movie = cards.find(card => card.id === movieId);
      if (movie) {
        window.location.href = `/info/${movieId}`;
      }
    }
  };

  const handleButtonClick = async (isLiked: boolean) => {
    swiped(isLiked ? "right" : "left", cards[0].id);
  };

  return (
    isCheckingAuth ? <SplashScreen/> :  
    <PageContainer title="FILMDER">
      <div className="flex flex-col items-center justify-center w-full">
        {/* Genre dropdown */}
        <div className="w-full max-w-md mb-6">
          <GenreDropdown
            isGenreDropdownOpen={isGenreDropdownOpen}
            setIsGenreDropdownOpen={setIsGenreDropdownOpen}
            genres={genres}
            selectedGenres={selectedGenres}
            setSelectedGenres={setSelectedGenres}
          />
        </div>

        {/* Movie card container */}
        <div className="w-80 h-[480px] md:w-64 md:h-96 relative">
          
            {/* Dislike button */}
            <button
              onClick={() => handleButtonClick(false)}
              className={`absolute z-0 
                md:left-[-60px] md:top-1/2 md:transform md:-translate-y-1/2 md:w-16 md:h-16
                left-[33%] bottom-[-85px] transform -translate-x-1/2 w-16 h-16
                p-4 rounded-lg transition shadow-lg flex items-center justify-center ${
                  swipeDirection === "left"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-secondary hover:bg-purple-700"
                }`}
              disabled={isLoading}
            >
              <ThumbsDown className="w-8 h-8 text-white" />
            </button>

            {/* Like button */}
            <button
              onClick={() => handleButtonClick(true)}
              className={`absolute z-0
                md:right-[-60px] md:top-1/2 md:transform md:-translate-y-1/2 md:w-16 md:h-16
                right-[33%] bottom-[-85px] transform translate-x-1/2 w-16 h-16
                p-4 rounded-lg transition shadow-lg flex items-center justify-center ${
                  swipeDirection === "right"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-secondary hover:bg-purple-700"
                }`}
              disabled={isLoading}
            >
              <ThumbsUp className="w-8 h-8 text-white" />
            </button>
            
            <div className="absolute top-0 left-0 w-full h-full">
              <MovieCard isLoading={isLoading} />
            </div>
            {cards.length > 0 && !isLoading ? (
              [...cards].reverse().map((movie) => (
                <TinderCard
                  key={movie.key}
                  className={`absolute top-0 left-0 w-full h-full`}
                  onSwipe={(dir) => swiped(dir, movie.id)}
                >
                  <MovieCard currentMovie={movie} isLoading={isLoading} preventClick={justSwiped} />
                </TinderCard>
              ))
            ) : null }
        </div>
        
      
        <div className="relative w-full max-w-md mx-auto flex justify-center items-center mb-20">
        </div>
      </div>
    </PageContainer>
  );
}
