"use client";

import { SmallMovieCard } from "@/components/Movies";
import { Movie } from "@/types/Movies";
import { useEffect, useState } from "react";
import useMovies from "@/hooks/Movies";
import SplashScreen from "@/components/SplashScreen";
import PageContainer from "@/components/PageContainer";

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchLikedMovies, rateMovie } = useMovies();

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await fetchLikedMovies();
        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching liked movies:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const handleDislikeMovie = async (movieId: number | string) => {
    try {
      await rateMovie(Number(movieId), false);
      setMovies(prevMovies => prevMovies.filter(movie => movie.id !== Number(movieId)));
    } catch (error) {
      console.error("Error disliking movie:", error);
    }
  };

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <PageContainer title=" MY MOVIES">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <SmallMovieCard 
              movie={movie}
              showControls={true}
              showLikeDislike={false} 
              removeOnAction={true} 
              onDislike={(movieId) => handleDislikeMovie(movieId)}
              className="w-full h-48 sm:h-56 md:h-64 max-w-[160px] md:max-w-[180px] lg:max-w-[200px]"
            />
          </div>
        ))}
      </div>
      
      {movies.length === 0 && (
        <div className="flex justify-center items-center mt-20">
          <p className="text-white text-xl">You haven't liked any movies yet</p>
        </div>
      )}
    </PageContainer>
  );
}
