"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Movie } from "@/types/Movies";
import React from "react";
import ReactPlayer from "react-player";
import PageContainer from "@/components/PageContainer";
import SplashScreen from "@/components/SplashScreen";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import useMovies from "@/hooks/Movies";

export default function MovieInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const { rateMovie, getUserMovieRating } = useMovies();
  
  const { id } = use(params);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMovie() {
      if (!id) return;

      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Error fetching movie:", error);
        router.push("/home");
        return;
      }

      setMovie(data);
      setLoading(false);
      
      const rating = await getUserMovieRating(data.id);
      setUserRating(rating);
    }

    fetchMovie();
  }, [id]);

  const handleRateMovie = async (isLiked: boolean) => {
    if (!movie) return;
    
    try {
      await rateMovie(movie.id, isLiked);
      setUserRating(isLiked ? 'like' : 'dislike');
      
    } catch (error) {
      console.error('Error rating movie:', error);
    }
  };

  if (loading) {
    return <SplashScreen/>
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-white">Movie not found.</div>;
  }

  return (
    <PageContainer title="INFO" showBackButton={true}>
      <div className="flex flex-col items-center w-full mx-auto">
        {/* Video Player or Poster Image */}
        <div className="w-full max-w-2xl mx-auto mb-6 border-2 border-secondary rounded-lg overflow-hidden bg-gray-800">
          {movie.trailer_url ? (
            <div className="w-full aspect-video bg-gray-800">
              <ReactPlayer
                url={movie.trailer_url}
                controls
                width="100%"
                height="100%"
                playing={true}
                loop={true}
                style={{ backgroundColor: "#1f2937" }}
              />
            </div>
          ) : (
            <div className="relative w-full bg-gray-800" style={{ height: "360px" }}>
              <img
                src={movie.image_url}
                alt={`${movie.name} poster`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 py-2 px-3 text-center">
                <p className="text-white text-sm">No trailer available</p>
              </div>
            </div>
          )}
        </div>

        {/* Movie Title */}
        <div className="w-full max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-white text-center mb-2">{movie.name}</h1>
          <p className="text-gray-400 text-lg text-center mb-4">
            <span className="mr-4">Released: {movie.year || "N/A"}</span>
            <span>Rating: {movie.rating ? movie.rating.toFixed(1) : "N/A"}/10</span>
          </p>

          {/* Movie Description */}
          <p className="text-gray-300 text-center leading-relaxed mb-6">
            {movie.description || "No description available."}
          </p>
          
          {/* Like/Dislike Buttons */}
          <div className="flex justify-center items-center space-x-10 mt-4 mb-8">
            {/* Dislike Button */}
            <button
              onClick={() => handleRateMovie(false)}
              className={`w-16 h-16 p-4 rounded-lg transition shadow-lg flex items-center justify-center ${
                userRating === "dislike"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-secondary hover:bg-purple-700"
              }`}
            >
              <ThumbsDown className="w-8 h-8 text-white" />
            </button>
            
            {/* Like Button */}
            <button
              onClick={() => handleRateMovie(true)}
              className={`w-16 h-16 p-4 rounded-lg transition shadow-lg flex items-center justify-center ${
                userRating === "like"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-secondary hover:bg-purple-700"
              }`}
            >
              <ThumbsUp className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}