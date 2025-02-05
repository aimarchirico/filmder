import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  try {
    const response = await fetch(
      'https://api.themoviedb.org/3/movie/popular',
      {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDU5N2E5OWRhNWYzYzZjMWMzMGJlYjE0ODcyZDVhMiIsIm5iZiI6MTczODc1MjM3Mi45MTgwMDAyLCJzdWIiOiI2N2EzNDE3NDM4YmQ5ZmRiYmU4MTE3YzQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.0F6c3bDqf-yqTL0SL9yEO3uaYrv1FT8ZWo1vVTcBQsc`
        }
      }
    )
    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 })
  }
})