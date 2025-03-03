"use client";

import { useRouter, useParams } from "next/navigation"; // ✅ Use useParams()
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Movie } from "@/types/Movies";
import Image from "next/image";

export default function MovieInfoPage() {
  const router = useRouter();
  const params = useParams(); // ✅ Get the dynamic ID correctly
  const supabase = createClient();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      if (!params.id) return; // ✅ Prevent errors if params.id is undefined

      const { data, error } = await supabase
        .from("movies") // ✅ Ensure your table name is correct
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching movie:", error);
        router.push("/"); // ✅ Redirect home if movie is not found
      } else {
        setMovie(data);
      }
      setLoading(false);
    }

    fetchMovie();
  }, [params.id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!movie) {
    return <div className="min-h-screen flex items-center justify-center text-white">Movie not found.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pt-16 bg-black text-white">
      <h1 className="text-4xl font-bold text-secondary mb-4">{movie.name}</h1>

      <div className="relative w-64 h-96">
        <Image
          src={movie.image_url}
          alt={movie.name}
          width={300}
          height={450}
          className="rounded-lg shadow-lg"
        />
      </div>

      <p className="text-gray-300 text-center mt-4 max-w-2xl">{movie.description || "No description available."}</p>

      <button
        className="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition"
        onClick={() => router.back()} // ✅ Back button
      >
        Go Back
      </button>
    </div>
  );
}
