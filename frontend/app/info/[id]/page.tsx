"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Movie } from "@/types/Movies";
import React from "react";
import ReactPlayer from "react-player";
import PageContainer from "@/components/PageContainer";
import SplashScreen from "@/components/SplashScreen";

export default function MovieInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  
  const { id } = use(params);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

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
    }

    fetchMovie();
  }, [id]);

  if (loading) {
    return <SplashScreen/>
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-white">Movie not found.</div>;
  }

  return (
    
    <PageContainer title="INFO" showBackButton={true}>
    <div className="flex flex-col items-center w-full mx-auto">
      {/* Video Player */}
      <div className="w-full max-w-2xl mx-auto mb-6 border-2 border-secondary rounded-lg overflow-hidden">
        <ReactPlayer
          url={movie.trailer_url}
          controls
          width="100%"
          height="360px"
          playing={true}
          loop={true}
        />
      </div>

      {/* Movie Title */}
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-2">{movie.name}</h1>
        <p className="text-gray-400 text-lg text-center mb-4">
          <span className="mr-4">Release year: {movie.year || "N/A"}</span>
          <span>Rating: {movie.rating ? movie.rating.toFixed(1) : "N/A"}/10</span>
        </p>

        {/* Movie Description */}
        <p className="text-gray-300 text-center leading-relaxed mb-6">
          {movie.description || "No description available."}
        </p>
      </div>
    </div>
  </PageContainer>
  );
}