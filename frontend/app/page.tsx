import { createClient } from '@/utils/supabase/client';

export default async function Countries() {
  const supabase = await createClient();
  const { data: countries } = await supabase.from("countries").select();
        
  return <><p>Filmder av gruppe 28!</p>
  <p>Koblet til Supabase!</p>
  <pre>{JSON.stringify(countries, null, 2)}</pre></>
}