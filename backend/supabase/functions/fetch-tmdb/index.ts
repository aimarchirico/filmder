import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Fetches top rated movies from TMDB and stores in "movies" table

interface movieResponse {
  id: number,
  title: string,
  release_date: number,
  overview: string,
  poster_path: string,
  vote_average: number,
  genre_ids: number[]
}

const fetchAndSetGenres = async (supabase: any) => {
  const response = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list",
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Deno.env.get("TMDB_ACCESS_TOKEN")}`
      }
    }
  )
  const data = await response.json()
  if (!data.genres) throw new Error("No genres found")
  
  const { error } = await supabase
    .from("genres")
    .upsert(data.genres)
  
  if (error) throw error
  return data.genres
}

const fetchMovieTrailer = async (movieId: number) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${Deno.env.get("TMDB_ACCESS_TOKEN")}`,
      },
    }
  );
  const data = await response.json();
  if (!data.results) return null;

  const videoTypes = ["Trailer", "Teaser", "Clip", "Behind the Scenes", "Featurette"];
  
  for (const type of videoTypes) {
    const video = data.results.find(
      (video: any) => video.type === type && video.site === "YouTube"
    );
    
    if (video) {
      return `https://www.youtube.com/watch?v=${video.key}`;
    }
  }

  return null;
};

const fetchAndSetMovies = async (supabase: any) => {
  let allMovies: movieResponse[] = []

  for (let page = 1; page <= 250; page++) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/top_rated?page=${page}`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${Deno.env.get("TMDB_ACCESS_TOKEN")}`
        }
      }
    )
    const data = await response.json()
    if (!data.results) throw new Error("No results from TMDB API")
    allMovies = [...allMovies, ...data.results]
  }
  
  const uniqueMovies = [...new Map(allMovies.reverse().map(movie => [movie.id, movie])).values()]

  // First, insert all movies without trailers to save time
  const moviesWithoutTrailers = uniqueMovies.map(movie => ({
    id: movie.id,
    name: movie.title,
    year: new Date(movie.release_date).getFullYear(),
    description: movie.overview,
    image_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    rating: movie.vote_average,
    genre_ids: movie.genre_ids,
  }));

  const { error: initialError } = await supabase
    .from("movies")
    .upsert(moviesWithoutTrailers.map(({genre_ids, ...movie}) => movie))
    
  if (initialError) throw initialError

  // Get all movies that don't have trailers yet
  const { data: moviesWithoutTrailerData, error: selectError } = await supabase
    .from("movies")
    .select("id")
    .is("trailer_url", null);
  
  if (selectError) throw selectError

  // Only fetch trailers for movies that don't have one
  console.log(`Fetching trailers for ${moviesWithoutTrailerData.length} movies without trailers`);
  
  let updatedCount = 0;
  for (const movie of moviesWithoutTrailerData) {
    try {
      const trailerUrl = await fetchMovieTrailer(movie.id);
      if (trailerUrl) {
        const { error: updateError } = await supabase
          .from("movies")
          .update({ trailer_url: trailerUrl })
          .eq("id", movie.id);
        
        if (!updateError) {
          updatedCount++;
        }
      }
      // delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Error fetching trailer for movie ${movie.id}:`, error);
    }
  }

  return {
    totalMovies: uniqueMovies.length,
    updatedTrailers: updatedCount,
    movies: moviesWithoutTrailers
  };
}

const setMovieGenres = async (supabase: any, movies: any[]) => {
  const movieGenres = movies.flatMap(movie => 
    movie.genre_ids.map(genreId => ({
      movie_id: movie.id,
      genre_id: genreId
    }))
  )

  const { error } = await supabase
    .from("movie_genres")
    .upsert(movieGenres)

  if (error) throw error
  return movieGenres
}

serve(async (req) => {
  // Add CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Add CORS headers to all responses
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: corsHeaders 
        }
      );
    }

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 404 })
    }

    // Check if user is admin
    const { data: adminData } = await supabase
      .from('admins')
      .select()
      .eq('id', user.id)
      .single()

    if (!adminData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403 })
    }
    const genres = await fetchAndSetGenres(supabase)
    const movieResult = await fetchAndSetMovies(supabase)
    const movieGenres = await setMovieGenres(supabase, movieResult.movies)

    return new Response(
      JSON.stringify({ 
        genres: genres.length, 
        movies: movieResult.totalMovies, 
        updatedTrailers: movieResult.updatedTrailers,
        relationships: movieGenres.length 
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: corsHeaders
      }
    );
  }
})