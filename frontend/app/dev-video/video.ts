import { createClient } from "@/utils/supabase/client";
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Verify environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase: any = createClient();
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDU5N2E5OWRhNWYzYzZjMWMzMGJlYjE0ODcyZDVhMiIsIm5iZiI6MTczODc1MjM3Mi45MTgwMDAyLCJzdWIiOiI2N2EzNDE3NDM4YmQ5ZmRiYmU4MTE3YzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0F6c3bDqf-yqTL0SL9yEO3uaYrv1FT8ZWo1vVTcBQsc'
  }
};

interface VideoResult {
  id: string;
  key: string;
  name: string;
  type: string;
  site: string;
  published_at: string;
}

async function getTrailerLink(movieId: number) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  try {
    const res = await fetch(url, options);
    const json = await res.json();
    
    // First try to find a trailer
    const trailers = json.results
      .filter((video: VideoResult) => 
        video.type === 'Trailer' && video.site === 'YouTube'
      );

    if (trailers.length > 0) {
      return `https://www.youtube.com/watch?v=${trailers[0].key}`;
    }

    // If no trailer, try other video types in order of preference
    const videoTypes = ['Teaser', 'Clip', 'Behind the Scenes', 'Featurette'];
    for (const type of videoTypes) {
      const videos = json.results
        .filter((video: VideoResult) => 
          video.type === type && video.site === 'YouTube'
        );
      
      if (videos.length > 0) {
        return `https://www.youtube.com/watch?v=${videos[0].key}`;
      }
    }

    // If still no video found, return null
    return null;
  } catch (err) {
    console.error(`Error fetching video for movie ${movieId}:`, err);
    return null;
  }
}

async function checkAllMovies() {
  const { data: movies, error } = await supabase
    .from('movies')
    .select('id, name, rating')
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching movies:', error);
    return;
  }

  console.log(`Checking trailers for ${movies.length} movies...`);
  console.log('Sorted by rating (highest first)');
  let noMovieCount = 0;
  for (const movie of movies) {
    const link = await getTrailerLink(movie.id);
    if (!link) {
      console.log(`No trailer found for movie: ${movie.name} (ID: ${movie.id}, Rating: ${movie.rating})`);
      noMovieCount++;
    } 
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  console.log(`noMovieCount: ${noMovieCount}`)
}

checkAllMovies();

