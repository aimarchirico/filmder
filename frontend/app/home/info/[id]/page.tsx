"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Movie } from "@/types/Movies";
import React from "react";
import ReactPlayer from "react-player";
import MenuDropdown from "@/components/Menu";

export default function MovieInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  
  // Unwrap the params
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
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-white">Movie not found.</div>;
  }

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-start pt-10 bg-black text-white px-6">
      <MenuDropdown
      />
      {/* Video Player */}
      <div className="w-full max-w-2xl mb-6">
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
      <h1 className="text-4xl font-bold text-white text-center mb-2">{movie.name}</h1>
      <p className="text-gray-400 text-lg text-center mb-4">
        <span className="mr-4">Utgivelsesår: {movie.year || "N/A"}</span>
        <span>Rating: {movie.rating ? movie.rating.toFixed(1) : "N/A"}/10</span>
      </p>

      {/* Movie Description */}
      <p className="text-gray-300 text-center max-w-2xl leading-relaxed mb-6">
        {movie.description || "No description available."}
      </p>

      {/* Back Button */}
      <button
        className="px-6 py-3 bg-purple-600 text-white rounded-2xl w-48 shadow-lg hover:bg-purple-700 transition"
        onClick={() => router.back()}
      >
        Back
      </button>
    </div>
  );
}