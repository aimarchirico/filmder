'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);

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
      <p>Filmder av gruppe 28!</p>
      <p>Koblet til Supabase!</p>
      <pre>{JSON.stringify(movies, null, 2)}</pre>
    </>
  );
}