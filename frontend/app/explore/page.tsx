"use client";

import { SmallMovieCard } from "@/components/Movies";
import { Movie } from "@/types/Movies";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SplashScreen from "@/components/SplashScreen";
import useMovies from "@/hooks/Movies";
import PageContainer from "@/components/PageContainer";

export default function ExplorePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { fetchMovieBatch, fetchGenres, rateMovie, getUserMovieRating } = useMovies();
  const [genres, setGenres] = useState<{id: number, name: string}[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [movieRatings, setMovieRatings] = useState<{[key: number]: string}>({});

  // Fetch genres
  useEffect(() => {
    const getGenres = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres || []);
    };
    getGenres();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  
  // Fetch movies by search or genres 
  useEffect(() => {
    const searchMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await fetchMovieBatch({
          searchTerm: debouncedSearchTerm,
          genres: selectedGenres,
          limit: 20,
          useFavoriteGenres: false,
          includeRated: true
        });
        setMovies(fetchedMovies);
        
        // Get ratings for fetched movies
        const ratings: {[key: number]: string} = {};
        for (const movie of fetchedMovies) {
          const rating = await getUserMovieRating(movie.id);
          if (rating) {
            ratings[movie.id] = rating;
          }
        }
        setMovieRatings(ratings);
      } catch (error) {
        console.error("Error searching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    searchMovies();
  }, [debouncedSearchTerm, selectedGenres]);
  
  // Toggle genre
  const handleGenreToggle = (genreId: number) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId) 
        : [...prev, genreId]
    );
  };

  const handleRateMovie = async (movieId: number | string, rating: 'like' | 'dislike') => {
    try {
      await rateMovie(Number(movieId), rating === 'like');
      
      setMovieRatings(prev => ({
        ...prev,
        [Number(movieId)]: rating
      }));
    } catch (error) {
      console.error(`Error ${rating === 'like' ? 'liking' : 'disliking'} movie:`, error);
    }
  };

  if (loading && movies.length === 0) {
    return <SplashScreen />;
  }

  return (
    <PageContainer title="EXPLORE">
      <div className="mb-6">
        <div className="relative mb-6">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search movies..."
            className="w-full p-3 pl-10 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
          <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
        </div>
        
        {/* Genre filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {genres.map(genre => (
            <button
              key={genre.id}
              onClick={() => handleGenreToggle(genre.id)}
              className={`px-3 py-1 text-sm rounded-full ${
                selectedGenres.includes(genre.id)
                  ? 'bg-secondary text-white'
                  : 'bg-gray-800 text-gray-300'
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Movies Subtitle */}
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
        {debouncedSearchTerm ? `Results for "${debouncedSearchTerm}"` : "Discover movies"}
      </h2>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
        {movies.map((movie) => (
          <div key={movie.id} className="flex justify-center">
            <SmallMovieCard 
              movie={movie}
              showControls={true}
              showLikeDislike={true}
              removeOnAction={false}
              onLike={(movieId) => handleRateMovie(movieId, 'like')}
              onDislike={(movieId) => handleRateMovie(movieId, 'dislike')}
              userRating={movieRatings[movie.id] || null}
              className="w-full h-48 sm:h-56 md:h-64 max-w-[160px] md:max-w-[180px] lg:max-w-[200px]"
            />
          </div>
        ))}
      </div>
      
      {/* No Movies Message */}
      {movies.length === 0 && !loading && (
        <div className="flex justify-center items-center mt-20">
          <p className="text-white text-xl">
            {debouncedSearchTerm 
              ? `No movies found matching "${debouncedSearchTerm}"` 
              : "No movies found"
            }
          </p>
        </div>
      )}
    </PageContainer>
  );
}