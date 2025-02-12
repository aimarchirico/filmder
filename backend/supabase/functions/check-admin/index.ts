import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    // Get user from JWT
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader)
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    const { data, error } = await supabase
      .from('admins')
      .select()
      .eq('id', user.id)
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }), 
        { status: 500, headers: corsHeaders }
      )
    }

    return new Response(
      JSON.stringify({ is_admin: !!data }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: corsHeaders }
    )
  }
})