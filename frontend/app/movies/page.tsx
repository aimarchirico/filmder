"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import useMovies from '@/hooks/Movies';
import useUser from '@/hooks/User';
import { createClient } from "@/utils/supabase/client";
import {MenuDropdown } from "@/components/Movies";

export default function MoviesPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [likedMovies, setLikedMovies] = useState<{ id: number; name: string; image_url: string }[]>([]);
  
  const supabase = createClient();
  const { getUser } = useUser(supabase);

  useEffect(() => {
    async function fetchLikedMovies() {
      const user = await getUser();
      if (!user) {
        console.error("User not logged in");
        return;
      }

      // Hent filmer som brukeren har likt
      const { data: likedMovies, error } = await supabase
        .from("user_movies")
        .select("movies(id, name, image_url)")
        .eq("user_id", user.id)
        .eq("isLiked", true);

      if (error) {
        console.error("Error fetching liked movies:", error);
        return;
      }

      if (!likedMovies || likedMovies.length === 0) {
        console.warn("No liked movies found for user:", user.id);
        setLikedMovies([]);
        return;
      }

      // Bruk `.flatMap()` for å sikre at resultatet er et flatt array
      const formattedMovies = likedMovies.flatMap((m) => m.movies);
      setLikedMovies(formattedMovies);
    }

    fetchLikedMovies();
  }, []);

  const removeLikedMovie = async (movieId: number) => {
    const user = await getUser();
    if (!user) return;

    const { error } = await supabase
      .from("user_movies")
      .delete()
      .eq("user_id", user.id)
      .eq("movie_id", movieId);

    if (error) {
      console.error("Error removing liked movie:", error);
      return;
    }

    // Fjern filmen fra UI
    setLikedMovies((prevMovies) => prevMovies.filter(movie => movie.id !== movieId));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Hamburger Menu */}
      <div className="absolute top-4 right-4">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 hover:bg-purple-700 rounded-lg transition"
        >
          <Menu className="w-12 h-12 text-white" />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-900 ring-1 ring-secondary p-2 z-50">
          <div className="py-1 space-y-1">
            <Link href="/home" className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-lg transition">Home</Link>
            <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-lg transition">Profile</Link>
            <Link href="/friends" className="block px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-lg transition">Friends</Link>
            </div>
          </div>
        )}
      </div>
      

      {/* Title */}
      <h1 className="mt-10 text-4xl font-bold text-[var(--secondary-color)] mb-8">MY MOVIES</h1>

      {/* Subtitle */}
      <p className="text-lg text-white mb-6">Here are your liked movies</p>

      {/* Movies Grid */}
      <div className="w-full bg-[var(--secondary-color)] p-6 rounded-lg flex justify-center">
        <div className="grid grid-cols-9 gap-6">
          {likedMovies.length > 0 ? (
            likedMovies.map((movie) => (
              <div 
                key={movie.id} 
                className="relative w-32 h-48 bg-white rounded-lg shadow-md overflow-hidden group"
              >
                <img src={movie.image_url} alt={movie.name} className="w-full h-full object-cover" />
                <button 
                  className="absolute top-2 right-2 bg-black bg-opacity-50 p-1 rounded-full opacity-0 group-hover:opacity-100 transition" 
                  onClick={() => removeLikedMovie(movie.id)}
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-white">You have no liked movies yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
