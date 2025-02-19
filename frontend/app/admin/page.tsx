'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import SplashScreen from '@/components/SplashScreen';

export default function AdminPage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);


  useEffect(() => {
    async function checkAdmin() {
      const supabase = createClient()
      const { data: adminCheck } = await supabase.functions.invoke('check-admin')
      
      if (!adminCheck?.is_admin) {
        redirect('/')
      }
      setIsCheckingAdmin(false);
    }
    checkAdmin()
  }, [])

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
      <div>
        {isCheckingAdmin? 
          <SplashScreen/>
          : (<>
          <p>Filmder av gruppe 28! ADMIN!!!</p>
          <p>Koblet til Supabase!</p>
          <button onClick={handleInitializeMovies}>Initialize movies</button>
          {error && <div style={{color: 'red'}}>{error}</div>}
          <pre>{JSON.stringify(movies, null, 2)}</pre>
        </>)
        }
      </div>
    );
}