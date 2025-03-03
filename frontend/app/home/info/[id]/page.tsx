"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Movie } from "@/types/Movies";
import React from "react";
import ReactPlayer from "react-player"; // ✅ Correct import

export default function MovieInfoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  
  // ✅ Use `use()` to unwrap params
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
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 bg-black text-white">
      {/* ✅ Video Player */}
      <ReactPlayer
        url={movie.trailer_url} // ✅ Use actual video link
        controls
        width="100%"
        height="400px"
      />

      <h1 className="text-4xl font-bold text-secondary mb-4">{movie.name}</h1>

      <div className="flex flex-row justify-center items-center gap-4 w-full mt-4">
        {/* Left Column (Rating) */}
        <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-white">Rating: {movie.rating || "N/A"}</h2>
        </div>

        {/* Right Column (Other Info) */}
        <div className="w-1/2 bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-white">More Info...</h2>
        </div>
      </div>

      <p className="text-gray-300 text-center mt-4 max-w-2xl">{movie.description || "No description available."}</p>

      <button
        className="mt-6 px-4 py-2 bg-secondary text-white w-48 rounded-2xl shadow-md hover:bg-purple-700 transition"
        onClick={() => router.back()}
      >
        Go Back
      </button>
    </div>
  );
}
