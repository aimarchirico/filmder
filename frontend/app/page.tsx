import { createClient } from '@/utils/supabase/client';

export default async function Movies() {
  const supabase = await createClient();
  const { data: movies } = await supabase.from("movies").select();
        
  return <><p>Filmder av gruppe 28!</p>
  <p>Koblet til Supabase!</p>
  <pre>{JSON.stringify(movies, null, 2)}</pre></>
}