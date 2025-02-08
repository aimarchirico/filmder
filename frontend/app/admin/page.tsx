'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleInitializeMovies = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.functions.invoke('fetch-tmdb');
    
    if (error) {
      setError(error.message);
      return;
    }
    setError(null);
  
    // Refresh movies list after initialization
    const { data: moviesData } = await supabase
      .from('movies')
      .select()
      .order('rating', { ascending: false });
      
    setMovies(moviesData ?? []);
  };

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase.from('movies').select().order("rating", { ascending: false });
      setMovies(data ?? []);
    }
    fetchData();
  }, []);

  return (
    <>
      <p>Filmder av gruppe 28! ADMIN!!!</p>
      <p>Koblet til Supabase!</p>
      <button onClick={handleInitializeMovies}>Initialize movies</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
      <pre>{JSON.stringify(movies, null, 2)}</pre>
    </>
  );
}